# Implement Workspaces Management Page

Implement a complete **Workspaces Management page** inside the existing TaskManagements Dashboard.

The page should follow the project's **existing architecture, design system, component patterns, React Query patterns, routing conventions, localization, RTL/LTR support, and existing reusable components**.

Do NOT introduce a new architectural pattern.

---

# 1. Main Goal

Create a `/workspaces` page that displays the workspaces the current user belongs to in a **Table**.

The user can:

- View workspaces they belong to
- Open workspace details
- Create a new workspace
- Edit a workspace if they are the Owner
- Delete a workspace if they are the Owner
- Filter workspaces on the frontend
- Load workspaces using infinite scrolling

The page must be responsive and support both:

- English / LTR
- Arabic / RTL

---

# 2. Backend API

Base endpoint:

`/api/workspaces`

Available endpoints:

```text
GET    /api/workspaces/{id}
GET    /api/workspaces/all
GET    /api/workspaces/{id}/all-users
POST   /api/workspaces
PUT    /api/workspaces/{id}
DELETE /api/workspaces/{id}
```

Important:

This dashboard does NOT contain the Admin role.

The `/api/workspaces/all` endpoint in this dashboard should be treated as returning the current user's workspaces.

Do not implement Admin-specific UI or permissions here.

---

# 3. Workspace Listing

Use:

```text
GET /api/workspaces/all
```

The endpoint uses the existing:

```text
PaginationResultDto<T>
```

and the project already uses:

- TanStack React Query
- `useInfiniteQuery`
- `react-intersection-observer`

Follow the exact existing pagination/infinite-query pattern already used elsewhere in the project.

The query key MUST be:

```ts
["userWorkspaces"]
```

Do not invent another query key.

The implementation should support loading additional pages when the intersection observer reaches the bottom of the list.

---

# 4. Architecture

Follow the existing project pattern:

```text
Page
 ↓
Components
 ↓
Custom Hooks
 ↓
React Query
 ↓
Service
 ↓
API
```

Do NOT put API calls directly inside components.

Do NOT put React Query logic directly inside the main page.

Do NOT put the entire implementation inside one large component.

Split the feature into logical reusable components.

Suggested structure:

```text
pages/
  Workspaces/
    WorkspacesPage.tsx

components/
  workspaces/
    WorkspacesTable.tsx
    WorkspaceRow.tsx
    WorkspaceFilters.tsx
    WorkspaceFormDialog.tsx
    WorkspaceDetailsDrawer.tsx
    WorkspaceActionsMenu.tsx
    WorkspaceEmptyState.tsx
    WorkspaceTableSkeleton.tsx

hooks/
  workspaces/
    useUserWorkspaces.ts
    useCreateWorkspace.ts
    useUpdateWorkspace.ts
    useDeleteWorkspace.ts
    useWorkspaceDetails.ts
    useWorkspaceMembers.ts

services/
  workspaceService.ts
```

These are suggestions, not strict filenames.

First inspect the existing project structure and reuse its conventions.

If equivalent components/hooks/services already exist, reuse or extend them instead of duplicating them.

---

# 5. Table UI

The main content should be a clean modern SaaS-style table.

Do NOT make it look like an old-fashioned HTML table.

Use the existing Dashboard design system.

The table should display useful workspace information such as:

- Workspace name
- Description if available
- Owner
- Role
- Created date if available
- Actions

The exact displayed fields should be based on the actual `WorkspaceDto` returned by the backend.

Before implementing, inspect the actual DTO and existing workspace service/models in the project.

Do not invent properties that don't exist.

---

# 6. Workspace Role

The workspace response already contains the user's role.

The role should be used to determine available actions.

Rules:

### Owner

If the current user is the Owner of the workspace:

```text
View
Edit
Delete
```

### Member

If the current user is only a Member:

```text
View
```

Do not show Edit/Delete buttons to Members.

Do not rely only on frontend authorization for security.

The backend remains the final authority.

---

# 7. Workspace Actions

Create a dedicated `WorkspaceActionsMenu` component instead of putting all action logic inside the table.

Use the project's existing menu/dropdown component if available.

Actions:

```text
View
Edit
Delete
```

Only show Edit/Delete for Owner.

---

# 8. Create Workspace

There should be a prominent:

```text
+ Create Workspace
```

button in the page header.

Creating a workspace is available to every user.

Use a **Modal/Dialog**.

The project is moving toward Dialog/Modal-based forms, so follow that direction.

Do NOT create a separate page for creating a workspace.

---

# 9. Create/Edit Form

Create and Edit should reuse the same form component.

Use a mode/type such as:

```ts
type WorkspaceFormMode = "create" | "edit";
```

The Dialog should receive the mode and behave accordingly.

Example conceptual structure:

```text
WorkspaceFormDialog
 ├── Create mode
 └── Edit mode
```

Do not duplicate the form for Create and Edit.

The form is simple, so keep it clean and reusable.

