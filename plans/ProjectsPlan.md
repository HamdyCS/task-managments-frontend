# Task: Plan the Frontend Projects Page

You are working on the frontend of an existing Task Management application.

Your task is **PLAN ONLY**.

Do **NOT** modify, create, delete, or rename any files.
Do **NOT** implement any code.
Do **NOT** start making changes after producing the plan.

First, deeply inspect the existing frontend codebase and understand its current architecture, patterns, components, styling, routing, React Query usage, services, hooks, tables, modals, drawers, dialogs, skeletons, i18n, RTL/LTR handling, and responsive behavior.

Then produce a detailed implementation plan for the Projects page.

---

## 1. Project Context

The application is a Task Management system.

The frontend dashboard contains workspace users with these roles:

- Owner
- ProjectManager
- Member

There is also an Admin role in the system, but **Admin has a completely separate dashboard**.

For this task, completely ignore the Admin dashboard and Admin-specific frontend implementation.

The Projects page belongs to the normal workspace-user dashboard.

---

# 2. Backend Projects API Contract

The backend exposes:

`/api/workspaces/{workspaceId}/projects`

### Authorization

Manage operations:

- Owner
- ProjectManager

Read operations:

- Owner
- ProjectManager
- Member

Therefore the frontend permission behavior must be:

| Role | View | Create | Edit | Delete |
|---|---|---|---|---|
| Owner | Yes | Yes | Yes | Yes |
| ProjectManager | Yes | Yes | Yes | Yes |
| Member | Yes | No | No | No |

Do not invent additional permissions.

---

## 2.1 Create Project

### POST

`/api/workspaces/{workspaceId}/projects`

### Request

```json
{
  "name": "Website Redesign",
  "description": "Q1 initiative"
}
```

### Response

`201 Created`

```json
{
  "id": 10,
  "name": "Website Redesign",
  "description": "Q1 initiative",
  "status": "Active",
  "workSpaceId": 2,
  "createdById": "a1b2c3...",
  "createdAt": "2026-01-10T09:00:00Z",
  "lastUpdatedById": null,
  "lastUpdatedAt": null
}
```

Important:

Although the backend example contains a `status` field, **there is currently no project status functionality in the frontend requirements**.

Do not design or implement status UI.

---

## 2.2 Get Project

`GET /api/workspaces/{workspaceId}/projects/{projectId}`

Returns a `ProjectDto`.

---

## 2.3 Get Projects

`GET /api/workspaces/{workspaceId}/projects`

Returns:

`PaginationResultDto<ProjectDto>`

The frontend must use **infinite pagination**.

The project list must use:

- TanStack React Query
- `useInfiniteQuery`
- `react-intersection-observer`

Follow the exact existing implementation pattern already used elsewhere in the project.

Do not invent a new pagination architecture.

---

## 2.4 Update Project

`PUT /api/workspaces/{workspaceId}/projects/{projectId}`

### Request

```json
{
  "name": "Website Redesign v2",
  "description": "Updated"
}
```

The backend example may contain status, but **do not include status in the frontend project form** because there is currently no status functionality.

Response:

`204 No Content`

---

## 2.5 Delete Project

`DELETE /api/workspaces/{workspaceId}/projects/{projectId}`

Response:

`204 No Content`

This is a soft delete on the backend.

Frontend deletion must use the existing:

`ConfirmDialog.tsx`

Do not create another confirmation dialog if the existing component can be reused.

---

# 3. Projects Page UI

The entire application uses tables as its main data presentation pattern.

Therefore the Projects page must be a:

**Responsive Table**

Do not use cards as the primary presentation.

Inspect the existing tables in the project and reuse their visual/structural patterns.

The table must remain usable across:

- Desktop
- Laptop
- Tablet
- Mobile

Important:

The table should **not hide columns on smaller screens**.

Instead, preserve all columns and allow horizontal scrolling (`overflow-x`) exactly like the existing tables in the project.

Also inspect and preserve the application's:

- RTL behavior
- LTR behavior
- horizontal scrolling behavior
- alignment
- spacing
- table responsiveness

---

# 4. Project Table

