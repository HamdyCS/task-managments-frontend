# AGENTS.md

## Quick Commands

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck (`tsc -b`) then build
- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- No test runner configured yet

## Stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** — CSS-first config via `@tailwindcss/vite`; theme lives in `src/index.css` (`@theme`, CSS variables). No `tailwind.config.js`.
- **react-router-dom v7** — config-based routes via `useRoutes` / `RouteObject`
- **framer-motion** — animations; reuse shared variants from `src/animations`
- **i18next + react-i18next** — `en` (default) + `ar`; RTL toggling
- **react-icons** — Feather (`Fi*`), Material (`Md*`), etc.
- **No** axios, react-query, react-hot-toast, or UI component library are installed — the app is currently a marketing/landing frontend with no API integration yet.

## Architecture

Presentational React app — no backend calls yet. Pages compose sections; sections are presentational only.

```
routes/ → Pages → Section components → shared ui/common components
```

- **Pages** (`src/pages/`): compose sections for a route.
- **Sections** (`src/components/website/<feature>/`): page sections (Hero, Features, etc.).
- **Layout** (`src/components/website/layout/`): route chrome (Navbar, Footer, Container).
- **UI** (`src/components/ui/`): small reusable primitives (Button).
- **Common** (`src/components/common/`): generic building blocks (AnimatedCounter).
- **Animations** (`src/animations/`): centralized framer-motion `Variants`.

## Folder Structure

```
src/
  assets/       # static images
  animations/   # framer-motion Variants (fadeIn, fadeInUp, staggerContainer, ...)
  components/
    common/     # generic building blocks
    ui/         # reusable primitives (Button)
    website/    # marketing site components, grouped by feature
      home/     # home page sections
      layout/   # Container, WebSiteLayout
      navbars/  # Navbar
      footers/  # Footer
  hooks/        # app hooks (useTheme)
  i18n/
    index.ts    # i18next init
    locales/
      en/common.json
      ar/common.json
  pages/        # route-level components (HomePage, NotFoundPage, ...)
  routes/       # React Router config per feature (website/WebSiteRoutes.tsx)
```

## Styling (Tailwind v4)

- All theming via CSS variables in `src/index.css`: `--primary`, `--background`, `--foreground`, `--border`, `--muted-foreground`, etc. — used as `bg-primary`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-background`, `bg-card`, `bg-muted`, `bg-accent`, `text-destructive`, etc.
- Dark mode via `.dark` class on `<html>`; `@custom-variant dark` in CSS. Toggle with the `useTheme` hook (persisted in `localStorage`).
- Prefer design-token utilities over hardcoded hex values.
- Rounded corners: `rounded-lg`, `rounded-xl`; shadows: `shadow-lg shadow-primary/25`.
- `bg-grid-pattern` and `glass-panel` custom utilities exist in `src/index.css`.

## Internationalization

- `t("nav.product")` dot-notation keys; namespaces are per-file JSON (currently `common.json`).
- Every new feature must include both English (`en`) and Arabic (`ar`) translations.
- Language toggling updates `document.documentElement.dir` (`rtl`/`ltr`) and `lang`; persisted in `localStorage` under `language`.
- No hardcoded strings in components — use `t('key')`.

## Routing

- Config-based routes using `RouteObject` arrays returned from `useRoutes`.
- Route configs live in `src/routes/`, grouped by feature (e.g. `website/WebSiteRoutes.tsx`).
- Use `<Outlet />` in layouts to render nested children.
- Routes are wrapped in `<BrowserRouter>` in `src/main.tsx`.

## Animation

- Define shared framer-motion `Variants` in `src/animations/index.ts` (`fadeIn`, `fadeInUp`, `fadeInDown`, `scaleIn`, `slideInLeft`, `slideInRight`, `staggerContainer`, `staggerItem`).
- Use `initial`/`animate` (or `whileInView` with `viewport={{ once: true }}`) + `variants` on `motion.*` elements.
- `AnimatePresence` for enter/exit transitions (e.g. mobile menu).

## Code Style

- Functional components only; strict TypeScript (no `any`).
- Named exports for pages, sections, layouts, components, hooks (`export function Foo()`).
- Default export only for route configs and the app entry (`WebSiteRoutes`, `App`).
- Small, single-responsibility components; prefer composition over prop drilling.
- Keep files focused; group static data (e.g. `stats`, `navLinks`) as module-level consts.
- Existing files mix single-quote (hooks/animations/i18n) and double-quote (pages/components) styles; match the file you're editing.
- `verbatimModuleSyntax` is on — use `import type` for type-only imports.

## Naming

| Item | Convention |
|------|-----------|
| Hooks | `useSomething` (`useTheme`) |
| Components | `PascalCase.tsx` |
| Pages | `XxxPage.tsx` |
| Route configs | `XxxRoutes.tsx` (default export) |
| Animations | `camelCase` variants (`fadeInUp`) |
| Translation namespaces | `common.json`, `auth.json`, ... |

## Backend Reference

`BackendReadme.md` in repo root contains all endpoints, DTOs, auth flow, pagination, roles, SignalR hub, and error formats. Consult it before writing any API integration code. Do not guess. (Not yet used — no API layer exists.)

## UI Design Source

`stitch_task_management/` contains all designed UI screens (HTML + screenshots).

- Always use these screens as the primary UI reference.
- Match layouts, spacing, components, colors, and UX of those designs.
- Before implementing a feature, check whether a corresponding design already exists in this folder.
- New screens added later are the latest source of truth for the UI.