Use the project's existing:

- Form library
- Validation library
- Input components
- Button components
- Error handling
- Toast/notification system

Do not introduce another form library.

---

# 10. Delete Workspace

Use the existing:

```text
ConfirmDialog.tsx
```

Do NOT create another confirmation dialog.

When the Owner clicks Delete:

1. Open `ConfirmDialog`
2. Show a clear localized confirmation message
3. If confirmed, execute the delete mutation
4. Show success/error feedback using the existing application pattern
5. Invalidate/refetch the workspaces query

---

# 11. React Query Mutations

Use the existing project pattern for mutations.

Create hooks such as:

```text
useCreateWorkspace
useUpdateWorkspace
useDeleteWorkspace
```

After successful Create:

```ts
queryClient.invalidateQueries({
  queryKey: ["userWorkspaces"],
});
```

After successful Update:

```ts
queryClient.invalidateQueries({
  queryKey: ["userWorkspaces"],
});
```

After successful Delete:

```ts
queryClient.invalidateQueries({
  queryKey: ["userWorkspaces"],
});
```

Follow the existing project's mutation/error handling pattern.

Do not manually duplicate cache-management logic unless the existing project pattern requires it.

---

# 12. Workspace Details Drawer

When the user clicks View, do NOT navigate to a completely separate details page.

Instead, open a **Drawer / Sidebar** containing workspace details.

The drawer should show useful workspace information.

For example:

```text
Workspace Name
Description
Owner
Current User Role
Created Date
Members
```

Use the existing Drawer/Sidebar component from the design system if one exists.

If no suitable component exists, create a reusable `WorkspaceDetailsDrawer`.

---

# 13. Workspace Members

There is a dedicated endpoint:

```text
GET /api/workspaces/{id}/all-users
```

The response contains:

```ts
export default interface WorkSpaceUserDto {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  workSpaceRole: string;
}
```

Do NOT request members for every workspace in the table.

This would create an N+1 request problem.

Instead:

1. User opens the Workspace Details Drawer
2. Fetch members for that specific workspace
3. Display them inside the Drawer

Use a dedicated custom hook for the members request.

The members list should also follow the existing project patterns for:

- Loading
- Error
- Empty state

---

# 14. Workspace Navigation

The main workspace route is:

```text
/dashboard?workspaceId={workspaceId}
```

When the user selects/open a workspace from the workspace page, navigate to:

```text
/dashboard?workspaceId=3
```

Replace `3` with the actual workspace ID.

Use the project's existing React Router/navigation pattern.

Do not hardcode the workspace ID.

---

# 15. Frontend Filtering

Filtering should happen **only on the frontend**.

Do NOT modify the backend endpoint to support filters.

Possible filters:

```text
All
Owned
Member
```

And/or search by workspace name if the existing design supports it.

The filter must work with the currently loaded workspaces.

Keep filtering logic outside the presentation table component, preferably in a custom hook or a dedicated filtering utility if that matches the existing project conventions.

Do not send filter parameters to the backend.

---

# 16. Infinite Query + Filtering

Be careful with the combination of:

```text
useInfiniteQuery
+
frontend filtering
```

The complete list represented by all loaded pages should be flattened before applying the frontend filter.

Conceptually:

```ts
pages
  → flatten
  → filter
  → render
```

Do not apply the filter independently to each page in a way that causes inconsistent UI behavior.

Continue loading pages through `react-intersection-observer`.

Follow the exact implementation pattern already used elsewhere in the project.

---

# 17. Loading States

Implement proper loading states.

The page should have a table skeleton while the initial workspaces request is loading.

When loading additional infinite-query pages, show a smaller loading indicator at the bottom rather than replacing the entire table.

Use the project's existing Skeleton/Loading components if available.

---

# 18. Empty States

If the user has no workspaces:

Show a proper empty state instead of an empty table.

Example concept:

```text
No workspaces yet

Create a workspace to start organizing your tasks and projects.

[ Create Workspace ]
```

The message must be localized.

If a filter returns no results:

Show a different empty state such as:

```text
No workspaces match your filter.
```

Do not confuse:

```text
No workspaces exist
```

with:

```text
No workspaces match the current filter
```

---

# 19. Error Handling

Follow the project's existing error-handling pattern.

Handle:

- Initial loading errors
- Infinite query errors
- Create errors
- Update errors
- Delete errors
- Workspace details errors
- Members loading/errors

Do not introduce a new global error-handling mechanism.

Reuse existing Toast/Error components and conventions.

---

# 20. Responsive Design

The page MUST be responsive.

Consider:

- Desktop
- Tablet
- Mobile

The table should remain usable on smaller screens.

If the existing project uses horizontal scrolling for tables, follow that pattern.

Do not destroy the existing Dashboard layout.

---

# 21. RTL / LTR

The application supports:

```text
Arabic → RTL
English → LTR
```

The implementation MUST work correctly in both directions.

