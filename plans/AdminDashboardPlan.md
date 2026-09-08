# Admin Dashboard — Overview Page

## Objective

Implement the **Admin Dashboard Overview page** in the frontend project.

The most important requirement is:

> **The existing User Dashboard is the absolute visual and UX reference for this page.**

The Admin Dashboard must feel like it belongs to the **exact same product** as the User Dashboard.

Do NOT create a new visual style or redesign anything.

The final result should look like the same designer/developer created both dashboards, with the only major differences being:

- Admin-specific layout/navigation
- Admin-specific data
- Admin-specific dashboard sections

---

# 1. Mandatory First Step — Inspect Before Coding

Before writing or modifying any code, inspect the existing frontend project thoroughly.

You MUST inspect:

1. The complete **User Dashboard**
2. User Dashboard layout
3. User Dashboard sidebar
4. User Dashboard header/page header
5. KPI/stat cards
6. Existing Card components
7. Existing UI components
8. Existing Skeleton components
9. `CustomSkeletonTheme.tsx`
10. Existing chart implementation
11. Existing React Query patterns
12. Existing service/hook structure
13. Existing i18n implementation
14. Existing Arabic RTL / English LTR handling
15. Existing responsive behavior
16. Existing dark/light mode implementation
17. Existing `formatTimeAgo` utility
18. Existing `RequireRole` component
19. Existing folder/component naming conventions
20. `BackendReadme.md`

Do not start implementation until you understand how the User Dashboard is structured.

### Important

The User Dashboard is the **source of truth for UI decisions**.

If you find an existing component or pattern that can be reused, reuse it.

Do not create duplicate components unnecessarily.

---

# 2. Hard UI/Design Constraint

The Admin Dashboard must match the User Dashboard's existing visual language as closely as possible.

This applies to:

- Layout
- Sidebar
- Header
- Page header
- Background
- Cards
- KPI cards
- Typography
- Font sizes
- Font weights
- Colors
- Borders
- Border radius
- Shadows
- Spacing
- Padding
- Grid system
- Icons
- Icon containers
- Charts
- Skeletons
- Empty states
- Animations
- Hover states
- Dark mode
- Light mode
- Responsive behavior
- RTL/LTR behavior

### Do NOT

- Introduce a new design system
- Introduce a different card style
- Introduce different spacing rules
- Introduce different typography
- Introduce a new color palette
- Add unnecessary gradients
- Add unnecessary shadows
- Add a new icon library
- Add a new chart library
- Add a new CSS architecture
- Redesign the User Dashboard
- Modify existing User Dashboard styling just to make Admin Dashboard easier

If something already exists in the User Dashboard, prefer reusing it.

---

# 3. Admin Layout

Create/use a separate Admin Dashboard layout.

The Admin navigation is:

```text
ADMIN

Overview
Users
Workspaces
Reports

────────────

Settings
Logout
```

Use appropriate existing React Icons.

The Admin layout should visually match the User Dashboard layout exactly, while having its own navigation structure.

Do not invent a new sidebar design.

The route for the overview page should be:

```text
/admin/dashboard
```

The Overview item should be the active navigation item on this page.

Other Admin navigation items may point to their existing routes if they already exist.

If those pages/routes do not exist yet, do not implement them as part of this task.

---

# 4. Authorization

The Admin Dashboard must remain protected using the existing:

```text
RequireRole
```

component/pattern.

Do not create another authorization mechanism.

Do not duplicate role-checking logic inside the page.

Use the existing project authentication/authorization architecture.

---

# 5. Dashboard Data

The backend is already implemented.

This is a **frontend-only task**.

Do NOT modify the backend.

Do NOT create new backend endpoints.

Do NOT modify backend DTOs.

Do NOT invent API responses.

The API endpoint and response contract are documented in:

```text
BackendReadme.md
```

Read that file and use the existing endpoint exactly as documented.

The dashboard data is based on:

```csharp
public class AdminDashboardDto
{
    public int TotalUsersCount { get; set; }

    public int TotalAdminsCount { get; set; }

    public int TotalUsersInLast30DaysCount { get; set; }

    public int TotalWorkspacesCount { get; set; }

    public int TotalWorkspacesInLast30DaysCount { get; set; }

    public int TotalProjectsCount { get; set; }

    public int TotalProjectsInLast30DaysCount { get; set; }

    public int TotalTasksCount { get; set; }

    public int TotalTasksInLast30DaysCount { get; set; }

    public TasksOverviewDto TasksOverviewDto { get; set; }
}
```