Inspect existing tables in the codebase and determine the appropriate columns based on the available `ProjectDto`.

Likely information includes:

- Project Name
- Description
- Created At
- Actions

But **do not blindly assume the final columns**.

Inspect existing table conventions and ProjectDto usage and document the recommended columns in the plan.

Do not expose `status` because there is currently no status functionality.

---

# 5. Project Actions

Use the existing project/table action-menu pattern.

The application already uses:

`@floating-ui/react`

for menus that must escape table/container clipping.

Reuse that existing pattern.

The action menu should currently contain appropriate actions such as:

- View
- Edit
- Delete

There is **no status action**.

Permission behavior:

### Owner / ProjectManager

Can see:

- View
- Edit
- Delete

### Member

Can see:

- View

Members must not see Create/Edit/Delete controls.

Do not rely only on disabling buttons.

Follow the project's existing authorization/UI permission pattern.

---

# 6. Create Project

Owner and ProjectManager should have a:

`Create Project`

button.

Member should not see it.

Create should open a modal.

The project form must be implemented using the project's existing form architecture.

The same reusable project form/modal must support:

- Create
- Edit

The form receives an operation/type such as:

```text
Create
Edit
```

Do not create two separate forms for Create and Edit if the existing project architecture supports a shared form.

Fields:

- Name
- Description

Do not add:

- Status
- CreatedBy
- WorkspaceId
- IDs
- Backend-generated fields

---

# 7. Edit Project

Editing must happen inside the same modal/form used for Create.

The form should support something conceptually similar to:

```text
type = "Create"
```

or:

```text
type = "Edit"
```

Inspect existing project code/form patterns and determine the best implementation structure.

The Edit form should be populated with the selected project's current data.

After a successful update:

- update/invalidate the appropriate React Query cache
- follow the existing mutation/query invalidation pattern in the project

Do not invent a cache strategy.

---

# 8. Delete Project

When the user chooses Delete:

Open the existing:

`ConfirmDialog.tsx`

Do not build another confirmation component.

The dialog should confirm that the user really wants to delete the selected project.

After successful deletion:

- update/invalidate the project query correctly
- follow existing React Query mutation patterns

Document how the current codebase handles mutations and cache invalidation.

---

# 9. Project Details Drawer

The "View" action should NOT navigate to a separate project details page.

Instead:

**Open a Drawer containing the project details.**

This is an existing design direction in the application.

Inspect the existing drawer components/patterns and reuse them.

The drawer should display useful project information based on the available ProjectDto.

Determine from the existing codebase which fields should be displayed and how they should be presented.

The drawer should work correctly for:

- Owner
- ProjectManager
- Member

---

# 10. Search

Add project search functionality.

Important:

The search will be performed **on the frontend**, not through a backend search parameter.

Therefore:

- fetch projects using the existing paginated API
- perform the search against the projects currently available in the frontend cache/list
- preserve the existing infinite-scroll behavior
- do not modify the backend API contract
- do not invent a `search` query parameter

Inspect the existing application for frontend filtering/search patterns and follow them.

Document how the search interacts with infinite query pages.

---

# 11. Infinite Scroll

Projects must use:

`useInfiniteQuery`

and:

`react-intersection-observer`

Use the same pattern already implemented in the project.

The plan must identify:

- where `useInfiniteQuery` should live
- how pages are flattened
- where the intersection observer sentinel should be placed
- how `hasNextPage` is handled
- how `isFetchingNextPage` is handled
- how duplicate requests are prevented
- how loading the next page works

Do not invent a different infinite-scroll approach.

---

# 12. Loading / Skeleton

The project already has a custom skeleton setup.

Use:

`react-loading-skeleton`

and the existing component:

`CustomSkeletonTheme`

Do not create a new skeleton theme.

Inspect how existing tables use skeletons and follow the same pattern.

If a required skeleton component does not exist, document that it needs to be created.

Do not implement it.

---

# 13. Empty State

When the workspace contains no projects, show an appropriate empty state.

Example concept:

```text
No projects yet
Create your first project to get started.
```

For Owner/ProjectManager:

- Show Create Project CTA.

For Member:

- Do not show a Create CTA.

Inspect existing empty-state components and patterns before proposing a new one.

---

# 14. Routing Integration With Tasks

There is an existing Tasks page:

`/dashboard/tasks?workspaceId=3`

The Projects page must integrate with Tasks.

When a user opens a project from the Projects page, the Tasks page should be able to receive the project ID through the URL.

The current Tasks route is:

```text
/dashboard/tasks?workspaceId=3
```

It needs to support:

```text
/dashboard/tasks?workspaceId=3&projectId=10
```

Required behavior:

### If projectId exists

Tasks page should:

- read `projectId` from the URL
- load/display tasks for that specific project

### If projectId does NOT exist

Tasks page should:

- load the workspace projects
- take the first project's ID
- use that project ID as the selected project/filter for tasks

This means the existing Tasks page will require modifications.

Do NOT implement these modifications now.

In the plan, inspect the current Tasks page and explain exactly:

- where `projectId` should be read
- how the selected project is currently represented
- where the fallback first-project logic should be added
- how the Tasks React Query key/query should change if necessary
- how navigation from Projects to Tasks should work
- how URL state should remain synchronized with the selected project

Important:

Do not break the existing Tasks page behavior.

---

# 15. i18n

The application uses:

`react-i18next`

The new Projects feature must support:

- English
- Arabic

Inspect the existing translation structure and identify:

- translation files that should be updated
- translation keys that should be added
- naming conventions already used

Do not hardcode user-facing strings.

Also ensure that the UI works correctly in both:

- RTL
- LTR

Pay particular attention to:

- table alignment
- action menu placement
- drawer layout
- search input
- buttons
- horizontal table scrolling
- icons
- spacing

---

# 16. Existing Architecture

The project follows this architecture:

```text
Component
   ↓
Custom Hook
   ↓
React Query
   ↓
Service
   ↓
API
```

Follow this architecture strictly.

The plan should identify the expected files/components for:

### DTOs

Project-related DTO/types.

### Services

Project API methods:

- get projects
- get project by ID
- create
- update
- delete

### React Query hooks

Queries/mutations for Projects.

### Components

Table, modal/form, drawer, actions menu, etc.

Do not create unnecessary abstractions.

Reuse existing components wherever possible.

---

# 17. Important Existing Patterns To Inspect

Before creating the plan, inspect the codebase for examples of:

1. Existing paginated tables
2. Existing `useInfiniteQuery`
3. Existing `react-intersection-observer`
4. Existing Create/Edit shared modals
5. Existing `ConfirmDialog.tsx`
6. Existing drawers
7. Existing `@floating-ui/react` menus
8. Existing React Query mutations
9. Existing cache invalidation
10. Existing permission/role checks
11. Existing search/filter implementations
12. Existing responsive tables
13. Existing RTL/LTR implementation
14. Existing i18n structure
15. Existing `CustomSkeletonTheme`
16. Existing Tasks page
17. Existing Workspace page
18. Existing Project-related DTO/service code, if any
19. Existing routing conventions
20. Existing URL query parameter handling

Use these existing implementations as the source of truth.

Do not invent patterns that already exist elsewhere in the codebase.

---

# 18. API / Frontend Types

Inspect the existing DTO definitions.

Determine whether:

- `ProjectDto` already exists
- `PaginationResultDto` already exists
- request DTOs already exist
- Project enums/types already exist

If something already exists, reuse it.

If something is missing, list it as a file/change that needs to be created.

Do not duplicate types.

---

# 19. Query Cache Design

The plan must explicitly explain the expected React Query keys.

For example, determine whether the project should use something conceptually like:

```text
["projects", workspaceId]
```

and:

```text
["project", workspaceId, projectId]
```

But do NOT blindly use these examples.

Inspect the existing query-key conventions and follow them.

Also explain:

- what gets invalidated after Create
- what gets invalidated/updated after Edit
- what gets invalidated after Delete
- whether the drawer should use the existing list data or call `GET /{projectId}`
- how infinite query cache should be handled

---

# 20. Responsive Requirements

