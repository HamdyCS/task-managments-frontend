# Admin Workspaces Management — Frontend Implementation Plan

## Goal

Implement the new **Workspaces Management** feature inside the existing Admin Dashboard.

The feature must follow the exact same visual style, architecture, conventions, reusable components, responsive behavior, dark/light mode, RTL/LTR support, and i18n approach already used throughout the existing frontend.

**Do not redesign the Admin Dashboard.**
**Do not introduce a new architecture.**
**Do not duplicate existing components or patterns if equivalent implementations already exist.**

---

# 1. First: Inspect the Existing Frontend

Before writing or modifying code:

1. Inspect the existing Admin Dashboard structure.
2. Inspect the existing Admin Users Management feature.
3. Inspect:
   - Admin layout/sidebar
   - Admin routes
   - Tables
   - Search/filter components
   - Pagination/infinite-query implementation
   - Drawers/modals
   - Loading states
   - Empty states
   - Error states
   - React Query hooks
   - API services
   - Axios configuration
   - URL query-param handling
   - i18n translation structure
   - RTL/LTR handling
   - Dark/light mode classes
   - Icons conventions
3. Reuse existing patterns wherever possible.

The Users Management page should be treated as the primary reference for the structure and behavior of this feature.

---

# 2. Route

Add the new Admin route:

```text
/admin/dashboard/workspaces
```

It must use the existing Admin Dashboard layout.

Add/update the Admin sidebar navigation:

```text
Overview
Users
Workspaces
Reports

──────────────

Settings
Logout
```

Follow the existing sidebar implementation and styling.

Do not create another layout.

---

# 3. Backend API Contract

The backend already provides the required endpoints.

## 3.1 Workspace Overviews

```http
GET /api/workspaces/overviews
```

Query parameters:

```text
pageNumber
pageSize
ownerName
workSpaceName
```

Response:

```ts
PaginationResultDto<WorkSpaceOverviewDto>
```

Example:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Acme Corp",
      "ownersNames": ["John Doe"],
      "membersCount": 8,
      "projectsCount": 4,
      "tasksCount": 25,
      "createdAt": "2026-01-01T10:00:00Z"
    }
  ],
  "totalCount": 12,
  "pageNumber": 1,
  "pageSize": 10,
  "nextPage": 2,
  "previousPage": null,
  "totalPages": 2,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

## 3.2 Workspace Details

```http
GET /api/workspaces/{id}/details
```

Response:

```ts
WorkSpaceDetailsDto
```

Example:

```json
{
  "workSpaceOverview": {
    "id": 1,
    "name": "Acme Corp",
    "ownersNames": ["John Doe"],
    "membersCount": 8,
    "projectsCount": 4,
    "tasksCount": 25,
    "createdAt": "2026-01-01T10:00:00Z"
  },
  "completionPercentage": 32,
  "members": [
    {
      "id": 1,
      "fullName": "John Doe"
    },
    {
      "id": 2,
      "fullName": "Jane Smith"
    }
  ],
  "projectNames": [
    "Website Redesign",
    "Mobile App"
  ]
}
```

Do not invent or add backend endpoints.

---

# 4. Types

Create/reuse the appropriate TypeScript DTO types.

Suggested types:

```ts
WorkSpaceOverviewDto
WorkSpaceDetailsDto
WorkSpaceMemberDto
```

The types must accurately match the backend response.

Do not create unnecessary duplicate interfaces if equivalent DTO types already exist.

---

# 5. API Service Layer

Follow the existing architecture:

```text
Component
    ↓
Custom React Query Hook
    ↓
Service
    ↓
Axios API
```

Create/reuse workspace-related service functions.

For example:

```ts
getWorkSpaceOverviews(...)
getWorkSpaceDetails(workSpaceId)
```

Use the existing Axios instance and configuration.

Do not create another Axios instance.

Use the existing API base URL/configuration.

---

# 6. React Query

Create custom hooks following the existing project conventions.

Suggested:

```ts
useWorkSpaceOverviews()
useWorkSpaceDetails(workSpaceId)
```

The overview query must depend on the current URL query parameters.

Example query key:

```ts
[
  "adminWorkspaces",
  {
    pageNumber,
    pageSize,
    ownerName,
    workSpaceName
  }
]
```

Follow the existing pagination/infinite-query implementation used by Admin Users.

Do not invent a different pagination strategy.

---

# 7. URL Query Parameters

The page must synchronize the supported search/filter state with the URL.

Supported backend query parameters:

```text
pageNumber
pageSize
ownerName
workSpaceName
```

Example:

```text
/admin/dashboard/workspaces?workSpaceName=Development&ownerName=Ahmed&pageNumber=1&pageSize=10
```

Important:

- Use the existing `useSearchParams` / URL state pattern already used in the project.
- Do not keep search/filter state only in local React state if the existing application convention is URL-based.
- Refreshing the page must preserve the current filters.
- Browser back/forward navigation should restore the URL state.
- Changing a filter/search value must update the URL.
- Query params sent to the API must come from the URL state.
- Do not manually add unsupported backend filters.

---

# 8. Search / Filters

The backend currently supports only:

```text
workSpaceName
ownerName
```

Therefore, implement only these filters.

Do NOT implement frontend-only filtering for:

```text
members count
created date
```

because the workspace list is paginated server-side and frontend-only filtering would only filter the currently loaded page.

## Workspace Name

Search/filter by:

```text
workSpaceName
```

## Owner

Search/filter by:

```text
ownerName
```

Use the existing search/filter UX from Admin Users where appropriate.

If the existing implementation uses debounce, reuse the same debounce approach.

---

# 9. Workspace Table

Create the Workspaces Management table using the existing Admin table components/styles.

Columns:

```text
Workspace
Owner
Members
Projects
Tasks
Created
```

Example:

```text
Workspace       Owner       Members    Projects    Tasks    Created
-------------------------------------------------------------------
Development     Ahmed       12         5           84       Aug 20
Marketing       Sara        8          3           41       Aug 18
E-Commerce      Mohamed     21         9           156      Aug 10
```

## Owner Display

The backend returns:

```ts
ownersNames: string[]
```

For the table:

- Display only the first owner.
- Do not display all owners.
- Do not add complicated owner rendering unless the existing design requires it.

If:

```ts
ownersNames = ["John Doe", "Jane Smith"]
```

display:

```text
John Doe
```

---

# 10. Table Actions

Each workspace row should have actions following the same action-menu pattern used elsewhere in the Admin Dashboard.

Available actions:

```text
View Workspace
View Members
View Projects
```

There are currently **no mutation actions**.

Do not add:

```text
Edit Workspace
Delete Workspace
Create Workspace
```

The Admin Workspace feature is currently read-only.

Do not create UI for Delete unless the backend/business rules are changed later.

---

# 11. Workspace Details Drawer

Clicking:

```text
View Workspace
```

must open the Workspace Details Drawer.

It must call:

```http
GET /api/workspaces/{id}/details
```

Do not navigate to another workspace page.

The drawer should use the existing Drawer implementation and styling.

---

# 12. Drawer Structure

The drawer should contain sections vertically, one after another.

Do NOT use tabs.

Structure:

```text
Development

Owner
Ahmed Khaled

Members
12

Projects
5

Tasks
84

Completion
73%

────────────────────

Members

Ahmed Khaled
Owner

Sara Ahmed
Member

Mohamed Ali
Project Manager

...

────────────────────

Projects

E-Commerce

Mobile App

Website
```

The exact visual treatment should follow the existing design system.

---

# 13. Overview Section

The overview section uses:

```ts
workSpaceOverview
```

Display:

### Workspace Name

```text
Development
```

### Owner

Use the first value from:

```ts
ownersNames
```

### Members

```text
membersCount
```

### Projects

```text
projectsCount
```

### Tasks

```text
tasksCount
```

### Completion

```text
completionPercentage
```

The completion percentage exists only in the Details API and should not be added to the main workspace table unless the existing design specifically requires it.

---

# 14. Members Section

Use:

```ts
members
```

Each member contains:

```ts
{
  id,
  fullName
}
```

Display the member list vertically.

Important:

The Details API currently provides member names/IDs but does not provide the member's workspace role.

Therefore:

**Do not invent or hard-code roles such as Owner, Member, or Project Manager.**

Only display the data returned by the backend.

Example:

```text
Members

Ahmed Khaled
Sara Ahmed
Mohamed Ali
...
```

If the backend is later updated to return roles, the UI can be extended.

---

# 15. Projects Section

Use:

```ts
projectNames
```

Display project names vertically.

Example:

```text
Projects

E-Commerce
Mobile App
Website
```

No additional project API should be called for this section.

The details endpoint already provides the required project names.

---

# 16. View Members Action

When the Admin selects:

```text
View Members
```

do NOT create a separate page.

Open the same Workspace Details Drawer.

After opening the drawer:

- Load workspace details.
- Automatically scroll/focus the Members section.

The user should immediately see the Members section.

---

# 17. View Projects Action

When the Admin selects:

```text
View Projects
```

do NOT create a separate page.

Open the same Workspace Details Drawer.

After opening the drawer:

- Load workspace details.
- Automatically scroll/focus the Projects section.

The user should immediately see the Projects section.

Reuse the same drawer/details implementation rather than creating three different drawers.

---

# 18. Drawer State

Keep the drawer state predictable.

Suggested conceptual state:

```ts
selectedWorkspaceId
detailsDrawerOpen
initialSection
```

Where:

```ts
initialSection:
  | "overview"
  | "members"
  | "projects"
```

Examples:

```text
View Workspace → overview
View Members   → members
View Projects  → projects
```

Avoid duplicating the details-fetching logic between these actions.

---

# 19. Loading States

Implement loading states consistent with the existing Admin Dashboard.

For the table:

- Use the existing table skeleton/loading implementation if available.

For the drawer:

- Show a proper drawer loading state while details are loading.
- Do not show broken/empty sections while the request is pending.

---

# 20. Empty States

Handle:

- No workspaces
- No members
- No projects
- No search results

Use the existing empty-state components/styles if available.

Do not invent a completely different empty-state design.

---

# 21. Error Handling

Follow the existing API error-handling pattern.

For overview loading errors:

- Show the standard Admin error state.

For drawer details errors:

- Show an appropriate error state inside the drawer.
- Allow the drawer to be closed.
- If the existing application supports retry, reuse the existing retry behavior.

Do not introduce a new global error-handling mechanism.

---

# 22. Responsive Design

The page must work properly on:

- Desktop
- Tablet
- Mobile

Follow the existing Admin Dashboard responsive behavior.

The table should use the same responsive strategy already established in Users Management.

The Details Drawer must also work correctly on small screens.

Do not introduce horizontal layout problems.

---

# 23. Dark / Light Mode

The feature must support both existing themes.

Use the project's existing Tailwind theme classes/tokens.

Do not introduce hard-coded colors that break dark mode.

Follow the same visual language as the existing Admin Users page.

---

# 24. RTL / LTR

The feature must support:

```text
English → LTR
Arabic → RTL
```

Verify:

- Table alignment
- Drawer layout
- Action menus
- Search/filter controls
- Icons
- Spacing
- Scroll/focus behavior
- Text alignment

Do not use directional CSS that breaks RTL.

---

# 25. Internationalization

All user-facing text must use the existing i18n system.

Add translations for:

```text
Workspaces
Workspace
Owner
Members
Projects
Tasks
Created
Completion
View Workspace
View Members
View Projects
No Workspaces
No Members
No Projects
Search Workspace
Search Owner
Workspace Details
```

Provide both:

```text
English
Arabic
```

Follow the existing translation key naming conventions.

Do not hard-code user-facing strings inside JSX.

---

# 26. Icons

Use the project's existing icon convention:

```ts
react-icons/fi
```

Reuse existing icons where possible.

Do not introduce another icon library.

---

# 27. Components

Do not create one giant page component.

Split the feature into logical components according to the existing frontend architecture.

A possible structure:

```text
pages/
  admin/
    Workspaces.tsx

components/
  admin/
    workspaces/
      WorkspacesTable.tsx
      WorkspacesFilters.tsx
      WorkspaceDetailsDrawer.tsx
      WorkspaceOverview.tsx
      WorkspaceMembers.tsx
      WorkspaceProjects.tsx
      WorkspaceActions.tsx
```

The exact folders/names should follow the project's existing conventions.

Do not blindly create this exact structure if the project already has a different established structure.

---

# 28. Important Reusability Rule

Before creating any component, search the existing codebase for reusable implementations.

Especially inspect:

- Admin Users table
- Search input
- Filter controls
- Action menu
- Drawer
- Pagination/infinite scrolling
- Empty state
- Loading skeleton
- Error state

Reuse or extract shared components when appropriate.

Do not duplicate existing logic.

---

# 29. No Workspace Mutations

This feature is currently **read-only**.

Do not implement:

```text
Create Workspace
Edit Workspace
Delete Workspace
```

Do not add fake buttons for future functionality.

Only implement:

```text
View Workspace
View Members
View Projects
```

---

# 30. Query / Cache Behavior

The overview list should be cached using the existing React Query conventions.

The query key must change when:

```text
workSpaceName
ownerName
pageNumber
pageSize
```

change.

The details query should be keyed by workspace ID:

```text
["adminWorkspaceDetails", workspaceId]
```

Follow the project's existing staleTime/cache configuration rather than inventing arbitrary values.

---

# 31. Page Lifecycle

Expected flow:

```text
Admin opens:

/admin/dashboard/workspaces
        ↓
Read query params
        ↓
Fetch workspace overviews
        ↓
Render table
        ↓
Admin searches/filters
        ↓
Update URL
        ↓
React Query fetches filtered data
        ↓
Admin opens workspace
        ↓
Fetch /details
        ↓
Open drawer
```

For Members:

```text
View Members
    ↓
Open Details Drawer
    ↓
Fetch Details
    ↓
Scroll to Members section
```

For Projects:

```text
View Projects
    ↓
Open Details Drawer
    ↓
Fetch Details
    ↓
Scroll to Projects section
```

---

# 32. Important Backend Contract Rules

Do not assume backend fields that are not present.

For overview:

```ts
id
name
ownersNames
membersCount
projectsCount
tasksCount
createdAt
```

For details:

```ts
workSpaceOverview
completionPercentage
members
projectNames
```

Do not assume:

```text
member role
project details
workspace status
workspace description
workspace avatar
workspace updatedAt
```

unless they already exist in the frontend/backend contract.

---

# 33. Verification Checklist

After implementation, verify:

## Routing

- [ ] `/admin/dashboard/workspaces` works.
- [ ] Existing Admin routes still work.
- [ ] Sidebar navigation works.

## API

- [ ] Overview endpoint uses `/api/workspaces/overviews`.
- [ ] Details endpoint uses `/api/workspaces/{id}/details`.
- [ ] No unsupported API endpoints are introduced.

## Search / URL

- [ ] `workSpaceName` is reflected in URL.
- [ ] `ownerName` is reflected in URL.
- [ ] `pageNumber` is reflected/handled according to existing pagination implementation.
- [ ] `pageSize` follows the existing implementation.
- [ ] Refresh preserves the current filters.
- [ ] Browser back/forward works.

## Table

- [ ] Workspace displayed.
- [ ] First owner displayed.
- [ ] Members count displayed.
- [ ] Projects count displayed.
- [ ] Tasks count displayed.
- [ ] Created date displayed.
- [ ] No Completion column.

## Drawer

- [ ] Overview displayed.
- [ ] Owner displayed.
- [ ] Members count displayed.
- [ ] Projects count displayed.
- [ ] Tasks count displayed.
- [ ] Completion percentage displayed.
- [ ] Members section displayed.
- [ ] Projects section displayed.

## Actions

- [ ] View Workspace opens drawer at Overview.
- [ ] View Members opens drawer and scrolls to Members.
- [ ] View Projects opens drawer and scrolls to Projects.
- [ ] No Edit action.
- [ ] No Delete action.

## UI

- [ ] Same style as Admin Users.
- [ ] Responsive.
- [ ] Dark mode.
- [ ] Light mode.
- [ ] RTL.
- [ ] LTR.
- [ ] Loading states.
- [ ] Empty states.
- [ ] Error states.
- [ ] Existing icons.
- [ ] Existing i18n conventions.

---

# 34. Final Implementation Rule

The goal is to make **Workspaces Management feel like a native part of the existing Admin Dashboard**, not a separately designed feature.

Prioritize:

1. Existing project patterns
2. Existing reusable components
3. Existing Admin Users implementation
4. Existing React Query conventions
5. Existing URL/query-param conventions
6. Existing styling/design system
7. Existing i18n/RTL conventions

Only introduce new abstractions when the existing codebase genuinely lacks the required functionality.

Before finishing, review the implementation for duplicated code, inconsistent styling, unsupported backend assumptions, and unnecessary complexity.
# 35. Final UI & Component Rules

Before considering the feature complete, make sure to follow these rules:

### Skeleton Loading

For **all skeleton loading states** in this feature, use the existing:

```text
CustomSkeletonTheme.tsx
```

Do not create a separate skeleton theme or introduce another skeleton implementation.

Reuse the existing skeleton components and styling conventions from the project.

### Component Architecture

Do **not** implement the entire Workspaces Management feature as one large page component.

The page should be composed of focused, reusable components.

For example:

```text
WorkspacesPage
├── WorkspacesHeader
├── WorkspacesFilters
├── WorkspacesTable
│   └── WorkspaceRow
├── WorkspaceActions
└── WorkspaceDetailsDrawer
    ├── WorkspaceOverview
    ├── WorkspaceMembers
    └── WorkspaceProjects
```

The exact component structure should follow the existing project conventions.

Keep responsibilities separated:

- Page → orchestration/layout
- Filters → search/filter controls
- Table → workspace list rendering
- Actions → workspace row actions
- Drawer → details container
- Overview → workspace statistics
- Members → members section
- Projects → projects section

Avoid a monolithic page component with all API calls, state, rendering, filtering, drawer logic, and sections inside one file.

Reuse existing components whenever possible before creating new ones.