Tasks overview:

```csharp
public class TasksOverviewDto
{
    public int BacklogCount { get; set; }

    public int TodoCount { get; set; }

    public int InProgressCount { get; set; }

    public int ReviewCount { get; set; }

    public int DoneCount { get; set; }
}
```

Recent activities:

```csharp
public class RecentActivityDto
{
    public long Id { get; set; }

    public string Text { get; set; }

    public RecentActivityType ActivityType { get; set; }

    public DateTime CreatedAt { get; set; }
}
```

Activity types:

```csharp
public enum RecentActivityType
{
    UserRegistered = 1,
    WorkspaceCreated = 2,
    WorkSpaceDeleted = 3,
    JoinedWorkspace = 4,
    ProjectCreated = 5,
    ProjectDeleted = 6,
    TaskCompleted = 7
}
```

Use the actual API contract from `BackendReadme.md` if any details differ.

---

# 6. Data Architecture

Follow the exact architecture/pattern already used in the User Dashboard and the rest of the frontend.

Preferred flow:

```text
Admin Dashboard API
        ↓
Admin Dashboard Service
        ↓
React Query Hook
        ↓
Admin Dashboard Page
        ↓
Reusable UI Components
```

Do not place API calls directly inside the page component if the existing project uses services/hooks.

Follow the existing naming conventions.

For example, if the project uses:

```text
services/
hooks/
types/
pages/
components/
```

follow the existing structure instead of creating a new architecture.

---

# 7. React Query

Use the project's existing React Query/TanStack Query pattern.

The main dashboard data should use a normal query.

Use an appropriate query key following the project's existing conventions, for example:

```text
["adminDashboard"]
```

Do not blindly use this if the project has a different established convention. Inspect and follow the existing pattern.

The dashboard should automatically refetch every:

```text
10 minutes
```

Use React Query's existing configuration/pattern.

Do not implement a custom `setInterval`.

---

# 8. KPI Section

The KPI section must use the **exact same visual style as the User Dashboard KPI cards**.

Do not create a visually different Admin KPI card.

Use the existing KPI/stat component if one exists.

Display the available admin statistics without adding unsupported metrics.

Recommended grouping:

### Users

Display:

- Total Users
- Total Admins
- New Users — Last 30 Days

### Workspaces

Display:

- Total Workspaces
- New Workspaces — Last 30 Days

### Projects

Display:

- Total Projects
- New Projects — Last 30 Days

### Tasks

Display:

- Total Tasks
- New Tasks — Last 30 Days

Do NOT calculate percentages.

Do NOT introduce comparison percentages.

Do NOT invent additional statistics.

The `Last 30 Days` values should simply use the values returned by the API.

The visual presentation should follow the User Dashboard's existing KPI pattern.

---

# 9. Date Range UI

The dashboard should have a date-range control consistent with the User Dashboard's style.

Currently it should contain only:

```text
Last 30 Days
```

The UI should be implemented in a way that can easily support additional ranges later.

Do not implement unsupported ranges.

Do not add backend filtering.

The current dashboard data is based on the existing API behavior.

---

# 10. Tasks Overview

Create a Tasks Overview card.

It must visually match the existing User Dashboard chart/card styling.

Use the chart library already installed in the project.

Do NOT install another chart library.

Use a:

```text
Doughnut Chart
```

The chart represents:

- Backlog
- Todo
- In Progress
- Review
- Done

Use:

```text
BacklogCount
TodoCount
InProgressCount
ReviewCount
DoneCount
```

The total number of tasks may be displayed in the center of the doughnut.

Prefer the existing chart styling/configuration from the User Dashboard.

Do not introduce a new visual chart style.

Use existing theme colors/design tokens wherever possible.

---

# 11. Recent Activity

Create a Recent Activity section/card.

On desktop, prefer placing:

```text
Tasks Overview
+
Recent Activity
```

next to each other if this matches the User Dashboard's existing layout/grid philosophy.

On smaller screens they should stack naturally.

Do not force a layout that conflicts with the existing User Dashboard responsive behavior.

---

# 12. Recent Activity — Infinite Query

Recent Activities must use:

- `useInfiniteQuery`
- `react-intersection-observer`

Follow the exact infinite-pagination pattern already used elsewhere in the project.