This is important.

The Projects table must be responsive across all screen sizes.

Do NOT solve responsiveness by:

- hiding columns
- removing information
- replacing the table with cards

Instead:

**Keep all columns and use horizontal scrolling.**

Inspect the existing Tasks/Workspace tables to reproduce their responsive behavior.

The table must work correctly in:

- LTR
- RTL

The horizontal scrollbar and table layout must not break RTL behavior.

Document any important RTL-specific implementation considerations.

---

# 21. UX Expectations

The page should visually match the existing dashboard.

Do not introduce a new design language.

Reuse:

- existing buttons
- existing typography
- existing table styles
- existing modal styles
- existing drawer styles
- existing dialogs
- existing icons
- existing spacing
- existing colors
- existing responsive patterns

The final result should feel like it was built as part of the existing application, not as a separate feature.

---

# 22. Plan Requirements

Your final response must be a **detailed implementation plan**, not code.

Structure the plan as:

## 1. Codebase Findings

Explain what you found in the existing codebase.

Reference actual existing files/components and explain their patterns.

## 2. Existing Patterns To Reuse

List the relevant existing implementations and why each one should be reused.

## 3. Proposed Architecture

Show:

```text
Projects Page
    ↓
Custom Hook
    ↓
React Query
    ↓
Project Service
    ↓
API
```

and explain each layer.

## 4. Files To Create

List exact paths and explain what each file will contain.

Only include files that genuinely need to be created.

## 5. Files To Modify

List exact existing file paths and explain the required modifications.

Especially identify the Tasks page/files that need modification for:

`projectId`

URL handling.

## 6. Components

Describe:

- Projects page
- Projects table
- Project actions menu
- Project modal/form
- Project details drawer
- empty state
- skeleton/loading state

Explain which should be reused vs created.

## 7. React Query

Explain:

- query keys
- infinite query
- mutations
- cache invalidation
- optimistic update if appropriate
- search interaction with cached pages

## 8. Permissions

Explain exactly how:

- Owner
- ProjectManager
- Member

will see different UI actions.

## 9. Routing / URL State

Explain the Projects → Tasks integration.

Include the exact expected URL behavior:

```text
/dashboard/tasks?workspaceId=3
```

and:

```text
/dashboard/tasks?workspaceId=3&projectId=10
```

Explain the fallback behavior when `projectId` is missing.

## 10. Responsive / RTL / LTR

Explain how the table, drawer, action menu, search, and scrolling will behave.

## 11. i18n

List translation areas/keys that will need to be added.

## 12. Loading / Error / Empty States

Explain the expected UX and which existing components should be reused.

## 13. Implementation Order

Give a safe step-by-step implementation order.

## 14. Risks / Edge Cases

Identify potential issues such as:

- infinite query + frontend search
- deleting the last project
- projectId pointing to a deleted/non-existing project
- workspace switching
- stale query cache
- URL synchronization
- RTL horizontal scrolling
- action menu clipping
- permissions
- loading states
- drawer fetching vs list data

## 15. Final File Change Summary

Provide a concise table:

| File | Create/Modify | Purpose |
|------|---------------|---------|

---

# 23. Strict Constraints

Remember:

- PLAN ONLY.
- No code changes.
- No file modifications.
- No speculative architecture when an existing pattern exists.
- Do not create duplicate components.
- Do not add project status functionality.
- Do not modify backend code.
- Do not add backend search.
- Search is frontend-only.
- Use infinite query.
- Use `react-intersection-observer`.
- Use `CustomSkeletonTheme`.
- Use existing `ConfirmDialog.tsx`.
- Use the existing table system.
- Keep all table columns visible on small screens using horizontal scrolling.
- Support RTL and LTR.
- Use English and Arabic translations.
- Respect Owner / ProjectManager / Member permissions.
- Admin dashboard is completely out of scope.
- Projects → Tasks integration must use `projectId` in the existing query-string route.
- When `projectId` is absent on Tasks, the first project should be selected.
- Reuse existing project/task/workspace patterns wherever possible.

Most importantly:

**Inspect first. Plan second. Do not implement.**