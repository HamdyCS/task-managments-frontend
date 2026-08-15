Design a modern, premium Notifications page for the existing **WorkPilot SaaS task management dashboard**.

### Design Context

The existing dashboard uses a clean, minimal SaaS style similar to Linear / modern productivity platforms.

Keep the Notifications page visually consistent with the existing WorkPilot dashboard:

* Same sidebar
* Same top header
* Same typography
* Same spacing system
* Same border radius
* Same card style
* Same visual hierarchy
* Support both Light Mode and Dark Mode
* Do not introduce a completely new visual language

The page should feel clean, professional, lightweight, and production-ready.

---

## Page Structure

### 1. Page Header

At the top of the main content area:

**Title:**
Notifications

**Subtitle:**
Stay up to date with activity across your workspaces.

On the right side:

* `Mark all as read` button
* Optional small settings/more button

The `Mark all as read` action should only appear enabled when there are unread notifications.

---

## 2. Notification Filters

Under the page header, create a compact segmented filter:

* All
* Unread

Show the unread count next to `Unread`.

Example:

`All    Unread 3`

The selected filter should have a subtle highlighted background.

Do not make the filter visually heavy.

---

## 3. Notification List

Display notifications in a vertical list.

Each notification should be a clean horizontal notification item/card.

Each item contains:

* Notification type icon
* Title
* Message
* Relative timestamp
* Optional unread indicator
* Optional contextual action

Example:

[icon] Task assigned to you
You have been assigned to "Implement authentication".
10 minutes ago                                      •

Unread notifications should have:

* Slightly different background
* Small unread dot
* Stronger title typography

Read notifications should look more subtle.

Avoid excessive colors.

---

## 4. Modern Read / Unread Interaction

Do NOT use a checkbox for every notification.

Use a more modern SaaS notification interaction:

### Primary behavior

The entire notification item should be clickable.

When the user clicks an unread notification:

1. Mark the notification as `read`
2. Remove the unread indicator
3. Navigate to the relevant destination

Examples:

* TaskAssigned → navigate to the related task
* TaskUpdated → navigate to the related task
* TaskStatusUpdated → navigate to the related task
* CommentAdded → navigate to the related task/comment
* TaskDeleted → show the notification without navigating to a deleted task
* WorkSpaceInvite → navigate to workspace invitation/details
* DueDateReminder → navigate to the related task

The UI should visually update immediately after clicking.

Use an optimistic UI interaction so the notification feels instantly marked as read.

---

## 5. Per-Notification Actions

Each notification should have a subtle `...` menu that appears on hover.

Menu options:

For unread notification:

* Mark as read

For read notification:

* Mark as unread

Optional:

* Delete notification

Do not make these actions visually dominant.

The main notification remains clickable.

---

## 6. Workspace Invite Notifications

For `WorkSpaceInvite`, design a slightly different notification layout because it represents an actionable event.

Example:

Workspace Invitation

You have been invited to join "Admin Work Space".

2 hours ago

Actions:

`Accept`   `Decline`

Keep these buttons compact and consistent with the WorkPilot design.

Do not force the user to open another page just to understand that an invitation exists.

---

## 7. Notification Type Icons

Use consistent icons for different notification types.

Map the following notification types:

* TaskAssigned → User/assignment icon
* TaskUnassigned → User minus icon
* TaskStatusUpdated → Activity/status icon
* TaskUpdated → Edit icon
* CommentAdded → Message/comment icon
* DueDateReminder → Calendar/clock icon
* TaskDeleted → Trash icon
* WorkSpaceInvite → Users/invite icon

Use subtle icon containers rather than large colorful illustrations.

The icon color should communicate the category without overwhelming the UI.

---

## 8. Notification Data Model

The UI should be designed around this frontend model:

```ts
export interface Notification {
  id: number;
  notifyToId: string;
  taskId: number | null;
  workSpaceInviteId: number | null;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  readAt: string | null;
  notificationType: NotificationType;
}

export type NotificationType =
  | "TaskAssigned"
  | "TaskUnassigned"
  | "TaskStatusUpdated"
  | "TaskUpdated"
  | "CommentAdded"
  | "DueDateReminder"
  | "TaskDeleted"
  | "WorkSpaceInvite";
```

Use realistic sample data covering all notification types.

---

## 9. Empty States

Create proper empty states.

### No notifications

Show:

* Simple notification/bell illustration or icon
* "You're all caught up"
* "You don't have any notifications yet."

### No unread notifications

When the user selects `Unread` and there are no unread notifications:

* "You're all caught up"
* "There are no unread notifications."

Keep the empty state minimal and premium.

---

## 10. Loading State

Create a skeleton loading state for the notification list.

Use approximately 5 notification skeleton rows.

The skeleton should match the actual notification layout.

Do not use a generic full-page spinner.

---

## 11. Responsive Design

Desktop:

* Keep the notification content within a comfortable readable width.
* Do not stretch notification cards across the entire screen unnecessarily.
* Preserve the existing WorkPilot sidebar and header.

Tablet:

* Reduce horizontal spacing.
* Keep notification actions accessible.

Mobile:

* Hide unnecessary secondary information.
* Make the entire notification row easy to tap.
* Move `Mark all as read` into a compact action/menu if necessary.
* Keep notification actions touch-friendly.

---

## 12. Dark Mode

The page must work perfectly in both Light Mode and Dark Mode.

Do not simply invert the colors.

Use proper semantic surfaces:

* Page background
* Notification surface
* Hover surface
* Unread surface
* Borders
* Primary text
* Secondary text
* Muted text
* Icon containers

Unread notifications should remain distinguishable in Dark Mode without using excessively bright colors.

---

## 13. Header Notification Bell Integration

Keep the existing notification bell in the WorkPilot header.

When there are unread notifications:

* Show a small red unread badge/dot on the bell.
* Clicking the bell should open a compact notification preview/popover.
* The popover should show the latest few notifications.
* Include `View all notifications` at the bottom.
* The full Notifications page is the destination for managing all notifications.

The unread count should be visually clear but not distracting.

---

## 14. Interaction Details

Design the following states:

1. Read notification
2. Unread notification
3. Hovered notification
4. Notification with contextual action
5. Notification `...` menu open
6. Mark as read interaction
7. Mark as unread interaction
8. Mark all as read interaction
9. Empty notifications state
10. Empty unread state
11. Loading skeleton
12. Workspace invitation notification

Use subtle transitions and hover states.

Avoid excessive animations.

---

## Visual Direction

The final design should feel:

* Premium
* Modern
* Minimal
* Professional
* SaaS-oriented
* Similar in quality to Linear, Notion, Vercel, or modern project management dashboards

Avoid:

* Large colorful notification cards
* Excessive gradients
* Giant illustrations
* Checkbox-heavy layouts
* Excessive shadows
* Excessive rounded pills
* Overly colorful notification rows

The primary focus should be **readability, hierarchy, quick scanning, and fast interaction**.

Generate the complete Notifications page as a production-ready dashboard screen that visually belongs to the existing WorkPilot application.
