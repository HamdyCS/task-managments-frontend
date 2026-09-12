# Admin Reports Page — Frontend Implementation Plan

Implement the **Admin Reports page only on the frontend** for the existing WorkPilot application.

Do **not** modify, redesign, or add any backend endpoints. The backend is already implemented and the frontend must consume the existing API exactly as specified below.

---

## 1. Goal

Create the Admin Dashboard Reports page:

```text
/admin/dashboard/reports
```

The page must follow the **exact visual language and design system of the existing Admin Dashboard** to keep the entire system consistent.

The Reports page should also follow the same reporting presentation style already used in the **User Dashboard reports**, while adapting it to the Admin Dashboard layout.

Do not introduce a completely new visual style.

---

# 2. Existing Frontend Stack

Follow the existing project stack and conventions:

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Redux Toolkit
- TanStack Query
- React Router
- Axios
- Formik/Yup where appropriate
- Chart.js
- Framer Motion where appropriate
- `react-icons/fi`
- i18next
- English + Arabic
- RTL/LTR support
- Sonner
- `react-intersection-observer`

Reuse existing shared components, hooks, utilities, API configuration, types, styling conventions, and patterns wherever possible.

Do not introduce another library when an existing project dependency or component already solves the problem.

---

# 3. Backend APIs

The Admin Reports backend is already implemented.

All endpoints require the Admin role.

Base route:

```text
/api/admin/reports
```

There are exactly three endpoints relevant to this page.

---

## 3.1 Overview

```http
GET /api/admin/reports/overview?from=&to=
```

The actual response DTO is:

```csharp
public class WorkSpacesOverviewReportDto
{
    public int RegularUsersCount { get; set; }

    public int WorkspacesCount { get; set; }

    public int ProjectsCount { get; set; }

    public int TasksCount { get; set; }

    public IEnumerable<TasksByPriorityReportDto> TasksByPriorityReportDtos { get; set; }

    public IEnumerable<TasksByStatusReportDto> TasksByStatusReportDtos { get; set; }
}
```

Priority DTO:

```csharp
public class TasksByPriorityReportDto
{
    public TaskPriority TaskPriority { get; set; }

    public int Count { get; set; }
}
```

Status DTO:

```csharp
public class TasksByStatusReportDto
{
    public ProjectTaskStatus TaskStatus { get; set; }

    public int Count { get; set; }
}
```

### Important

The Overview endpoint is the **only endpoint affected by the Date Range filter**.

Do not apply `from` / `to` to Member Performance.

---

# 4. Member Performance

Endpoint:

```http
GET /api/admin/reports/member-performances?pageNumber=&pageSize=&memberName=
```

The backend response is paginated.

DTO:

```csharp
public class MemberPerformanceDto
{
    public string Id { get; set; }

    public string Name { get; set; }

    public int AssignedCount { get; set; }

    public int InProgressCount { get; set; }

    public int DoneCount { get; set; }

    public double CompletionPercentage { get; set; }
}
```

The frontend must respect the backend DTO.

Do **not calculate `CompletionPercentage` manually** in the frontend.

The UI should display:

```text
User
Assigned
In Progress
Completed
Completion
```

Use the backend `CompletionPercentage` directly.

---

# 5. Member Performance Data Loading

Member Performance must use:

- TanStack Query
- Infinite Query
- `react-intersection-observer`

Do not implement traditional numbered pagination.

Use infinite scrolling.

The implementation should request:

```text
pageNumber=1
pageNumber=2
pageNumber=3
...
```

based on the pagination metadata returned by the backend.

Use the existing project's pagination/infinite-query patterns if available.

The next page must only be requested when another page exists.

Use `react-intersection-observer` with a sentinel element at the bottom of the Member Performance list/table.

Handle:

- initial loading
- fetching next page
- no more pages
- empty result
- API error

---

# 6. Member Search

Provide a search input for:

```text
memberName
```

The search must be connected directly to:

```http
?pageNumber=&pageSize=&memberName=
```

When the search value changes:

- reset the infinite query
- start again from page 1
- do not append results belonging to the previous search
- debounce the search if the project already has a standard debounce utility/pattern

Do not add additional filters that are not supported by the backend.

Only implement:

```text
Search + Infinite Pagination
```

---

# 7. Overview Date Range

The Overview section must contain a **Date Range Picker**.

The selected date range controls:

```text
from
to
```

for:

```http
GET /api/admin/reports/overview?from=&to=
```

Do not apply this date range to Member Performance.

The UI should make it clear that the date filter belongs to the Overview report.

Use the project's existing date handling conventions.