Pay special attention to:

- Table alignment
- Action menus
- Drawer positioning
- Dialog layout
- Icons
- Spacing
- Search/filter controls
- Text alignment
- Pagination/loading indicators

Do not hardcode left/right positioning when logical CSS properties or the project's RTL conventions can be used.

Use the existing i18n system.

Do not hardcode user-visible English or Arabic strings directly inside components.

---

# 22. Localization

Use the existing `react-i18next` localization pattern.

Add translation keys for all new UI text, including:

- Workspaces
- Create Workspace
- Edit Workspace
- Delete Workspace
- View Workspace
- Owner
- Member
- All
- No workspaces
- No matching workspaces
- Confirmation messages
- Success messages
- Error messages
- Form validation messages
- Drawer labels
- Members
- Loading states

Update the appropriate translation files for both Arabic and English.

---

# 23. Design System

This is extremely important.

The page MUST follow the existing application's design system.

Before creating anything, inspect existing components and reuse them.

Reuse existing components for:

- Button
- Table
- Dialog
- Drawer
- Input
- Select
- Dropdown/Menu
- Badge
- Skeleton
- ConfirmDialog
- EmptyState
- Toast
- Pagination/loading indicators

Do not create duplicate UI primitives.

If a component does not exist, create a feature-specific component rather than creating a new generic design-system component unnecessarily.

---

# 24. Component Separation

Do NOT implement everything inside:

```text
WorkspacesPage.tsx
```

The page should primarily compose the feature.

For example:

```text
WorkspacesPage
 ├── Page Header
 │    ├── Title
 │    └── Create Workspace Button
 │
 ├── Workspace Filters
 │
 ├── WorkspacesTable
 │    └── WorkspaceRow
 │         └── WorkspaceActionsMenu
 │
 ├── WorkspaceFormDialog
 │
 ├── WorkspaceDetailsDrawer
 │    └── WorkspaceMembers
 │
 └── ConfirmDialog
```

Keep business/data-fetching logic in hooks.

Keep API communication in services.

Keep presentation logic in components.

---

# 25. Existing Codebase First

Before writing code:

1. Inspect the existing project structure.
2. Find an existing page that uses `useInfiniteQuery`.
3. Find an existing implementation using `react-intersection-observer`.
4. Find existing Dialog usage.
5. Find existing Drawer usage.
6. Find `ConfirmDialog.tsx`.
7. Find existing CRUD forms.
8. Find existing table implementations.
9. Find existing filtering implementations.
10. Find existing mutation hooks.
11. Find the existing workspace DTO/service if present.
12. Find existing i18n translation structure.

Then implement Workspaces using the same patterns.

Do not blindly follow the suggested filenames if the project already has a better established structure.

---

# 26. Important Constraints

Do NOT:

- Add Admin UI to this dashboard
- Add backend filtering
- Fetch members for every workspace
- Create a separate Create Workspace page
- Create a separate Edit Workspace page
- Create another ConfirmDialog
- Put API calls directly in components
- Put all logic inside WorkspacesPage
- Introduce a new state-management library
- Introduce another form library
- Introduce another UI library
- Break the existing design system
- Hardcode translations
- Break RTL/LTR support
- Replace the existing React Query architecture

---

# 27. Expected Result

The final page should feel like a polished modern SaaS Workspace Management page.

Structure:

```text
---------------------------------------------------------
| Workspaces                         [+ Create Workspace] |
| Manage the workspaces you belong to                    |
---------------------------------------------------------

| Search / Filters                                      |
---------------------------------------------------------

| Workspace | Owner | Role | Created | Actions         |
|-----------|-------|------|---------|-----------------|
| WorkPilot | Hamdy | Owner| ...     | View Edit Delete |
| Frontend  | Ahmed | Member| ...    | View             |
| Backend   | Omar  | Member| ...    | View             |
---------------------------------------------------------

                 Loading more...
```

Clicking **View** opens the Workspace Details Drawer.

Clicking **Edit** opens the reusable Create/Edit Dialog in edit mode.

Clicking **Delete** opens the existing `ConfirmDialog`.

Clicking **Create Workspace** opens the same form in create mode.

Everything should respect the current user's workspace role.

---

# 28. Final Verification

After implementation, verify:

- TypeScript has no errors
- ESLint has no errors
- Create works
- Edit works
- Delete works
- Owner sees Edit/Delete
- Member does not see Edit/Delete
- View opens the Drawer
- Members are fetched only when needed
- Infinite scrolling works
- `react-intersection-observer` works correctly
- Query key is exactly `["userWorkspaces"]`
- Mutations invalidate `["userWorkspaces"]`
- Frontend filters work
- Empty states work
- Loading states work
- Error states work
- Arabic works
- English works
- RTL works
- LTR works
- Mobile/tablet layout works
- Existing Dashboard design system remains consistent

Do not modify unrelated features or refactor unrelated code.
Only change files that are necessary for this feature.