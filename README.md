<div align="center">
  <img src="src/assets/logo.png" alt="WorkPilot Logo" width="200" />
  <h1>WorkPilot</h1>
  <p><strong>A production-grade task management frontend built with React 19, TypeScript, and a modern full-stack architecture.</strong></p>

  [![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vite.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
  [![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.12-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org)
  [![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-EF4444?style=flat-square)](https://tanstack.com/query)
</div>

---

## Overview

WorkPilot is the frontend client for a team-oriented project and task management platform. It provides a fast, intuitive interface for managing workspaces, projects, tasks, and team collaboration -- with full dark mode, Arabic RTL support, real-time notifications via SignalR, and a dual dashboard architecture (user + admin).

The frontend consumes a RESTful ASP.NET Core backend with JWT authentication via HttpOnly cookies, role-based authorization, and a SignalR hub for live updates. It is designed as a presentational SPA with no server-side rendering -- all data flows through Axios and is managed by TanStack Query for server state and Redux Toolkit for client state.

---

## Features

### Authentication

- Email/password registration with validation (name length, password complexity, age >= 18)
- Email confirmation flow (token-based)
- Login with JWT HttpOnly cookies (`access_token` / `refresh_token`)
- Google OAuth integration via redirect callback
- Forgot password with OTP verification
- Password reset via emailed token
- Email change with confirmation
- Account deletion with emailed confirmation token
- Automatic token refresh with queued request retry
- Protected routes and guest-only routes

### Dashboard

- **User Dashboard**: KPI cards, task distribution bar chart, recent active tasks table, and team performance -- scoped to the selected workspace
- **Admin Dashboard**: Global statistics (users, workspaces, projects, tasks), recent activity feed, member performance table, and workspace overviews with PDF export
- Role-based dashboard routing (Admin vs User)
- Workspace-scoped data isolation

### Workspace Management

- Create, edit, delete workspaces
- Workspace selection with global state persistence
- Workspace member listing with paginated results
- Role-based workspace access (`Owner`, `ProjectManager`, `Member`)
- Workspace role detection and UI adaptation
- Workspace invitations (send, receive, accept, reject)

### Project Management

- Create, edit, delete projects within a workspace
- Project status management (`Active`, `OnHold`, `Completed`)
- Project listing with pagination
- Project selector for task filtering

### Task Management

- Create, edit, delete tasks within projects
- Task assignment and unassignment
- Status transitions (`Backlog` -> `Todo` -> `InProgress` -> `Review` -> `Done`)
- Priority levels (`Low`, `Medium`, `High`, `Critical`)
- Filtering by status, priority, and search term
- Sorting and pagination
- "My tasks" vs "All tasks" mode
- Task details drawer with comments and attachments
- Deadline tracking with overdue detection

### Notifications

- Real-time push notifications via SignalR (`/notificationHub`)
- Infinite scroll notification list
- Read/unread filtering
- Mark as read
- Unread count badge
- Automatic cache invalidation on new notifications

### Reports

- Workspace overview report (total projects, tasks, members, status breakdown)
- Task distribution by status (bar chart)
- Task distribution by priority (doughnut chart)
- Member performance metrics (assigned, in-progress, done counts)
- PDF report download
- Admin reports with date range filtering
- Admin member performance across all workspaces

### Account Settings

- Profile information editing (first name, last name, date of birth)
- Email change with OTP confirmation
- Password change/reset
- Account deletion with email confirmation

### Admin Dashboard

- Global user management (list all users, admins, regular users)
- Admin registration
- Workspace overview with stats and filtering
- Workspace detail view (members, projects, completion rate)
- Member performance across workspaces
- Date-filtered workspace reports with PDF export
- Recent activity feed with pagination

---

## Architecture

### Data Flow

```
Component
  |
Custom React Query Hook
  |
Service Function
  |
Axios Instance (with interceptors)
  |
Backend API
```

**Server state** is managed by TanStack Query (queries, mutations, cache invalidation). **Client/UI state** is managed by Redux Toolkit (auth, theme, selected workspace) and local component state. This separation keeps server data synchronized with the backend while keeping UI state predictable.

### State Management

| Store Slice | Purpose | Persisted? |
|---|---|---|
| `auth` | Current user, authentication state, forgot-password state | No (session-only) |
| `theme` | Dark/light mode preference | `localStorage` |
| `selectedWorkSpace` | Active workspace ID, object, and user's role | No |

TanStack Query manages all server state: user data, workspaces, projects, tasks, notifications, reports, and admin data. Query keys are structured to enable automatic cache invalidation when mutations succeed.

### Authentication Lifecycle

```
Login Page
  -> Formik + Yup validation
  -> authApi.post("/auth/login")
  -> Backend sets HttpOnly cookies (access_token, refresh_token)
  -> useCurrentUser() fires query to GET /auth
  -> AuthProvider dispatches setUser() to Redux
  -> Protected routes render
```

On subsequent page loads, `AuthProvider` calls `useCurrentUser()` to restore the session from cookies. If the token expires, the Axios interceptor catches the 401, refreshes the token via `POST /auth/refresh-token`, and retries all queued requests automatically.

### Routing

Config-based routes using `useRoutes` with `RouteObject` arrays. Three route groups:

```
/ (public website)
  / (home)
  /product
  /features
  /solutions

/auth (guest-only, redirect if authenticated)
  /sign-in
  /sign-up
  /verify-email
  /confirm-email
  /forgot-password
  /change-email
  /reset-password
  /auth/callback (OAuth)

/dashboard (requires role=User)
  /dashboard (overview)
  /dashboard/workspaces
  /dashboard/projects
  /dashboard/tasks
  /dashboard/team
  /dashboard/notifications
  /dashboard/reports (requires Owner or ProjectManager)
  /dashboard/account/*
  /dashboard/access-denied

/admin/dashboard (requires role=Admin)
  /admin/dashboard (overview)
  /admin/dashboard/users
  /admin/dashboard/workspaces
  /admin/dashboard/reports
  /admin/dashboard/account/*
```

### Workspace Context

The selected workspace is stored in Redux (`selectedWorkSpace`). Every workspace-scoped query (projects, tasks, dashboard, reports) uses the workspace ID from this slice. Switching workspaces triggers cache invalidation for workspace-dependent queries. The workspace role (`Owner` | `ProjectManager` | `Member`) controls which UI elements and routes are accessible.

---

## Project Structure

```
src/
  api/                  # Axios instances (authApi, api, refreshTokenApi) and interceptors
  animations/           # Shared framer-motion variants (fadeIn, fadeInUp, stagger, etc.)
  assets/               # Static images (logo)
  common/               # Shared utilities (Regex patterns)
  components/
    account-settings/   # Profile, email, password, danger zone forms
    auth/               # Social login providers, forgot password components
    common/             # AnimatedCounter, ThemedToaster
    Dashboard/          # Dashboard-specific components
      admin/            # Admin reports, workspace detail views
      empty/            # Empty state components
      layout/           # DashboardLayout, AdminDashboardLayout
      navbars/          # DashboardNavbar, AdminDashboardNavbar
      notifications/    # Notification list components
      projects/         # Project table, form dialogs, empty states
      reports/          # Report tabs, charts, overview, members, projects
      sections/         # KPI cards, task distribution, team performance, activity
      sidbars/          # DashboardSidebar, AdminDashboardSidebar
      skeleton/         # Reusable skeleton loaders (KPI, chart, table, etc.)
      tasks/            # Task table, Kanban, modals, filters, assign/edit
      teams/            # Members, invites (sent/received), invite modal
      users/            # Admin user table components
      workspaces/       # Workspace table, form, filters, detail drawer
    ui/                 # Reusable primitives (Button, ConfirmDialog, DateRangePicker, etc.)
    website/            # Marketing/landing page sections (home, navbars, footers)
  config.ts             # API endpoint configuration (all routes as typed functions)
  dtos/                 # TypeScript interfaces for API payloads
    admin/              # Admin DTOs
    auth/               # UserDto, LoginDto, RegisterDto, etc.
    notification/       # NotificationDto
    project/            # ProjectDto
    reports/            # WorkSpaceReportDto, MemberPerformanceDto, etc.
    task/               # TaskDto, TaskQueryParams, CreateTaskDto, etc.
    workspace/          # WorkSpaceDto, DashboardDto, PaginationResultDto, etc.
  hooks/                # Custom React hooks (data fetching + domain logic)
    admin/              # Admin dashboard, users, workspaces, reports hooks
    auth/               # useLogin, useRegister, useCurrentUser, useLogout, etc.
    language/           # useLanguage (RTL/LTR switching)
    notification/       # useNotifications (infinite query), useNotificationSignalR
    project/            # useProjects, useCreateProject, etc.
    reports/            # useWorkspaceReport, useProjectTasksByStatus, etc.
    task/               # useProjectTasks, useCreateTask, useAssignTask, etc.
    team/               # useWorkspaceMembers, useInviteMember, etc.
    workspace/          # useUserWorkspaces, useDashboard, useWorkspaceRole, etc.
    MutationCallBack.ts # Generic mutation callback interface
    QueryCallBack.ts    # Generic query callback interface
  i18n/                 # i18next setup + locale files
    index.ts            # i18next initialization
    locales/
      en/common.json    # English translations
      ar/common.json    # Arabic translations
  index.css             # Tailwind v4 theme (CSS variables), dark mode, animations
  layouts/              # AuthLayout (public auth pages layout)
  main.tsx              # App entry (providers: Redux, React Query, BrowserRouter)
  pages/                # Route-level components
    admin-dashboard/    # AdminDashboardPage, AdminUsersPage, AdminWorkspacesPage, etc.
    auth/               # LoginPage, RegisterPage, ForgotPasswordPage, etc.
    dashboard/          # DashboardPage, TasksPage, ProjectsPage, etc.
  providers/            # Context providers (AuthProvider, LanguageProvider, NotificationProvider, ThemeProvider)
  routes/               # Route config objects
    dashboard/          # DashboardRoutes, AdminDashboardRoutes, RequireWorkSpaceRole
    website/            # WebSiteRoutes, AuthRoutes, RequireGuest
    RequireRole.tsx     # Global role guard (Admin/User)
  services/             # API service functions (thin wrappers around Axios calls)
  store/                # Redux store (auth, theme, selectedWorkSpace slices)
  types/                # Shared TypeScript types and enums
  utils/                # Utility functions (formatDate, formatTimeAgo, getRoleBadgeClasses)
```

---

## Component Architecture

### Layout System

- **WebSiteLayout**: Marketing site chrome (Navbar + Footer + Container)
- **AuthLayout**: Centered auth card for login/register flows
- **DashboardLayout**: Sidebar + Navbar + scrollable content area (sidebar state managed locally)
- **AdminDashboardLayout**: Same structure as dashboard, separate sidebar/navbar with admin-specific navigation

### Reusable Components

| Component | Purpose |
|---|---|
| `Button` | Shared button with loading state, variants |
| `ConfirmDialog` | Animated confirmation modal (Framer Motion) |
| `DateRangePicker` | Date range selection (react-day-picker) |
| `CustomSkeletonTheme` | Theme-aware skeleton wrapper (light/dark colors) |
| `AnimatedCounter` | Number counter animation (Framer Motion) |
| `ThemedToaster` | Theme-aware toast notifications (Sonner) |
| `AuthSpinner` | Loading spinner during auth initialization |

### Dashboard Components

Each major feature (tasks, projects, workspaces, teams) follows a consistent pattern:

```
FeatureTable.tsx       # Data table with sorting/filtering
FeatureFormDialog.tsx  # Create/edit form dialog
FeatureDetailsDrawer.tsx # Slide-in detail panel
FeatureActionsMenu.tsx # Context menu (edit, delete, etc.)
FeatureEmptyState.tsx  # Empty state illustration
FeatureTableSkeleton.tsx # Loading skeleton
```

### Skeleton System

Nine dedicated skeleton components (`KpiSkeleton`, `ChartSkeleton`, `TableSkeleton`, `TeamSkeleton`, `DashboardSkeleton`, `AdminDashboardSkeleton`, `ReportsSkeleton`, `ActivitySkeleton`, `TeamsPageSkeleton`) wrap content in a `CustomSkeletonTheme` that adapts base/highlight colors to the current theme.

---

## Data Fetching

TanStack Query powers all server state. Every API call goes through a custom hook that encapsulates the query key, fetcher function, and caching strategy.

### Query Pattern

```typescript
// Hook
export default function useProjectTasks(workspaceId, projectId, mode, params) {
  const queryKey = ["tasks", workspaceId, projectId, mode, ...params];
  return useQuery({
    queryKey,
    queryFn: () => mode === "my" ? getMyTasks(...) : getProjectTasks(...),
    enabled: workspaceId !== null && projectId !== null,
    placeholderData: (prev) => prev,  // keeps previous data during refetch
  });
}
```

### Mutation Pattern

```typescript
// Hook
export default function useCreateTask(opts) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation({
    mutationFn: (dto) => createTask(workspaceId, projectId, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      opts.onSuccess?.(data);
    },
  });
  return { mutateAsync, isPending, isError, error };
}
```

### Infinite Queries

Notifications use `useInfiniteQuery` for infinite scrolling with `IntersectionObserver` (via `react-intersection-observer`). The page parameter advances automatically based on `hasNextPage`.

---

## API Client

### Axios Instances

Three Axios instances serve different purposes:

| Instance | Purpose |
|---|---|
| `authApi` | Authentication endpoints and most API calls (with interceptor for token refresh) |
| `api` | Protected endpoints that require the access token |
| `refreshTokenApi` | Token refresh only (avoids circular interceptor) |

All instances are configured with `withCredentials: true` to send HttpOnly cookies.

### Token Refresh Interceptor

```
API Request
  -> 401 response
  -> Add request to failedQueue
  -> If not already refreshing:
       POST /auth/refresh-token
       Process queue (resolve all pending requests)
       Retry original request
  -> If already refreshing:
       Wait for queue processing, then retry
```

This ensures only one refresh request fires at a time, and all concurrent requests wait for it to complete.

### Endpoint Configuration

All API endpoints are centralized in `src/config.ts` as typed functions, ensuring type-safe URL construction:

```typescript
config.task.all(workspaceId, projectId)        // /workspaces/{w}/projects/{p}/tasks
config.task.status(workspaceId, projectId, t)  // /workspaces/{w}/projects/{p}/tasks/{t}/status
config.admin.reports.overview(from, to)         // /admin/reports/overview?from=...&to=...
```

---

## Authentication & Authorization

### Cookie-Based Auth

- JWT access token stored in `access_token` HttpOnly cookie
- Refresh token stored in `refresh_token` HttpOnly cookie
- No tokens in localStorage or Authorization header
- Cookies are sent automatically with `withCredentials: true`

### Route Guards

| Guard | Behavior |
|---|---|
| `RequireRole` | Checks global role (`Admin` -`User`) from Redux store |
| `RequireWorkSpaceRole` | Checks workspace role (`Owner` - `ProjectManager` - `Member`) from Redux store |
| `RequireGuest` | Redirects authenticated users back |

### Role-Based UI

- **Admin**: Sees admin dashboard, user management, workspace overviews
- **User**: Sees user dashboard, their workspaces/projects/tasks
- **Owner**: Can manage workspace (edit, delete, invite members, access reports)
- **ProjectManager**: Can manage projects and tasks within workspace
- **Member**: Read-only access to workspace data

> **Note**: Frontend authorization is a UX/access-control layer. Backend authorization remains authoritative for all data operations.

---

## Real-Time Notifications (SignalR)

The `NotificationProvider` establishes a SignalR connection to `/notificationHub` with automatic reconnection.

```
Backend Event (task assigned, comment added, invite, etc.)
  -> SignalR Hub sends ReceiveNotification to user/group
  -> Frontend connection.on("ReceiveNotification") handler fires
  -> Query cache invalidated (notifications "all" and "unread")
  -> UI updates automatically via TanStack Query refetch
```

The connection uses `withCredentials: true` for cookie-based authentication and handles reconnection gracefully via `withAutomaticReconnect()`.

---

## Internationalization

- **Languages**: English (`en`) and Arabic (`ar`)
- **RTL support**: `document.documentElement.dir` toggled to `rtl`/`ltr` based on language
- **Font switching**: Inter (English) / Cairo (Arabic) via CSS variables
- **Persistence**: Language preference saved to `localStorage`
- **Translation keys**: Dot-notation keys (`t("dashboard.kpi.totalProjects")`) with per-feature JSON files
- **No hardcoded strings**: All user-facing text uses `t('key')`

The `LanguageProvider` hook detects browser language on first visit, persists the choice, and updates `i18next`, `document.dir`, and `document.lang` on every change.

---

## Styling & Design System

### Tailwind CSS v4

CSS-first configuration via `@tailwindcss/vite`. No `tailwind.config.js` -- all theming lives in `src/index.css`:

- **CSS variables**: `--primary`, `--background`, `--foreground`, `--border`, `--muted-foreground`, `--success`, `--warning`, `--destructive`, etc.
- **Dark mode**: `.dark` class on `<html>`, toggled by Redux + `localStorage`
- **Custom utilities**: `bg-grid-pattern`, `glass-panel`
- **Animations**: `animate-fade-in`, `animate-scale-in`, `animate-drawer-in`, `animate-loading`

### Theme Tokens

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--primary` | `#4f46e5` (Indigo) | `#6d68f4` | Buttons, links, accents |
| `--success` | `#16a34a` | `#34d399` | Completed states, progress |
| `--warning` | `#d97706` | `#fbbf24` | Review status, deadlines |
| `--destructive` | `#dc2626` | `#f05454` | Errors, delete actions |

### Animations

Framer Motion with shared variants defined in `src/animations/index.ts`: `fadeIn`, `fadeInUp`, `fadeInDown`, `scaleIn`, `slideInLeft`, `slideInRight`, `staggerContainer`, `staggerItem`. Used consistently across KPI cards, charts, modals, and page transitions.

---

## Forms & Validation

Formik + Yup handle all form state and validation:

- **Registration**: Name (2-50 chars), email, password (8-80 chars, uppercase, lowercase, digit, special char), date of birth (>= 18 years)
- **Login**: Email + password
- **Task creation/editing**: Name, description, deadline, priority, assignee
- **Workspace/project forms**: Name + description
- **Account settings**: Profile info, email change, password change

Server errors (Problem Details) are caught in Axios error handlers and displayed via Sonner toasts.

---

## Charts & Data Visualization

Chart.js (via `react-chartjs-2`) for dashboard analytics:

- **Bar charts**: Task distribution by status (Backlog, Todo, InProgress, Review, Done)
- **Doughnut charts**: Task distribution by priority (Low, Medium, High, Critical)
- Charts are responsive, theme-aware, and handle empty data states

---

## Forms & Date Handling

- **react-day-picker** for date range selection in reports
- **date-fns** for date formatting and manipulation
- **Formik** for form state management
- **Yup** for schema-based validation

---

## Performance Considerations

- **TanStack Query caching**: `placeholderData: (prev) => prev` keeps previous data during refetches, preventing UI flash
- **Query invalidation**: Mutations invalidate only affected query keys (e.g., `["tasks"]` after creating a task)
- **Memoization**: `TasksTable` wrapped in `React.memo` to prevent unnecessary re-renders
- **Infinite scrolling**: Notifications use `useInfiniteQuery` + `IntersectionObserver` to load pages on demand
- **Code splitting**: Route-based lazy loading via React Router
- **Stale data handling**: Previous page data persists while new pages load

---

## Environment Configuration

```env
VITE_BASE_API_URL=https://localhost:7018/api
VITE_SIGNALR_URL=https://localhost:7018/notificationHub
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)
- Backend API running (see `BackendReadme.md` for backend setup)

### Installation

```bash
git clone <repository-url>
cd task-managments-frontend
npm install
```

### Environment Setup

Create `.env.development` in the project root:

```env
VITE_BASE_API_URL=https://localhost:7018/api
VITE_SIGNALR_URL=https://localhost:7018/notificationHub
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build     # TypeScript check + Vite build
npm run preview   # Preview production build locally
```

### Lint

```bash
npm run lint
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint with flat config |

---

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tooling and dev server |
| Tailwind CSS | v4 | Utility-first CSS (CSS-first config) |
| Redux Toolkit | 2.12 | Client state (auth, theme, workspace) |
| TanStack React Query | 5 | Server state (caching, mutations, infinite queries) |
| React Router | v7 | Config-based routing |
| Axios | 1.19 | HTTP client with interceptors |
| Formik | 2.4 | Form state management |
| Yup | 1.7 | Schema-based validation |
| Chart.js + react-chartjs-2 | 4.5 / 5.3 | Data visualization (bar, doughnut charts) |
| Framer Motion | 13 | Animations and transitions |
| i18next + react-i18next | 26 / 17 | Internationalization (en + ar) |
| SignalR | 10 | Real-time notifications |
| Sonner | 2 | Toast notifications |
| react-day-picker | 10 | Date range picker |
| react-loading-skeleton | 3.5 | Loading skeleton components |
| react-icons | 5.7 | Icon library (Feather, Material) |
| react-intersection-observer | 11 | Infinite scroll detection |
| @floating-ui/react | 0.27 | Tooltip/popover positioning |
| date-fns | 4.4 | Date formatting and manipulation |

---

## Backend Integration

The frontend expects the backend to be running at the URL configured in `VITE_BASE_API_URL`. Key integration points:

- **Authentication**: JWT in HttpOnly cookies (`access_token`, `refresh_token`)
- **API base URL**: All endpoints prefixed with the configured base URL
- **SignalR hub**: `/notificationHub` for real-time notifications
- **CORS**: Backend must allow the frontend origin (`http://localhost:5173` in development)
- **Cookies**: Backend sets/clears auth cookies; frontend sends them automatically

For complete API endpoint documentation, see `BackendReadme.md` in the project root.

---

## Design Reference

The `stitch_task_management/` folder contains all designed UI screens (HTML + screenshots). These serve as the primary UI reference for implementing new features. The design follows a **Corporate / Modern** aesthetic:

- Clean surfaces with soft borders and subtle shadows
- Indigo primary color with functional secondary palette
- Consistent 8px spacing grid
- Inter font (English) / Cairo font (Arabic)
- Tonal layering for depth hierarchy
