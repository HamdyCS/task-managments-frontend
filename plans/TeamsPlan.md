# Teams Page — Implementation Plan

## Goal

Implement a complete **Teams page** for the current workspace in the frontend.

The page should allow the current user to:

1. View all workspace members.
2. Clearly identify their own account with a visual indicator and `You`.
3. Send workspace invitations if they are the **Owner**.
4. View invitations they have sent.
5. Cancel pending sent invitations.
6. View invitations they have received.
7. Accept or reject received invitations.
8. Use infinite pagination for members and both invite lists.
9. Keep all data synchronized using TanStack React Query invalidation.

---

# IMPORTANT — Before Writing Code

Before implementing anything:

1. Inspect the existing frontend architecture.
2. Find how workspace-related pages are structured.
3. Find the existing workspace/current-workspace logic.
4. Find the existing API service pattern.
5. Find existing React Query custom hooks.
6. Find existing pagination / infinite-query implementations.
7. Find existing Dialog / Modal components.
8. Find existing Button, Input, Badge, Avatar, Table, Empty State, Skeleton, Toast components.
9. Find the existing permission/role handling pattern.
10. Follow the project's existing naming conventions and folder structure.

Do NOT introduce a new architecture.

The required data flow is:

```text
Component
    ↓
Custom Hook
    ↓
Service
    ↓
API

React Query logic must live inside custom hooks, not directly inside components.

Reuse existing components and patterns whenever possible.

Page

Create the Teams page for the current workspace.

The workspace is already available through the existing workspace routing/URL mechanism.

Do not create a new workspace-selection mechanism.

The page should automatically use the current workspace ID from the existing project pattern.

1. Members Section

Create a Members section that displays all members of the current workspace.

Each member should display at least:

Avatar
Name
Email
Role

Example:

Members

┌────────────────────────────────────────────────────┐
│ Avatar │ Name        │ Email             │ Role    │
├────────────────────────────────────────────────────┤
│   H    │ Hamdy       │ hamdy@gmail.com   │ Owner   │
│   A    │ Ahmed       │ ahmed@gmail.com   │ Member  │
│   M    │ Mohamed     │ mohamed@gmail.com │ PM      │
└────────────────────────────────────────────────────┘
Current User

The current user's row must be visually different from the other members.

The goal is to make it immediately obvious which member represents the logged-in user.

Use the existing design system.

Add a small:

You

indicator/badge near the user's name.

Do not use an excessive color scheme.

The visual distinction should feel consistent with the rest of the application.

Determine the current user using the existing authenticated-user/current-user mechanism in the project.

Do NOT make an additional unnecessary API request if the current user is already available globally.

Members Pagination

Members use backend pagination and MUST use:

useInfiniteQuery

Do not implement normal useQuery pagination.

Follow the existing infinite-query pattern in the project.

The hook should support:

Initial loading
Fetch next page
Loading next page
End of pagination
Empty state
Error state

If the project already has an infinite-scroll component/pattern, reuse it.

Otherwise implement the pagination UI according to the existing project's design.

Do not reinvent pagination behavior if an existing implementation already exists.

2. Invite Member

The Owner can invite a user to the workspace.

Only:

Owner

can see/use the invite functionality.

Project Manager must NOT be allowed to send invitations.

Member must NOT be allowed to send invitations.

The UI should not display the invite button for unauthorized users.

The backend remains the final authority for authorization.

Invite UI

Add an:

+ Invite Member

button in the Teams page header/appropriate section.

When clicked, open the project's existing Dialog/Modal component.

The dialog should contain:

Invite Member

Email
[________________________]

             Cancel   Send Invite

The invite request uses:

email

not userId.

Use the existing form pattern in the project.

If the project uses Formik/Yup for forms, follow that pattern.

Validate the email before sending.

Invite API

Use:

POST /api/workspace-invites

The request should contain the invited user's email and the current workspace context according to the existing backend DTO/API contract.

Do NOT guess the DTO.

Inspect the existing service/types/backend contract already represented in the frontend before implementation.

Invite Success

After successfully sending an invitation:

Show the project's existing success notification/toast.
Close/reset the dialog.
Invalidate/refetch the sent invitations query.

The sent invitations list must immediately reflect the new invitation.

Use React Query invalidation.

Do NOT manually mutate unrelated global state.

3. Sent Invitations

Create a section for:

Sent Invites

This displays invitations sent by the current user.

Endpoint:

GET /api/workspace-invites/all-my-send-invites

This endpoint is paginated.

It MUST use:

useInfiniteQuery

Follow the existing infinite-query implementation pattern.

Each invitation should display useful information such as:

Invited email/user
Workspace if relevant
Status
Date if available
Cancel action

Only pending invitations should have the cancel action.

Cancel Sent Invitation

The user can cancel/delete a pending invitation.

Endpoint:

DELETE /api/workspace-invites/{id}

When the user clicks cancel:

DO NOT immediately delete it.

Open a confirmation Dialog.

Example:

Cancel Invitation?

Are you sure you want to cancel this invitation?

            Cancel        Confirm

Use the existing Dialog component/pattern in the project.

After confirmation:

Call the DELETE endpoint.
Show success feedback.
Invalidate the sent invitations query.
Keep the UI synchronized with the backend.

Do not manually remove the item unless that is already the project's established React Query pattern.

4. Received Invitations

Create another section:

Received Invites

This displays invitations received by the current user.

Endpoint:

GET /api/workspace-invites/all-my-invites

This is also paginated.

It MUST use:

useInfiniteQuery

Follow the project's existing infinite-query pattern.

Each invitation should display:

Workspace information
Sender information if available
Date if available
Accept action
Reject action
Accept Invitation

Endpoint:

PATCH /api/workspace-invites/{id}/accept

When the user accepts:

Call the API.
Show success notification.
Invalidate the received invitations query.
Invalidate the members query.
If the current workspace/workspace list data is affected by joining the workspace, invalidate the relevant existing workspace query as well.
Do not manually maintain duplicated state.

The accepted invitation should disappear from Received Invites after invalidation.

The new member should appear in the Members section after invalidation/refetch.

Reject Invitation

Endpoint:

PATCH /api/workspace-invites/{id}/reject

When the user rejects:

Call the API.
Show success notification.
Invalidate the received invitations query.

The rejected invitation should disappear from Received Invites.

Use the existing mutation hook pattern.

React Query Architecture

Follow this structure:

Teams Component
        ↓
useWorkspaceMembers()
useSendWorkspaceInvite()
useMySentInvites()
useCancelWorkspaceInvite()
useMyReceivedInvites()
useAcceptWorkspaceInvite()
useRejectWorkspaceInvite()
        ↓
WorkspaceInvitesService / WorkspaceService
        ↓
Axios/API Client
        ↓
Backend

Do not put API calls directly inside React components.

Do not use useEffect for fetching server state.

Use TanStack React Query.

Query Keys

Follow the existing query-key conventions in the project.

Create/extend query keys for:

workspace members
sent workspace invites
received workspace invites

The workspace ID MUST be part of workspace-specific query keys where required.

For example, conceptually:

["workspace-members", workspaceId]

["workspace-sent-invites", workspaceId]

["workspace-received-invites"]

BUT:

Do NOT blindly copy these exact keys.

Inspect the project's existing query-key conventions and follow them.

Query Invalidation Matrix

Make sure mutations invalidate the correct queries.

Send Invite

After:

POST /api/workspace-invites

Invalidate:

Sent Invites
Cancel Invite

After:

DELETE /api/workspace-invites/{id}

Invalidate:

Sent Invites
Accept Invite

After:

PATCH /api/workspace-invites/{id}/accept

Invalidate:

Received Invites
Members

Also invalidate workspace-related queries if accepting an invitation changes the user's workspace membership/list.

Reject Invite

After:

PATCH /api/workspace-invites/{id}/reject

Invalidate:

Received Invites
Permissions

The invite button must only be rendered for:

Owner

Do not rely only on hiding the UI.

Make sure the frontend permission logic follows the existing role/permission pattern.

The backend remains the source of truth.

Do not add Project Manager permissions if the backend says only Owner can invite.

UI Structure

Prefer a clean SaaS-style layout consistent with the existing application.

Suggested structure:

Teams
├── Page Header
│   ├── Title
│   ├── Description
│   └── Invite Member button (Owner only)
│
├── Members Card
│   ├── Header
│   ├── Members Table
│   └── Pagination / Infinite Loading
│
├── Sent Invites Card
│   ├── Header
│   ├── Sent Invites Table
│   └── Pagination / Infinite Loading
│
└── Received Invites Card
    ├── Header
    ├── Received Invites Table
    └── Pagination / Infinite Loading

You may change this structure if the existing application uses a better established pattern.

Do not force three separate cards if the existing design system has a better approach.

Responsive Design

The Teams page must work properly on:

Desktop
Tablet
Mobile

Tables should not break the page layout.

If the existing project uses horizontal scrolling for tables, follow that pattern.

Do not introduce a completely different responsive strategy.

Loading States

Every section needs an appropriate loading state.

Reuse existing:

Skeleton
Spinner
Loading components

Do not create unnecessary duplicate loading components.

For infinite loading, distinguish between:

Initial loading

and:

Loading next page
Empty States

Handle empty states professionally.

Examples:

No members found.
No sent invitations.
No received invitations.

Reuse the project's existing empty-state component if available.

Error Handling

Use the existing API error-handling system.

Do not introduce a new global error-handling mechanism.

For mutation errors:

Show the existing toast/error notification.
Keep the dialog open when appropriate.
Do not reset the form if the request failed unless that matches the existing project behavior.

For query errors:

Use the existing error UI/pattern.
Dialog Behavior

Use the existing Dialog implementation.

Invite dialog:

Open
 ↓
Enter email
 ↓
Validate
 ↓
Send
 ↓
Loading state
 ↓
Success
 ↓
Close
 ↓
Invalidate Sent Invites

Cancel invite:

Click Cancel Invite
 ↓
Confirmation Dialog
 ↓
Confirm
 ↓
Loading
 ↓
Delete
 ↓
Close
 ↓
Invalidate Sent Invites

Accept/Reject can either:

Execute immediately if that matches the existing UX pattern,
or use confirmation if the project commonly confirms destructive/important actions.

Reject is destructive enough that a confirmation dialog is preferred if the existing project supports it.

Components

Break the page into logical components if that matches the project's component architecture.

For example:

TeamsPage
├── TeamsHeader
├── MembersSection
├── SentInvitesSection
├── ReceivedInvitesSection
├── InviteMemberDialog
└── CancelInviteDialog

Do not create components just for the sake of creating components.

Follow the existing project's component organization.

Types

Reuse existing DTOs/types if they already exist.

Do NOT duplicate DTO definitions.

If the API response types are missing, create appropriate frontend types in the existing DTO/type location.

Do not use any.

Keep TypeScript strict and type-safe.

API Services

Create/use the appropriate service following the existing service architecture.

Expected operations:

getInviteById(id)

getMyInvites()

getMySentInvites()

sendInvite(email, workspaceId)

deleteInvite(id)

acceptInvite(id)

rejectInvite(id)

Only implement operations actually required by the Teams page.

Do not add unrelated API methods.

Infinite Query Requirements

For all three paginated datasets:

Members
Sent Invites
Received Invites

Use TanStack Query's infinite query mechanism.

Make sure:

pageParam is handled correctly.
The backend pagination response is mapped correctly.
getNextPageParam is implemented according to the actual backend response.
Pages are flattened for rendering.
Duplicate records are not introduced.
Next-page loading is handled correctly.
No unnecessary requests are made after the final page.

Inspect the existing pagination DTO and existing useInfiniteQuery hooks before implementing.

Important Existing Backend Endpoints

Workspace Invites controller:

GET    /api/workspace-invites/{id}
GET    /api/workspace-invites/all-my-invites
GET    /api/workspace-invites/all-my-send-invites
POST   /api/workspace-invites
DELETE /api/workspace-invites/{id}
PATCH  /api/workspace-invites/{id}/accept
PATCH  /api/workspace-invites/{id}/reject

Important authorization rule:

Only Owner can send workspace invitations.

Invitation target:

Email
Do Not

Do NOT:

Introduce Redux state for server data.
Fetch data directly inside components.
Use useEffect instead of React Query.
Use normal useQuery for paginated data.
Create a separate pagination architecture.
Duplicate existing DTOs.
Duplicate existing UI components.
Add Project Manager permission for inviting.
Hardcode workspace IDs.
Hardcode user IDs.
Hardcode roles if the project already has role enums/types.
Modify unrelated pages/features.
Change the existing authentication architecture.
Change the existing API client.
Change global styling unless absolutely necessary.
Introduce a new UI library.
Introduce a new state-management library.
Implementation Process

Follow this exact process:

Step 1 — Analyze

Inspect the repository and identify:

Existing Teams-related code
Workspace APIs
Workspace member API
Invite APIs
DTOs
Services
Hooks
Query keys
Infinite query examples
Role/permission helpers
Current-user state
Dialog components
Table components
Toast/notification system
Loading/skeleton components
Empty-state components
Existing page layouts

Do not modify files during this step.

Step 2 — Plan

Create a concrete implementation plan based on the actual repository.

The plan should mention:

Files to create
Files to modify
Existing files/components to reuse
API methods required
Hooks required
Query keys
Query invalidation strategy
Permission logic
UI structure

Avoid speculative files.

Step 3 — Implement

Implement the Teams page according to the plan.

Follow the existing project's coding style.

Keep components focused.

Keep server-state logic inside React Query hooks.

Keep API communication inside services.

Step 4 — Verify

After implementation:

Run TypeScript/build checks.
Run lint if available.
Fix all TypeScript errors.
Fix all lint errors caused by the implementation.
Check query invalidation.
Check infinite pagination.
Check Owner-only invite permissions.
Check current-user You indicator.
Check dialogs.
Check responsive layout.
Acceptance Criteria

The implementation is complete only when all of the following are true:

 Teams page exists and uses the current workspace.
 All workspace members are displayed.
 Member email is displayed.
 Member role is displayed.
 Current user is visually distinguished.
 Current user has a You indicator.
 Members use infinite query pagination.
 Only Owner sees the Invite Member button.
 Invite dialog accepts an email.
 Email validation works.
 Invite request uses the correct API.
 Successful invite invalidates sent invites.
 Sent invites are displayed.
 Sent invites use infinite query pagination.
 Pending sent invites can be cancelled.
 Cancel requires confirmation dialog.
 Successful cancellation invalidates sent invites.
 Received invites are displayed.
 Received invites use infinite query pagination.
 Received invite can be accepted.
 Received invite can be rejected.
 Accept invalidates received invites.
 Accept invalidates members.
 Reject invalidates received invites.
 Appropriate success/error feedback exists.
 Loading states exist.
 Empty states exist.
 Error states exist.
 Responsive layout works.
 No unnecessary global state was introduced.
 No API calls exist directly inside components.
 No unrelated features were modified.
 TypeScript/build passes.
Final Rule

Prioritize consistency with the existing codebase over blindly following this document.

If the repository already has an established pattern for:

Infinite queries
Dialogs
Forms
Tables
Query keys
API services
Permissions
Notifications
Loading states

reuse that pattern.

Do not create a parallel architecture.

Before making architectural changes, inspect the existing implementation and adapt to it.