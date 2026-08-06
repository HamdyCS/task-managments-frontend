# AGENTS.md

## Quick Commands

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck (`tsc -b`) then build
- `npm run lint` — ESLint
- No test runner configured yet

## Architecture

Strict layering — components never call APIs directly.

```
Page → Component → Custom Hook → Service → Axios → Backend API
```

- **Components**: presentational only, no business logic, no API calls
- **Hooks**: React Query logic, state, derived data
- **Services**: Axios requests only, no React dependencies
- **Axios**: single instance, interceptors, base URL from env

## Folder Structure

```
src/
  api/          # axios instance + endpoint constants
  services/     # one service per feature (AuthService, TaskService, etc.)
  hooks/        # one hook per service method (useLogin, useTasks, etc.)
  pages/        # route-level components
  components/   # reusable presentational components
  layouts/      # layout wrappers (auth, dashboard)
  routes/       # React Router config
  types/        # TypeScript interfaces matching backend DTOs
  config/       # app config
  i18n/         # react-i18next setup (en, ar)
  utils/        # pure helper functions
  assets/       # images, icons
```

## API Configuration

Base URL from `.env` — never hardcode:

```
VITE_API_BASE_URL=http://localhost:5102
```

## Axios

One instance with:
- `baseURL` from env
- `withCredentials: true` (cookie-based auth)
- request interceptor (attach cookies)
- response interceptor (normalize errors, handle 401 refresh)

## Endpoints

Define all endpoint paths in `src/api/endpoints.ts` as constants grouped by feature:

```ts
export const AUTH = {
  LOGIN: '/api/auth/login',
  REGISTER_USER: '/api/auth/register-user',
  // ...
} as const;

export const WORKSPACES = { ... } as const;
export const PROJECTS = { ... } as const;
export const TASKS = { ... } as const;
// etc.
```

**Single source of truth**: `BackendReadme.md`. Never guess endpoint paths or DTO shapes.

## React Query

- Queries and mutations only inside hooks
- Centralize query keys in a `queryKeys.ts` file
- Always invalidate related queries after mutations
- Use optimistic updates where it makes sense

## Types

- Create TypeScript interfaces matching backend DTOs exactly
- Group by feature in `src/types/`
- Reuse interfaces — no duplicate DTO definitions
- Enums serialized as strings by backend (e.g. `"InProgress"`, not `2`)

## Authentication

- Cookie-based JWT (HttpOnly cookies: `access_token`, `refresh_token`)
- Never store tokens in localStorage
- Axios must send `withCredentials: true`
- Load current user via React Query (`GET /api/auth`)
- Support Protected Routes, Guest Routes, Layout Routes

## Routing

React Router organized by feature:
- `/login`, `/register` — Guest routes
- `/`, `/workspaces/*`, `/projects/*` — Protected routes
- Layout routes for shared chrome (sidebar, navbar)

## Internationalization

react-i18next with `en` (default) and `ar`. No hardcoded strings in components — use `t('key')`.

- English is the default language.
- Every new feature must include both English and Arabic translations.
- Translation files should be organized by feature whenever possible (e.g. `src/i18n/locales/en/auth.json`).

## Toasts

React Hot Toast. Show success/error from hooks, not components.

## Error Handling

Centralize API error parsing in one utility. Backend returns RFC 7807 Problem Details.

## Code Style

- Functional components only
- Strict TypeScript — no `any`
- Named exports (except page components which can use default)
- Small, reusable, single-responsibility components
- Prefer composition over prop drilling
- Keep files focused

## Naming

| Item | Convention |
|------|-----------|
| Hooks | `useSomething` |
| Services | `SomethingService` |
| Components | `PascalCase.tsx` |
| Other files | `camelCase.ts` |
| Interfaces | `SomethingDto` |
| Enums | `SomethingEnum` |
| Query keys | `QUERY_KEYS.something` |

## Feature Workflow

When implementing a new backend endpoint:

1. Add endpoint constant to `src/api/endpoints.ts`
2. Add/confirm DTO types in `src/types/`
3. Create service method
4. Create custom hook (React Query)
5. Build UI components (presentational)
6. Connect to page via hook
7. Handle loading/error/success states
8. Invalidate related queries after mutations

## Backend Reference

`BackendReadme.md` in repo root contains all endpoints, DTOs, auth flow, pagination, roles, SignalR hub, and error formats. Consult it before writing any API integration code. Do not guess.

## UI Design Source

`stitch_task_management/` contains all designed UI screens (HTML + screenshots).

- Always use these screens as the primary UI reference.
- Match layouts, spacing, components, colors, and UX of those designs.
- Before implementing a feature, check whether a corresponding design already exists in this folder.
- New screens added later are the latest source of truth for the UI.
