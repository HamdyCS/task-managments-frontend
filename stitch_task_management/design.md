# Design Guidelines
## Product Vision
Build a premium, production-ready SaaS task management platform focused on productivity, simplicity, and team collaboration. The interface should feel fast, clean, and intuitive while maintaining a modern enterprise-grade appearance.
---
# Design Inspiration
Primary references:
- Linear
- GitHub
Avoid copying their UI directly. Instead, combine:
- Linear's simplicity
- GitHub's information density
- Modern SaaS UX patterns
---
# Brand Personality
The product should feel:
- Premium
- Modern
- Professional
- Clean
- Minimal
- Fast
- Trustworthy
Avoid playful or overly decorative designs.
---
# UX Principles
- Productivity comes first.
- Minimize clicks whenever possible.
- Every screen should have one clear primary action.
- Keep interfaces clean and distraction-free.
- Prioritize readability over visual effects.
---
# Design System
## Components
Use:
- Tailwind CSS
- shadcn/ui
- React Icons
Customize components to maintain one consistent design language.
---
## Typography
English
- Inter
Arabic
- Cairo
Use consistent font sizes and spacing throughout the application.
---
## Layout
Desktop
- Fixed top navigation
- Collapsible sidebar
- Wide content area
Tablet
- Collapsible sidebar
Mobile
- Sidebar becomes a floating drawer.
---
# Visual Style
- Soft borders
- Small shadows
- Large whitespace
- Rounded corners
- No heavy gradients
- No glassmorphism
- No unnecessary animations
---
# Motion
Animations should be subtle.
Examples:
- Hover transitions
- Button press feedback
- Drawer animation
- Modal animation
- Skeleton loading
Avoid cinematic or decorative effects.
---
# Responsive
Design for:
- Desktop
- Tablet
- Mobile
Desktop is the primary experience.
---
# Main Screens
The application should include:
- Authentication
- Dashboard
- Workspaces
- Projects
- Project Details
- Kanban Board
- Tasks
- Task Details
- Calendar
- Reports
- Notifications
- Team Members
- User Profile
- Settings
---
# Dashboard
Include:
- Welcome section
- Workspace switcher
- KPI cards
- My Tasks
- Active Projects
- Recent Activity
- Team Performance
- Charts
- Calendar Preview
- Notifications
---
# Navigation
Sidebar should contain:
- Dashboard
- Workspaces
- Projects
- Tasks
- Calendar
- Reports
- Team
- Notifications
- Settings
---
# Search
Implement global search.
Search should include:
- Tasks
- Projects
- Members
- Workspaces
---
# Command Palette
Support:
Ctrl + K
Allow quick navigation and search across the application.
---
# Tables
Tables should support:
- Search
- Sort
- Filters
- Pagination
- Bulk Actions
---
# Forms
Forms should be:
- Simple
- Clear
- Section-based when necessary
- Proper validation
- Helpful error messages
---
# Empty States
Every page should include meaningful empty states.
Each empty state should contain:
- Simple illustration or icon
- Helpful description
- Clear call-to-action button
---
# Charts
Dashboard may use:
- Line Chart
- Bar Chart
- Pie Chart
- Area Chart
Keep charts clean and readable.
---
# Icons
Use React Icons consistently.
Icons should be simple and never dominate the interface.
---
# Accessibility
Ensure:
- Proper contrast
- Keyboard navigation
- Visible focus states
- Semantic HTML
- Responsive typography
---
# Dark & Light Mode
Support both modes from the beginning.
Do not create two different interfaces.
Only colors should change.
Spacing, layout, typography, and component behavior must remain identical.
---
# Consistency Rules
Every screen must:
- Use the same spacing system
- Use the same border radius
- Follow the same typography scale
- Reuse existing components
- Maintain consistent interaction patterns
Never redesign components for individual pages.
---
# Stitch Instructions
When generating new screens:
- Maintain the existing design language.
- Never redesign previously established components.
- Prioritize usability over visual effects.
- Reuse existing layouts whenever possible.
- Keep spacing, typography, and component behavior consistent.
- Build production-ready interfaces instead of concept designs.
- Every screen should feel like part of the same professional SaaS product.---
# Component Guidelines
## Buttons
Primary
- Used for the main action on each screen.
- Only one primary button per section whenever possible.
Secondary
- Used for less important actions.
Ghost
- Used inside tables, toolbars, and navigation.
Destructive
- Reserved for delete or irreversible actions.
---
## Cards
Cards should be lightweight.
Rules:
- Soft border
- Small shadow
- Consistent padding
- Clear hierarchy
- No unnecessary decorations
---
## Dialogs
Use dialogs for:
- Confirmation
- Editing
- Creating small resources
Avoid putting long forms inside dialogs.
---
## Drawers
Use drawers for:
- Mobile navigation
- Quick editing
- Secondary information
---
## Tooltips
Only use tooltips when labels are not obvious.
Never depend on tooltips to explain critical functionality.
---
## Badges
Use badges for:
- Status
- Priority
- Role
- Labels
Keep badge colors consistent across the application.
---
## Notifications
Notifications should be informative, not distracting.
Support:
- Success
- Error
- Warning
- Information
Use toast notifications for temporary feedback.
---
# Data Visualization
Keep dashboards simple.
Every chart should answer a specific question.
Avoid decorative charts.
Display important numbers before charts.
---
# Performance
Design every page assuming:
- Hundreds of projects
- Thousands of tasks
- Large tables
- Many team members
Avoid layouts that become difficult to scan with large datasets.
---
# Future Scalability
The design system should support future modules without requiring redesign.
Possible future modules:
- Time Tracking
- Billing
- AI Assistant
- Team Chat
- Integrations
- Automation
- Audit Logs
- Organization Management
New modules must follow the same design language.
---
# Do
- Keep interfaces simple.
- Maintain consistent spacing.
- Reuse components.
- Optimize for productivity.
- Prioritize accessibility.
- Keep interactions predictable.
---
# Don't
- Don't redesign components per page.
- Don't overuse colors.
- Don't add unnecessary animations.
- Don't create visual clutter.
- Don't sacrifice usability for aesthetics.
- Don't mix multiple design styles.
---
# Final Goal
Every screen should feel like it belongs to the same premium SaaS application.
Users should immediately feel that the product is:
- Professional
- Fast
- Reliable
- Modern
- Easy to learn
- Comfortable to use for long working sessions