Make sure dates are serialized correctly for the API.

Handle:

- no date selected
- from only if supported by the existing date picker/API conventions
- from + to
- changing the range
- clearing the range

When the date range changes, refetch the Overview data.

---

# 8. PDF Download

The PDF endpoint is:

```http
GET /api/admin/reports/overview/pdf/download?from=&to=
```

The PDF must use the **same selected date range as the Overview currently displayed on screen**.

This is extremely important.

If the Admin selects:

```text
From: 2026-08-01
To:   2026-09-01
```

the download link must point to:

```text
/api/admin/reports/overview/pdf/download?from=2026-08-01&to=2026-09-01
```

so the downloaded report corresponds to the data currently visible.

If no date range is selected, generate the download URL without unnecessary query parameters.

### Download implementation

Use an actual anchor element:

```html
<a href="..." download>
```

Use the existing API/base URL configuration from the project.

Do not create a custom Axios blob-download implementation unless the existing project architecture requires it.

The requirement is specifically:

```html
<a>
```

with:

```html
download
```

attribute.

The link/button should be accessible and clearly communicate:

```text
Download PDF
```

Use the existing icon conventions.

---

# 9. Page Structure

The final page should follow this structure:

```text
Admin Reports

┌──────────────────────────────────────────────┐
│ Reports                                      │
│ Description / context                        │
│                                              │
│ [ Date Range Picker ]      [ Download PDF ]  │
└──────────────────────────────────────────────┘


┌──────────────┐ ┌──────────────┐
│ Regular      │ │ Workspaces   │
│ Users        │ │              │
└──────────────┘ └──────────────┘

┌──────────────┐ ┌──────────────┐
│ Projects     │ │ Tasks        │
└──────────────┘ └──────────────┘


┌──────────────────────────┐
│ Task Status Distribution │
│                          │
│       Doughnut           │
│                          │
└──────────────────────────┘


┌──────────────────────────┐
│ Tasks by Priority        │
│                          │
│       Bar Chart          │
│                          │
└──────────────────────────┘


Member Performance

[ Search member ]

┌──────────────────────────────────────────────────┐
│ User | Assigned | In Progress | Completed | Rate │
├──────────────────────────────────────────────────┤
│ ...                                              │
│ ...                                              │
└──────────────────────────────────────────────────┘

                ↓
          Infinite scroll
```

Adapt the exact layout to the existing Admin Dashboard grid and responsive design.

Do not blindly reproduce this ASCII layout if the existing dashboard has a better established grid system.

Consistency with the existing Admin Dashboard takes priority.

---

# 10. Overview Summary Cards

Create four summary cards using:

```text
RegularUsersCount
WorkspacesCount
ProjectsCount
TasksCount
```

Display them as:

```text
Regular Users
Workspaces
Projects
Tasks
```

Reuse the existing Admin Dashboard KPI/card components if they exist.

Do not create visually inconsistent cards.

---

# 11. Task Status Distribution

Create a **Doughnut Chart** using:

```text
TasksByStatusReportDtos
```

Map:

```text
TaskStatus → Count
```

Expected statuses:

```text
Backlog
Todo
InProgress
Review
Done
```

The chart must be data-driven.

Do not hard-code the example values.

Example values such as:

```text
Backlog 12%
Todo 18%
In Progress 25%
Review 10%
Done 35%
```

are only visual examples.

The actual chart must use API data.

If percentages are needed for labels/tooltips, calculate them from the returned counts for presentation only.

---

# 12. Tasks by Priority

Create a **Bar Chart** using:

```text
TasksByPriorityReportDtos
```

Map:

```text
TaskPriority → Count
```

Expected priorities:

```text
Critical
High
Medium
Low
```

Again:

- do not hard-code values
- use API data
- handle missing categories safely
- handle empty data

Follow the existing Chart.js configuration/style used elsewhere in the application.

---

# 13. Member Performance

Create a dedicated Member Performance section.

Use:

```text
GET /api/admin/reports/member-performances
```

The table should display:

```text
User
Assigned
In Progress
Completed
Completion
```

Use:

```text
Name
AssignedCount
InProgressCount
DoneCount
CompletionPercentage
```

from the backend.

Do not create a Workspace column because the backend DTO does not provide workspace information.

Do not invent or infer workspace membership.

---

# 14. Loading States

Every data section must have an appropriate loading state.

For skeleton loading, **MUST use the existing:**

```text
CustomSkeletonTheme.tsx
```

Do not create a new skeleton theme.

Do not replace the existing skeleton system with custom unrelated loading UI.

Create reusable skeleton components when useful, for example:

```text
ReportsSummarySkeleton
ReportsChartsSkeleton
MemberPerformanceSkeleton
```

but keep them consistent with the project's existing skeleton architecture.

---

# 15. Components

Do NOT implement the entire Reports page inside one large component.

Break the page into meaningful reusable components.

Suggested structure:

```text
pages/
└── admin/
    └── reports/
        ├── AdminReports.tsx
        ├── components/
        │   ├── ReportsHeader.tsx
        │   ├── ReportsFilters.tsx
        │   ├── ReportsSummaryCards.tsx
        │   ├── TaskStatusDistribution.tsx
        │   ├── TasksByPriorityChart.tsx
        │   ├── MemberPerformance.tsx
        │   ├── MemberPerformanceTable.tsx
        │   ├── ReportsSkeleton.tsx
        │   └── ...
        ├── hooks/
        │   ├── useAdminReportsOverview.ts
        │   └── useAdminMemberPerformances.ts
        ├── services/
        │   └── adminReportsService.ts
        └── types/
            └── adminReports.types.ts
```

Do not necessarily copy this exact folder structure if the existing project follows another established structure.

**Follow the project's existing folder and naming conventions first.**

The important requirement is separation of responsibilities.

---

# 16. API Service Layer

Follow the existing architecture:

```text
Component
   ↓
Custom React Query Hook
   ↓
Service
   ↓
Axios
   ↓
API
```

Do not call Axios directly from page components.

Create service functions for:

```text
getAdminReportsOverview
getAdminMemberPerformances
```

The PDF can use a URL helper/service utility if that matches the existing project pattern.

Reuse the existing API configuration/base URL.

Do not hard-code:

```text
http://localhost:5102
```

---

# 17. React Query

Use TanStack Query.

Suggested query keys:

```text
["adminReportsOverview", from, to]
```

and:

```text
["adminMemberPerformances", memberName]
```

Follow the project's existing query-key conventions if they differ.

Overview:

- normal `useQuery`

Member Performance:

- `useInfiniteQuery`

The date range must be part of the Overview query key.

The member search value must be part of the Member Performance query key.

---

# 18. Responsive Design

The page must be fully responsive.

Desktop:

- dashboard-style grid
- charts displayed comfortably
- member table uses available width

Tablet:

- cards/charts adapt to available space

Mobile:

- summary cards stack appropriately
- charts remain readable
- filters wrap/stack
- Member Performance table must remain usable without breaking the layout

Follow the responsive behavior already established throughout the Admin Dashboard.

Do not create a different responsive philosophy for this page.

---

# 19. RTL / LTR

The application supports:

```text
English
Arabic
```

and:

```text
LTR
RTL
```

The Reports page must support both correctly.

Pay special attention to:

- chart positioning
- card content alignment
- table alignment
- search input
- Date Range Picker
- Download PDF button
- spacing
- icons
- directional icons
- overflow behavior

Do not hard-code left/right positioning where logical:

```css
left
right
```

should be replaced with logical properties where appropriate:

```css
start
end
```

or the project's established RTL approach.

Charts should remain visually correct in Arabic/RTL.

---

# 20. Internationalization

Do not hard-code user-facing English strings.

Add all required translations to the existing i18next translation structure.

At minimum, cover:

```text
Reports
Regular Users
Workspaces
Projects
Tasks
Task Status Distribution
Tasks by Priority
Member Performance
Search members
Assigned
In Progress
Completed
Completion
Download PDF
No data
Loading
Failed to load report
```

Add English and Arabic translations.

Use the project's existing translation namespace and conventions.

Do not introduce a new i18n architecture.

---

# 21. Empty States

Handle empty API responses gracefully.

Examples:

```text
No report data available
No members found
No task status data available
No task priority data available
```

Use existing Empty State components if available.

Do not show broken charts when there is no data.

---

# 22. Error Handling

Follow the existing project's API error handling.

For Overview:

- show an appropriate error state
- allow retry if the existing application pattern supports it

For Member Performance:

- show the error state
- do not break the rest of the Reports page

Do not allow a Member Performance failure to prevent Overview from rendering.

---

# 23. Accessibility

Use semantic HTML where possible.

The PDF download should be a real anchor:

```html
<a href="..." download>
```

Charts should have meaningful accessible titles/context where supported by the existing Chart.js setup.

Inputs must have accessible labels.

Do not rely only on icons to communicate actions.

---

# 24. Animation

Use Framer Motion only where it matches the existing Admin Dashboard.

Keep animations subtle.

Do not introduce cinematic/WebGL/3D effects.

