# Implement the Tasks Page — WorkPilot Frontend

You are working on the existing **WorkPilot** frontend, a premium SaaS task-management application built with:

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Redux Toolkit
* TanStack React Query
* React Router
* Axios
* Formik + Yup
* Framer Motion
* Chart.js

The backend is an ASP.NET Core 10 REST API using Clean Architecture + CQRS.

Your task is to **implement the Tasks page in the existing frontend project**.

---

## 1. Important Instructions

Before writing or modifying code:

1. Inspect the existing project structure.
2. Inspect the existing design system, theme, Tailwind configuration, reusable UI components, layout components, buttons, inputs, modals, drawers, badges, dropdowns, skeletons, alerts, pagination, etc.
3. Inspect the existing API/service layer.
4. Inspect existing React Query hooks and Redux patterns.
5. Inspect existing workspace/project/member hooks.
6. Inspect existing routing conventions.
7. Inspect existing authentication/user/role handling.
8. Reuse existing components and utilities whenever possible.
9. Do NOT create duplicate components or duplicate API logic if an existing implementation can be reused.
10. Follow the existing project's naming conventions and folder structure.
11. Do NOT change the backend.
12. Do NOT introduce a new state-management or data-fetching library.
13. Do NOT redesign the existing WorkPilot design system.

The final implementation must feel like a native part of the existing WorkPilot application.

---

# 2. Tasks Page Goal

Create a **workspace-level Tasks page**.

Suggested route:

```text
/workspaces/:workspaceId/tasks
```

The page manages tasks belonging to projects inside the selected workspace.

The backend Tasks API is project-scoped, so the page must contain a **Project Selector**.

---

# 3. Page Structure

The page should have:

```text
Tasks
Manage and track tasks across your workspace

[ Project Selector ]

[ All Tasks ] [ My Tasks ]

[ Search ] [ Status ] [ Priority ] [ Sort ] [ Reset ]

[ Table View ] [ Kanban View ]

Task list / Kanban

Pagination
```

Keep the UI clean, modern, premium, minimal, and consistent with the existing WorkPilot design system.

Do not add unnecessary KPI cards because the Tasks page is intended to focus on task management.

---

# 4. Project Selector

Load the workspace projects using the existing Projects API/hook.

Use the existing project endpoint:

```http
GET /api/workspaces/{workspaceId}/projects
```

The project list is paginated by the backend.

If the application already has a reusable workspace-project hook, reuse it.

## Behavior

When the page loads:

1. Load workspace projects.
2. If projects exist:

   * Automatically select the first project.
   * Fetch its tasks.
3. If there are no projects:

   * Do not call the Tasks API.
   * Show an appropriate empty state.

Example empty state:

```text
No projects yet

Create a project to start managing tasks in this workspace.
```

If the user changes the selected project:

```text
selectedProjectId changes
        ↓
reset pageNumber to 1
        ↓
fetch tasks for the selected project
```

Do not keep the previous project's task data visible as if it belongs to the new project.

---

# 5. Roles

Workspace roles are:

```text
Owner
ProjectManager
Member
```

There is NO `Frontend` role.

The frontend must respect these roles.

Backend authorization remains the ultimate source of truth.

---

# 6. Permissions

## Owner

Owner can:

* View all tasks
* View own tasks
* Create tasks
* Edit tasks
* Delete tasks
* Assign users
* Unassign users
* Change task status
* Add comments
* Edit own comments
* Delete own comments
* Delete other comments according to backend authorization
* View attachments
* Upload attachments
* Delete attachments

## ProjectManager

ProjectManager has the same task-management permissions relevant to Tasks:

* View all tasks
* View own tasks
* Create tasks
* Edit tasks
* Delete tasks
* Assign users
* Unassign users
* Change task status
* Add comments
* Edit own comments
* Delete comments according to backend authorization
* View attachments
* Upload attachments
* Delete attachments

## Member

Member can:

* View all project tasks
* Switch to My Tasks
* Search tasks
* Filter tasks
* Sort tasks
* Paginate tasks
* Open task details
* Add comments
* Edit their own comments
* Delete their own comments
* View attachments
* Change status only for tasks assigned to themselves

Member cannot:

* Create tasks
* Edit tasks
* Delete tasks
* Assign users
* Unassign users
* Upload attachments
* Delete attachments

Do not rely only on hiding UI actions for security. The backend remains authoritative.

---

# 7. All Tasks / My Tasks

The page must provide:

```text
All Tasks
My Tasks
```

Default:

```text
All Tasks
```

## All Tasks endpoint

```http
GET /api/workspaces/{workspaceId}/projects/{projectId}/tasks
```

## My Tasks endpoint

```http
GET /api/workspaces/{workspaceId}/projects/{projectId}/tasks/me
```

Both endpoints support the same filtering, sorting, and pagination parameters.

When switching:

```text
All Tasks → My Tasks
or
My Tasks → All Tasks

reset pageNumber = 1
fetch the selected endpoint
```

Do NOT fetch all tasks and filter them locally.

---

# 8. Backend Filtering

Filtering MUST happen on the backend.

Do NOT implement client-side filtering over the returned task collection.

The backend already supports:

```text
pageNumber
pageSize
status
priority
searchTerm
sortBy
sortOrder
```

Example:

```http
GET /api/workspaces/2/projects/10/tasks
?pageNumber=1
&pageSize=10
&status=InProgress
&priority=High
&searchTerm=landing
&sortBy=deadline
&sortOrder=asc
```

The frontend should only manage filter state and send the parameters to the backend.

---

# 9. Filter Behavior

Provide:

## Search

Search by task name/description using:

```text
searchTerm
```

Do not perform local filtering.

Prefer a small debounce for search requests if the existing project already has a debounce utility/pattern.

Do not introduce unnecessary dependencies.

## Status

Options:

```text
All
Backlog
Todo
InProgress
Review
Done
```

## Priority

Options:

```text
All
Low
Medium
High
Critical
```

## Sort

Use the backend's:

```text
sortBy
sortOrder
```

Do not hardcode assumptions about unsupported backend fields.

Inspect the existing backend/frontend conventions before selecting the final sort options.

Possible UI examples:

```text
Created Date
Deadline
Priority
Name
```

Only expose fields supported by the backend.

## Reset

Reset:

```text
searchTerm
status
priority
sortBy
sortOrder
pageNumber
```

to their default values.

Every filter change must reset:

```text
pageNumber = 1
```

---

# 10. Pagination

The backend returns:

```csharp
public class PaginationResultDto<T>
{
    public IEnumerable<T> Data { get; set; }
    public int TotalCount { get; set; }

    public int PageNumber { get; set; }
    public int PageSize { get; set; }

    public int? NextPage { get; set; }
    public int? PreviousPage { get; set; }

    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}
```

Use this response directly.

Do not calculate pagination metadata manually in the frontend.

The UI should provide:

```text
Previous
Page X of Y
Next
```

Disable Previous when:

```text
hasPreviousPage === false
```

Disable Next when:

```text
hasNextPage === false
```

When changing page:

```text
pageNumber = selectedPage
```

Keep the current:

* project
* All/My Tasks mode
* status
* priority
* search
* sorting

when changing pages.

---

# 11. Table View

The default view must be **Table**.

Suggested columns:

```text
Task
Assignee
Priority
Status
Deadline
Actions
```

The table should be responsive and fit the existing dashboard layout.

## Task column

Show:

* Task name
* Short description if appropriate

Do not make the table visually overloaded.

## Assignee

Show the assigned user's name/avatar if available.

If unassigned:

```text
Unassigned
```

## Priority

Use the existing WorkPilot badge styles.

Priority values:

```text
Low
Medium
High
Critical
```

## Status

Use the existing status badge styles.

Statuses:

```text
Backlog
Todo
InProgress
Review
Done
```

## Deadline

Format the date using an existing date utility if one exists.

If deadline has passed, use an appropriate existing warning/danger visual treatment.

Do not create an entirely new color system.

---

# 12. Highlight Current User's Tasks

All Tasks returns tasks assigned to all users in the workspace.

Tasks assigned to the currently authenticated user must have a **subtle visual highlight**.

Do NOT use an aggressive background color.

Possible treatment:

* subtle border
* slightly different background
* small `You` badge
* existing theme accent

The implementation must work correctly in both:

```text
Dark mode
Light mode
```