If the project already has a standard `PAGE_SIZE`, pagination helper, pagination DTO, or infinite query implementation, reuse it.

Do not create a second pagination pattern.

Read the endpoint contract from:

```text
BackendReadme.md
```

and implement pagination according to the actual backend response.

The initial page should load normally.

When the user reaches the end of the activity list, use `react-intersection-observer` to trigger loading of the next page.

Do not implement traditional numbered pagination.

Do not add a "Load More" button unless the existing project pattern requires it.

---

# 13. Recent Activity UI

Each activity should contain:

```text
[Icon]  Activity text
        X minutes ago
```

Use:

```text
RecentActivityDto.Text
```

as the activity text.

Do not reconstruct the activity sentence in the frontend if the backend already provides the final text.

Use:

```text
formatTimeAgo
```

for `CreatedAt`.

The result should look like:

```text
5 minutes ago
2 hours ago
Yesterday
```

Use the existing `formatTimeAgo` implementation.

Do not create another time-formatting utility.

---

# 14. Activity Type Mapping

Create a centralized mapping between:

```text
RecentActivityType
```

and:

- Icon
- Semantic/accent color
- Any required presentation metadata

Suggested conceptual mapping:

```text
UserRegistered     → user-related icon
WorkspaceCreated   → workspace/building icon
WorkSpaceDeleted   → delete/trash icon
JoinedWorkspace    → join/user icon
ProjectCreated     → project/folder icon
ProjectDeleted     → delete/project icon
TaskCompleted      → completed/check icon
```

Use the existing `react-icons` package.

Do not install another icon library.

The icon/accent colors should follow the existing application's design system.

Do not hardcode a random color palette.

If semantic colors already exist in the project, reuse them.

---

# 15. Empty States

The Recent Activity section must gracefully handle:

```text
recentActivityDtos.length === 0
```

Display a clean empty state consistent with the application's existing UI.

Do not leave a blank card.

Reuse an existing EmptyState component if one exists.

Do not create a duplicate EmptyState component unnecessarily.

---

# 16. Loading State

The Admin Dashboard must use Skeleton loading states.

Use:

```text
CustomSkeletonTheme.tsx
```

and the project's existing skeleton patterns.

Create skeletons that visually resemble the actual content:

- KPI cards
- Tasks Overview
- Recent Activity

Do not use a full-page spinner.

Do not create a new skeleton system.

The skeletons must match the User Dashboard's loading experience.

---

# 17. Error State

There is no global error handling system to rely on for this page.

If the dashboard request fails, display a simple error state that matches the application's existing design language.

Do not add:

- A global error system
- Toast infrastructure
- New error architecture
- Retry buttons

unless an existing project pattern already requires them.

Keep the error UI simple.

---

# 18. Responsive Design

The page must be fully responsive.

Support:

- Desktop
- Tablet
- Mobile

Support both:

```text
English LTR
Arabic RTL
```

Do not create separate layouts for Arabic.

Use the existing application's RTL/LTR system.

The Admin Dashboard should behave consistently with the User Dashboard at all breakpoints.

Do not hardcode desktop-only dimensions.

---

# 19. Localization

The Admin Dashboard must support both:

```text
English
Arabic
```

Use the existing i18n implementation.

Do not hardcode user-facing English or Arabic strings directly inside JSX.

Create/use appropriate translation keys following the existing project's naming conventions.

Examples of text that must be localized:

- Admin Dashboard
- Overview
- Users
- Workspaces
- Reports
- Settings
- Logout
- Total Users
- Total Admins
- Total Workspaces
- Total Projects
- Total Tasks
- Last 30 Days
- Tasks Overview
- Recent Activity
- Empty states
- Error messages

Activity `Text` comes from the backend and should not be reconstructed in the frontend.

---

# 20. Dark / Light Mode

The Admin Dashboard must support the application's existing:

- Light mode
- Dark mode

Use the existing design tokens/classes.

Do not create Admin-specific colors that break the existing theme.

Verify that:

- KPI cards
- Chart
- Activity icons
- Text
- Borders
- Backgrounds
- Skeletons

all look correct in both modes.

---

# 21. Componentization

Prefer reusable components.

A reasonable structure could be:

```text
AdminDashboardPage
├── AdminDashboardHeader
├── AdminStatsGrid
│   └── AdminStatCard
├── TasksOverviewCard
└── RecentActivityCard
    └── RecentActivityItem
```