Reports should feel like a professional enterprise dashboard.

---

# 25. Do Not Add

Do NOT add:

- Workspace Performance section
- Workspace filter
- User filter
- custom backend endpoints
- fake/mock report data
- hard-coded chart values
- traditional numbered pagination
- date filtering to Member Performance
- workspace information to Member Performance
- Excel export unless an existing backend endpoint already exists
- a new UI library
- a new chart library
- a new skeleton system
- a completely different visual style

The separate Admin **Workspaces** page is responsible for workspace management/details, so do not duplicate Workspace Performance reporting here.

---

# 26. Important Existing System Rules

Before implementing, inspect the existing frontend and identify/reuse:

- Admin Dashboard layout
- Admin sidebar
- Admin route conventions
- existing Dashboard KPI/card components
- existing Chart.js components/configuration
- existing Skeleton components
- `CustomSkeletonTheme.tsx`
- existing infinite-query implementation
- existing `react-intersection-observer` usage
- existing search/debounce utilities
- existing Date Range Picker
- existing API service pattern
- existing Axios configuration
- existing environment/API URL configuration
- existing i18next structure
- existing RTL/LTR utilities
- existing error/empty-state components

Do not duplicate functionality that already exists.

---

# 27. Route

Add the Reports page to the existing Admin Dashboard routing structure.

Expected route:

```text
/admin/dashboard/reports
```

Use the existing Admin route protection.

Do not create another authentication/authorization mechanism.

---

# 28. Implementation Order

Implement in this order:

### Step 1 — Inspect existing frontend

Before writing code, inspect the current Admin Dashboard and User Dashboard Reports implementation.

Identify reusable:

- components
- hooks
- services
- chart configurations
- skeletons
- date picker
- translation patterns
- responsive patterns

### Step 2 — Define types

Create TypeScript types matching the backend DTOs exactly.

### Step 3 — Create API service

Implement:

```text
getAdminReportsOverview(from, to)
getAdminMemberPerformances(pageNumber, pageSize, memberName)
```

### Step 4 — Create React Query hooks

Implement:

```text
useAdminReportsOverview
useAdminMemberPerformances
```

Use:

```text
useQuery
```

for Overview and:

```text
useInfiniteQuery
```

for Member Performance.

### Step 5 — Build Overview UI

Implement:

- header
- date range picker
- PDF download
- summary cards
- status doughnut
- priority bar chart

### Step 6 — Build Member Performance

Implement:

- search
- table
- infinite query
- intersection observer
- loading states
- empty state
- error state

### Step 7 — Add i18n

Add English + Arabic translations.

### Step 8 — Add responsive RTL/LTR behavior

Verify desktop, tablet, mobile, LTR and RTL.

### Step 9 — Verify PDF URL synchronization

Changing the Overview date range must change the PDF download URL to exactly match the currently selected range.

### Step 10 — Final cleanup

Ensure:

- no duplicated code
- no hard-coded API URL
- no mock data
- no unused components
- no unnecessary dependencies
- no backend changes
- components are properly separated
- skeletons use `CustomSkeletonTheme.tsx`
- existing project conventions are respected

---

# 29. Final Acceptance Criteria

The implementation is complete only when:

- [ ] `/admin/dashboard/reports` exists
- [ ] Page uses the existing Admin Dashboard style
- [ ] Page also follows the established User Reports visual language
- [ ] Four Overview summary cards work
- [ ] Task Status Doughnut uses API data
- [ ] Tasks by Priority Bar Chart uses API data
- [ ] Date Range Picker controls Overview only
- [ ] Overview refetches when date range changes
- [ ] PDF uses the exact selected date range
- [ ] PDF uses `<a href="..." download>`
- [ ] Member Performance uses backend data exactly
- [ ] CompletionPercentage comes from backend
- [ ] Member Performance has member-name search
- [ ] Member Performance uses `useInfiniteQuery`
- [ ] Member Performance uses `react-intersection-observer`
- [ ] Infinite scrolling stops when there are no more pages
- [ ] Overview and Member Performance loading states are independent
- [ ] Skeletons use `CustomSkeletonTheme.tsx`
- [ ] Empty states are handled
- [ ] Errors are handled
- [ ] English translations exist
- [ ] Arabic translations exist
- [ ] RTL works
- [ ] LTR works
- [ ] Mobile responsive behavior works
- [ ] No Workspace Performance duplication
- [ ] No backend changes
- [ ] No mock data
- [ ] No hard-coded report values
- [ ] No large monolithic Reports page component
- [ ] Existing project architecture and conventions are reused

Implement the frontend only.