Use the existing WorkPilot design tokens.

---

# 13. Table Actions

Each task must have a:

```text
•••
```

actions menu.

Do not show every action as a separate button.

Actions must be role/assignment aware.

Possible actions:

```text
View Details
Edit
Change Status
Assign
Unassign
Delete
```

Only show actions allowed for the current user.

For example:

Member:

```text
View Details
Change Status   ← only if assigned to current user
```

Owner/ProjectManager:

```text
View Details
Edit
Change Status
Assign
Delete
```

If a task has no active assignment, do not show an unnecessary Unassign action.

---

# 14. Kanban View

Provide a Table/Kanban toggle.

The Kanban view is secondary.

Columns:

```text
Backlog
Todo
InProgress
Review
Done
```

Each task appears as a card.

Cards should display:

* Task name
* Priority
* Assignee
* Deadline
* current user's task highlight when applicable

## Important

Do NOT implement drag-and-drop initially.

Changing status should use the existing backend status endpoints.

The Kanban view is only another visualization of the same backend data.

Do not load a second independent task dataset just for Kanban.

---

# 15. Create Task

Only:

```text
Owner
ProjectManager
```

can create tasks.

Use a **Modal**, not a drawer.

Fields:

```text
Name *
Description
Deadline *
Priority *
Assignee
```

Assignee is optional.

The Assignee selector must use workspace members loaded from:

```http
GET /api/workspaces/{workspaceId}/all-users
```

Reuse the existing workspace-users hook/service if available.

Do not request workspace members separately for every task.

After successful creation:

1. Close modal.
2. Invalidate/refetch the current project's tasks.
3. Keep the selected project.
4. Keep the current All/My Tasks mode.
5. Reset pagination only if necessary according to the existing data-fetching pattern.
6. Show the existing success feedback mechanism.

---

# 16. Edit Task

Only:

```text
Owner
ProjectManager
```

can edit tasks.

Use a Modal.

Fields:

```text
Name
Description
Deadline
Priority
```

Do not allow assignment changes through the Edit Task form if assignment has dedicated backend endpoints.

Assignment should remain a separate action.

After successful update:

* close modal
* refresh/invalidate task data
* preserve project/filter context

---

# 17. Delete Task

Only:

```text
Owner
ProjectManager
```

can delete tasks.

Use the existing confirmation dialog component if one exists.

Do not immediately remove the task without confirmation.

After successful deletion:

* refresh/invalidate tasks
* handle pagination correctly if the last item on the page was deleted

---

# 18. Assign / Unassign

Use the dedicated backend endpoints.

Assign:

```http
POST /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/assignments
```

Body:

```json
{
  "userId": "..."
}
```

Unassign:

```http
DELETE /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/assignments/{assignedUserId}
```

The assignment selector must use:

```http
GET /api/workspaces/{workspaceId}/all-users
```

Do not manually construct user lists.

Only:

```text
Owner
ProjectManager
```

can perform assignment actions.

---

# 19. Task Status

There are two backend status endpoints.

## Manager status

For:

```text
Owner
ProjectManager
```

use:

```http
PATCH /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/status
```

Body:

```json
{
  "status": "InProgress"
}
```

## Self status

For a Member when the task is assigned to the current user:

```http
PATCH /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/me/status
```

Body:

```json
{
  "status": "Done"
}
```

The frontend must select the correct endpoint based on:

```text
current workspace role
+
whether current user is assigned to the task
```

Do not allow a Member to change another user's task status.

After a successful status change, invalidate/refetch the relevant task query.

---

# 20. Task Details Side Drawer

Clicking a task opens a **Side Drawer**.

Do not navigate away from the Tasks page.

The drawer should contain:

```text
Task name
Description
Status
Priority
Deadline
Assignee
Attachments
Comments
```

Use the existing drawer component if available.

The drawer should have appropriate actions based on permissions.

---

# 21. Attachments

The backend supports:

```text
PDF
JPG
JPEG
PNG
Maximum 50 MB
```

Endpoints:

```http
POST /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/attachments
GET /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/attachments
GET /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/attachments/{attachmentId}
GET /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/attachments/by-name/{name}
DELETE /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/attachments/{attachmentId}
```

In the drawer show:

```text
Attachments

file.pdf
image.png
```

Members can view/download attachments.

Only Owner/ProjectManager can upload/delete according to the backend permissions.

If the existing frontend has file upload/download utilities, reuse them.

Validate file type and size in the UI, while keeping backend validation authoritative.

---

# 22. Comments

Comments must be implemented inside the Task Details drawer.

Endpoints:

```http
POST /comments
GET /comments
PUT /comments/{commentId}
DELETE /comments/{commentId}
```

Display:

* Author
* Comment text
* Created date
* Updated date if available

Users can edit their own comments.

Members can delete their own comments.

Owner/Admin can delete comments according to backend authorization.

Use the existing confirmation dialog for destructive actions.

---

# 23. Loading States

Implement proper loading states.

Use existing project skeleton components where available.

Required states:

* Projects loading
* Tasks loading
* Task details loading
* Comments loading
* Attachments loading
* Create mutation loading
* Update mutation loading
* Delete mutation loading
* Assignment loading
* Status update loading
* Comment mutation loading
* Attachment mutation loading

Do not block the entire page unnecessarily during small mutations.

Prefer localized loading indicators.

---

# 24. Empty States

Handle at least:

### No projects

```text
No projects yet
Create a project to start managing tasks.
```

### Project has no tasks

```text
No tasks found
There are no tasks for this project yet.
```

### Filters return no tasks

```text
No tasks match your filters
Try adjusting or clearing your filters.
```

### My Tasks is empty

```text
No tasks assigned to you
You currently have no assigned tasks in this project.
```

Use the existing WorkPilot empty-state components/styles where possible.

---

# 25. Error Handling

Use the existing API error handling mechanism.

Do not introduce a new global error system.

Handle:

* 401
* 403
* 404
* validation errors
* network errors
* upload errors
* mutation errors

Display user-friendly messages using the project's existing toast/alert/error components.

Do not expose raw backend exception messages unless the existing application already intentionally does so.

---

# 26. React Query / Data Fetching

Use the existing TanStack React Query architecture.

Do not fetch everything manually with `useEffect + axios` if the project already uses React Query hooks.

Prefer dedicated hooks/services following the existing project conventions.

Potential hooks may include:

```text
useProjects
useProjectTasks
useMyTasks
useWorkspaceUsers
useTask
useTaskComments
useTaskAttachments
```

Use the actual naming conventions found in the existing codebase.

Use query keys that include all relevant parameters:

```text
workspaceId
projectId
mode
pageNumber
pageSize
status
priority
searchTerm
sortBy
sortOrder
```

Changing any relevant parameter must retrieve the correct server-side dataset.

Avoid unnecessary duplicate requests.

---

# 27. URL State

Before implementing URL/query parameter state, inspect the existing application conventions.

If the project already uses URL search parameters for dashboard filters, follow that pattern.

If not, keep the implementation simple and consistent with the existing Tasks page architecture.

Do not introduce URL synchronization merely for the sake of it.

---

# 28. Responsive Design

The page must work well on:

* Desktop
* Laptop
* Tablet
* Mobile

The table should have an appropriate responsive strategy.

Do not make the entire page horizontally overflow unnecessarily.

The Task Details drawer must also work on smaller screens.

On mobile, it may become a full-screen drawer/modal while preserving the same UX.

---

# 29. Animations

Use Framer Motion only where it improves the experience.

Good candidates:

* Task drawer opening
* Modal opening
* View switching
* Empty state appearance
* Kanban cards appearing

Avoid excessive animations.

The UI should feel fast and professional.

---

# 30. Architecture

Follow the existing project architecture.

Do not create a giant `Tasks.tsx` file containing everything.

Separate responsibilities appropriately:

```text
TasksPage
    ↓
Task filters
Project selector
Task view switcher
Task table
Task kanban
Task actions
Task create modal
Task edit modal
Task details drawer
Comments section
Attachments section
Pagination
```

Only create components when they are reusable or make the page significantly easier to maintain.

Follow the existing folder naming and component conventions instead of blindly using the structure above.

---

# 31. Important Backend API Rules

Do not invent endpoints.

Use exactly the backend routes already available.

Tasks:

```http
GET    /api/workspaces/{workspaceId}/projects/{projectId}/tasks
GET    /api/workspaces/{workspaceId}/projects/{projectId}/tasks/me
GET    /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}
POST   /api/workspaces/{workspaceId}/projects/{projectId}/tasks
PUT    /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}
DELETE /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}
POST   /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/assignments
DELETE /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/assignments/{assignedUserId}
PATCH  /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/status
PATCH  /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/me/status
```

Workspace users:

```http
GET /api/workspaces/{workspaceId}/all-users
```

Comments:

```http
POST   /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/comments
GET    /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/comments
PUT    /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/comments/{commentId}
DELETE /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/comments/{commentId}
```

Attachments:

```http
POST   /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/attachments
GET    /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/attachments
GET    /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/attachments/{attachmentId}
DELETE /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/attachments/{attachmentId}
```

---

# 32. No Local Filtering

This is especially important.

Do NOT do:

```ts
tasks.filter(...)
tasks.sort(...)
tasks.slice(...)
```

to implement the Tasks page filtering/pagination.

The backend must handle:

```text
Filtering
Searching
Sorting
Pagination
```

The frontend only sends the parameters and renders the returned result.

---

# 33. Query State Example

Use an architecture conceptually similar to:

```ts
type TaskQueryParams = {
  pageNumber: number;
  pageSize: number;
  status?: ProjectTaskStatus;
  priority?: TaskPriority;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
```

Do not copy this blindly if the project already has an equivalent type.

Reuse existing shared types.

---

# 34. Performance

Avoid:

* Fetching all tasks unnecessarily
* Fetching workspace users for every task
* Duplicate API requests
* Local filtering of server-paginated data
* Refetching unrelated queries after mutations

Use React Query invalidation carefully.

For example, after changing a task status, update/invalidate the relevant task query instead of refetching the entire workspace.

---

# 35. Notifications

Do NOT implement realtime task synchronization through SignalR.

The existing notification system should remain responsible for notifications.

If the project already supports SignalR notifications, preserve that implementation.

When a notification arrives, the application may play the existing notification sound.

Do not add a separate SignalR connection specifically for the Tasks page.

---

# 36. Final Quality Requirements

Before considering the task complete:

* TypeScript must compile without errors.
* No unnecessary `any`.
* No duplicated API logic.
* No duplicated design-system components.
* No invented backend endpoints.
* No client-side filtering/pagination.
* No role named `Frontend`.
* Correct Owner/ProjectManager/Member permissions.
* Correct All Tasks/My Tasks endpoints.
* Correct manager/self status endpoints.
* Correct pagination behavior.
* Correct project switching.
* Correct empty states.
* Correct loading states.
* Correct error handling.
* Dark mode must work.
* Light mode must work.
* Responsive layout must work.
* Existing WorkPilot design system must be preserved.
* Existing architecture and conventions must be preserved.

---

# 37. Implementation Process

Follow this order:

### Step 1 — Inspect

Inspect the existing frontend thoroughly before changing anything.

Identify:

* Existing layout
* Existing dashboard components
* Existing project hooks
* Existing workspace hooks
* Existing user/member hooks
* Existing API client
* Existing React Query setup
* Existing Redux state
* Existing role utilities
* Existing modal
* Existing drawer
* Existing dropdown
* Existing table
* Existing pagination
* Existing badges
* Existing toast/error handling
* Existing loading/skeleton components
* Existing date utilities
* Existing file upload utilities
* Existing notification system

### Step 2 — Reuse

Reuse existing code wherever possible.

### Step 3 — Implement

Implement the Tasks page and supporting components/hooks/services.

### Step 4 — Integrate

Integrate with existing routing and workspace navigation.

### Step 5 — Verify

Run:

```bash
npm run build
```

and the project's existing lint/type-check/test commands if available.

Fix all TypeScript/build/lint issues caused by the implementation.

---

# 38. Do Not Overengineer

Do not add:

* New state management
* New UI library
* New HTTP client
* New form library
* New animation library
* New filtering library
* New table library

unless the existing project already uses it.

Use the project's existing stack.

The goal is a **production-quality Tasks page integrated into the existing WorkPilot frontend**, not a standalone demo.

Implement the feature completely and consistently with the existing codebase.