However, do NOT blindly create these exact components.

First inspect the existing User Dashboard and project structure.

If equivalent components already exist, reuse them.

The goal is:

> Reusable, maintainable components without unnecessary abstraction.

Avoid both extremes:

- One giant page component
- Dozens of meaningless tiny components

---

# 22. Code Quality Constraints

Follow the existing project's:

- TypeScript conventions
- Naming conventions
- Folder structure
- Import conventions
- React patterns
- React Query patterns
- i18n conventions
- Tailwind/class conventions
- Component conventions

Do not introduce new architectural patterns.

Do not introduce unnecessary dependencies.

Do not modify unrelated files.

Do not refactor the User Dashboard unless absolutely necessary.

If an existing component needs a small reusable improvement, keep the change minimal and explain it.

---

# 23. Implementation Process

Follow this exact workflow.

## Phase 1 — Inspect

Inspect:

- User Dashboard
- Existing layouts
- Existing sidebar
- Existing KPI cards
- Existing charts
- Existing skeletons
- Existing React Query hooks
- Existing services
- Existing i18n
- Existing RTL implementation
- Existing `formatTimeAgo`
- Existing `RequireRole`
- Existing UI components
- `BackendReadme.md`

Do not code yet.

## Phase 2 — Analyze

Determine:

1. Which existing components can be reused
2. Which components need to be created
3. Existing User Dashboard layout structure
4. Existing API/service pattern
5. Existing infinite-query pattern
6. Existing pagination contract
7. Existing chart configuration
8. Existing skeleton implementation
9. Existing translation structure
10. Existing responsive breakpoints

## Phase 3 — Plan

Before implementation, create a concise implementation plan describing:

- Files to create
- Files to modify
- Components to reuse
- API integration
- Query structure
- Infinite activity pagination
- KPI structure
- Chart implementation
- Responsive behavior
- Localization
- Skeleton/loading states
- Empty/error states

Do not modify the backend.

## Phase 4 — Implement

Implement the plan.

Keep the implementation focused only on:

```text
Admin Dashboard → Overview
```

and the minimum Admin Layout/navigation required to display it.

## Phase 5 — Validate

After implementation:

1. Run TypeScript checks.
2. Run the project's existing lint/check commands if available.
3. Verify imports.
4. Verify React Query behavior.
5. Verify infinite scrolling.
6. Verify RTL.
7. Verify LTR.
8. Verify dark mode.
9. Verify light mode.
10. Verify responsive layouts.
11. Verify loading state.
12. Verify empty activity state.
13. Verify API integration.
14. Verify `RequireRole`.
15. Verify the route:

```text
/admin/dashboard
```

Fix issues caused by the implementation.

Do not perform unrelated refactoring.

---

# 24. Final Acceptance Criteria

The implementation is considered complete only if:

- `/admin/dashboard` works.
- Admin authorization uses the existing `RequireRole`.
- Admin layout is separate from User Dashboard.
- Admin layout visually matches User Dashboard.
- User Dashboard remains unchanged visually and functionally.
- KPI cards match User Dashboard styling.
- All available admin KPI data is displayed.
- No percentages are introduced.
- Tasks Overview uses a Doughnut chart.
- Existing chart library is reused.
- Recent Activity uses Infinite Query.
- Recent Activity uses `react-intersection-observer`.
- Existing pagination conventions are reused.
- `formatTimeAgo` is reused.
- Activity icons depend on `RecentActivityType`.
- Activity colors follow the existing design system.
- Empty activity state exists.
- Skeletons use `CustomSkeletonTheme.tsx`.
- No global error system is introduced.
- No retry buttons are introduced.
- Auto-refresh occurs every 10 minutes.
- English works.
- Arabic works.
- RTL works.
- LTR works.
- Dark mode works.
- Light mode works.
- Mobile/tablet/desktop layouts work.
- No new dependencies are added.
- No backend code is modified.
- No unsupported API functionality is invented.
- Existing project components/patterns are reused wherever appropriate.

---

# Most Important Rule

**Do not optimize for making the Admin Dashboard look "better" than the User Dashboard.**

Optimize for making it look like they are part of the **same exact application**.

The existing User Dashboard is the visual source of truth.

When you have a design decision that is not explicitly specified above:

> **Inspect the User Dashboard and follow its existing implementation instead of inventing a new solution.**