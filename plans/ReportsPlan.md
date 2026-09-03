Implement the Reports page for the Workspace Dashboard.

IMPORTANT:
- Before writing code, inspect the existing frontend project structure and identify the existing patterns used for:
  - Pages
  - Components
  - Custom hooks
  - TanStack React Query
  - API services
  - DTOs/types
  - Routing
  - Permissions/roles
  - Loading/skeleton states
  - Error states
  - Empty states
  - Tables
  - Dialogs
  - Responsive layouts
  - RTL/LTR handling
  - Translations/i18n
- Follow the existing project conventions instead of introducing a new architecture.
- Do NOT put the entire implementation inside ReportsPage.tsx.
- Keep the page modular and split responsibilities into reusable components.
- Do NOT modify unrelated pages/components.
- Do NOT add backend changes.
- Do NOT add date filters because the current backend APIs do not support them.
- Admin Dashboard is OUT OF SCOPE. This page is only for Workspace Dashboard users.

==================================================
1. ACCESS / PERMISSIONS
==================================================

Reports page is available only to:

- Owner
- ProjectManager

Workspace Members must not see the Reports page.

If an unauthorized user somehow navigates directly to the Reports route, use the existing AccessDenied component/pattern already available in the project.

Do not create a new AccessDenied implementation if one already exists.

Do not add Admin-specific logic to this page.

==================================================
2. PAGE
==================================================

Create:

ReportsPage.tsx

ReportsPage should act mainly as an orchestrator.

It should NOT contain:
- API calls
- Large amounts of JSX
- React Query implementation
- Chart configuration
- Table implementation
- Complex business logic

Suggested responsibility:

ReportsPage
  ├── authorization/access handling
  ├── URL/query-param state
  ├── ReportsHeader
  ├── ReportsTabs
  └── render the selected tab

Suggested structure:

reports/
├── ReportsPage.tsx
├── components/
│   ├── ReportsHeader.tsx
│   ├── ReportsTabs.tsx
│   │
│   ├── overview/
│   │   ├── OverviewTab.tsx
│   │   ├── WorkspaceStats.tsx
│   │   ├── TaskStatusChart.tsx
│   │   ├── TaskPriorityChart.tsx
│   │   └── MemberPerformanceTable.tsx
│   │
│   ├── projects/
│   │   ├── ProjectsTab.tsx
│   │   ├── ProjectSelector.tsx
│   │   ├── ProjectTaskStatusChart.tsx
│   │   ├── ProjectTaskPriorityChart.tsx
│   │   └── ProjectMemberPerformanceTable.tsx
│   │
│   └── members/
│       ├── MembersTab.tsx
│       ├── MemberSelector.tsx
│       └── MemberPerformanceCard.tsx
│
├── hooks/
│   └── useReports.ts
├── services/
│   └── reportsService.ts
└── dtos/
    ├── WorkSpaceReportDto.ts
    ├── MemberPerformanceDto.ts
    └── ReportDtos.ts

IMPORTANT:
The exact folder names may be adjusted to match the existing project structure.
Do not blindly create duplicate folders if an existing reports structure already exists.

==================================================
3. ARCHITECTURE
==================================================

Follow the existing frontend pattern:

Component
    ↓
Custom Hook
    ↓
TanStack React Query
    ↓
Service
    ↓
API

Components should not directly call Axios/API services.

Do not put Axios requests inside components.

Create/use appropriate React Query hooks for each report query.

Use the project's existing Axios instance/configuration/interceptors.

Do not create another Axios instance.

==================================================
4. REPORTS TABS
==================================================

The Reports page contains:

1. Overview
2. Projects
3. Members

Use tabs rather than a single long page.

The selected tab must be synchronized with URL search params.

Examples:

/reports?tab=overview

/reports?tab=projects&projectId=5

/reports?tab=members&memberId=abc123

Use React Router's existing useSearchParams pattern.

Do not introduce Redux state for tab selection.

==================================================
5. URL BEHAVIOR
==================================================

If there is no tab:

/reports

default to:

/reports?tab=overview

If:

tab=projects

but there is no projectId:

1. Fetch available workspace projects using the existing projects API/pattern.
2. If projects exist, automatically select the first project.
3. Update the URL:

/reports?tab=projects&projectId=<firstProjectId>

If there are no projects:
- Do not call project-specific report APIs.
- Show an appropriate empty state.

If:

tab=members

but there is no memberId:

1. Fetch workspace users/members using the existing API.
2. If members exist, automatically select the first member.
3. Update URL:

/reports?tab=members&memberId=<firstMemberId>

If there are no members:
- Do not call member-specific performance APIs.
- Show an appropriate empty state.

If an invalid projectId/memberId exists in the URL:
- Follow the project's existing validation/navigation pattern.
- Do not leave the page in a broken state.
- Prefer falling back to the first valid item when appropriate.

Changing the selected project/member must update the URL.

==================================================
6. OVERVIEW TAB
==================================================

Overview is the main workspace-level report.

API:

GET
/api/workspaces/{workSpaceId}/reports

This returns:

WorkSpaceReportDto

Use the workspace ID according to the existing project/workspace routing/state pattern.

DTO:

interface WorkSpaceReportDto {
  workSpaceName: string;
  ownerNames: string[];

  totalProjects: number;
  totalMembers: number;
  totalTasks: number;

  totalBacklogTasks: number;
  totalTodoTasks: number;
  totalInProgressTasks: number;
  totalReviewTasks: number;
  totalDoneTasks: number;

  memberPerformances: MemberPerformanceDto[];
}

MemberPerformanceDto:

interface MemberPerformanceDto {
  id: string;
  name: string;
  assignedCount: number;
  inProgressCount: number;
  doneCount: number;
  completionPercentage: number;
}

==================================================
7. OVERVIEW HEADER
==================================================

Create:

ReportsHeader

Show:
- Reports title
- Workspace report context/name when available
- Download button

Button label:

Download Workspace Report

Use react-icons.

Preferred icon:

FiDownload

The download button must always be visible to users who can access this page.

API:

GET
/api/workspaces/{workSpaceId}/reports/pdf/download

Expected response:

application/pdf

Filename:

workspace-report.pdf

Implement the download according to the existing frontend file-download pattern.

Do not open the PDF in a new browser tab intentionally.

The user should receive a file download.

Do not use a hardcoded blob URL or fake data.

Handle loading state while downloading if the existing project pattern supports it.

==================================================
8. OVERVIEW STATISTICS
==================================================

Create:

WorkspaceStats

Display useful summary cards based on WorkSpaceReportDto.

At minimum:

- Total Projects
- Total Members
- Total Tasks
- Completed Tasks

For Completed Tasks, use:

totalDoneTasks

Also display completion percentage where appropriate.

The backend now provides completionPercentage where available.

Do not recalculate it unnecessarily in the frontend.

Follow the existing project's Card/stat component style if available.

Do not create an entirely new design system.

==================================================
9. OVERVIEW CHARTS
==================================================

Use the existing chart library:

Chart.js
react-chartjs-2

Do NOT introduce another chart library.

Create two separate chart components.

--------------------------------------------------
Task Status
--------------------------------------------------

Component:

TaskStatusChart

Use a Donut/Doughnut chart.

Data:

Backlog
Todo
In Progress
Review
Done

Use:

totalBacklogTasks
totalTodoTasks
totalInProgressTasks
totalReviewTasks
totalDoneTasks

Make labels translation-ready.

Do not hardcode English strings if the project uses i18n.

--------------------------------------------------
Task Priority
--------------------------------------------------

Component:

TaskPriorityChart

Use a Bar chart.

The Overview workspace report does not currently return task priority counts.

Therefore:

DO NOT invent priority data.

If the existing workspace report API does not provide workspace-level priority breakdown, do not create fake workspace priority data.

Use the project-specific priority API only inside the Projects tab.

If the existing backend has another workspace priority endpoint already implemented in the project, inspect and use it only if it is actually available.

Otherwise the Overview should contain the Workspace Status chart and other available workspace-level information without fabricated priority values.

==================================================
10. OVERVIEW MEMBER PERFORMANCE
==================================================

Create:

MemberPerformanceTable

Display:

- Member
- Assigned
- In Progress
- Done
- Completion %

Use:

memberPerformances

Example:

Member | Assigned | In Progress | Done | Completion
John   | 12       | 3           | 7    | 58%

Completion percentage should use:

completionPercentage

Add a visual progress indicator/bar for Completion %.

Follow the existing table component/style.

The table must be responsive.

Do not create a completely separate desktop/mobile table unless the existing project pattern requires it.

==================================================
11. PROJECTS TAB
==================================================

Create:

ProjectsTab

The Projects tab should allow selecting a project.

Use an existing workspace/project API to get available projects.

Create:

ProjectSelector

The selected project must be synchronized with:

projectId

in the URL.

After selecting a project:

Load:

GET
/api/workspaces/{workSpaceId}/reports/projects/{projectId}/tasks-by-status

GET
/api/workspaces/{workSpaceId}/reports/projects/{projectId}/tasks-by-priority

Use the exact existing backend route/service configuration if it differs in the current project.

Do not guess API paths if an existing service/controller contract can be inspected.

==================================================
12. PROJECT TASK STATUS
==================================================

Create:

ProjectTaskStatusChart

Use:

Doughnut/Donut chart.

Response format:

[
  {
    taskStatus: "Backlog",
    count: 4
  },
  {
    taskStatus: "Done",
    count: 2
  }
]

Support all existing TaskStatus values.

Do not assume the API always returns every status.

Missing statuses should be handled safely.

==================================================
13. PROJECT TASK PRIORITY
==================================================

Create:

ProjectTaskPriorityChart

Use:

Bar chart.

Response:

[
  {
    taskPriority: "Low",
    count: 3
  },
  {
    taskPriority: "Critical",
    count: 1
  }
]

Support all existing TaskPriority values.

Do not assume every priority is returned.

==================================================
14. PROJECT MEMBER PERFORMANCE
==================================================

The project performance API is:

GET
/api/workspaces/{workSpaceId}/reports/projects/{projectId}/members/{memberId}/performance

The workspace users API already exists.

Use the existing Workspace Users API to get workspace members.

Display the project member performance as a table.

Important:

Not every workspace user must belong to the selected project.

If a workspace user does not have performance data for the selected project:
- do not fabricate values
- handle the absence gracefully
- an empty state is acceptable

Use:

- Member
- Assigned
- In Progress
- Done
- Completion %

Do not make unnecessary requests for users who are not relevant if the existing project data can determine project membership.

If the existing API only allows fetching performance one member at a time, follow that contract and use the existing project/workspace member data appropriately.

Avoid an uncontrolled request waterfall.

==================================================
15. MEMBERS TAB
==================================================

Create:

MembersTab

Use the existing Workspace Users API.

Display members in a table/list.

Create:

MemberSelector

The selected member must be synchronized with:

memberId

in URL.

Once a member is selected, load:

GET
/api/workspaces/{workSpaceId}/reports/members/{memberId}/performance

Use:

MemberPerformanceCard

or an equivalent focused component.

Display:

- Assigned
- In Progress
- Done
- Completion %

Also display the member name.

Use the backend's:

completionPercentage

for the progress visualization.

==================================================
16. TANSTACK REACT QUERY
==================================================

Use TanStack React Query.

Create query hooks according to the project's existing hook conventions.

Suggested hooks:

useWorkspaceReport(workspaceId)

useWorkspaceProjects(workspaceId)

useProjectTasksByStatus(workspaceId, projectId)

useProjectTasksByPriority(workspaceId, projectId)

useProjectMemberPerformance(workspaceId, projectId, memberId)

useWorkspaceMembers(workspaceId)

useMemberPerformance(workspaceId, memberId)

Follow existing naming conventions if the project uses different names.

==================================================
17. QUERY ENABLE CONDITIONS
==================================================

Do not execute queries until their required IDs are available.

Examples:

Workspace report:

enabled: !!workspaceId

Project reports:

enabled: !!workspaceId && !!projectId

Member performance:

enabled: !!workspaceId && !!memberId

Do not send undefined/null IDs to the API.

==================================================
18. QUERY KEYS
==================================================

Use stable query keys.

Suggested:

["workspace-report", workspaceId]

["workspace-projects", workspaceId]

["project-tasks-by-status", workspaceId, projectId]

["project-tasks-by-priority", workspaceId, projectId]

["project-member-performance", workspaceId, projectId, memberId]

["workspace-members", workspaceId]

["member-performance", workspaceId, memberId]

Follow the existing project's query-key naming convention if one already exists.

==================================================
19. REDIS / BACKEND CACHE
==================================================

Backend caches report queries for 10 minutes.

Do not implement a second custom frontend caching layer.

Use TanStack Query normally.

Avoid unnecessary refetches.

Follow the project's existing staleTime/cache configuration where appropriate.

Do not hardcode assumptions about Redis behavior in the frontend.

==================================================
20. LOADING STATES
==================================================

Follow existing dashboard loading patterns.

Use skeletons where appropriate.

Do not show a completely blank page while reports load.

Create reusable loading components if necessary, but reuse existing Skeleton components whenever available.

Examples:

Overview:
- Stats skeleton
- Chart skeleton
- Table skeleton

Projects:
- Project selector skeleton
- Chart skeleton
- Table skeleton

Members:
- Member list/selector skeleton
- Performance skeleton

==================================================
21. ERROR STATES
==================================================

Follow the existing project's API error handling.

Each report section should handle errors gracefully.

Do not allow one failed query to crash the entire Reports page.

For example:

Workspace report failure:
- Show appropriate error state for Overview.

Project status API failure:
- Status chart shows error state.
- Priority chart can still work if its API succeeds.

Member performance failure:
- Show appropriate error state for that section.

Reuse existing error components where available.

==================================================
22. EMPTY STATES
==================================================

Handle:

- Workspace with no projects
- Workspace with no members
- Project with no tasks
- Project with no members/performance data
- Member with no assigned tasks
- Empty chart data

Do not render broken charts with undefined/invalid datasets.

Use existing EmptyState components if available.

==================================================
23. RESPONSIVE DESIGN
==================================================

The Reports page must be fully responsive.

Support:

- Desktop
- Tablet
- Mobile

Desktop:

Stats should use a grid.

Charts should appear side-by-side where space allows.

Performance table should fit naturally.

Mobile:

Stats should stack.

Charts should stack vertically.

Tables should remain usable without breaking the layout.

Follow the existing project's responsive Tailwind patterns.

Do not use fixed widths that cause horizontal page overflow.

==================================================
24. RTL / LTR
==================================================

The page must work correctly in both:

RTL
LTR

The project already supports localization/i18n.

Follow the existing direction handling.

Do not hardcode:

- left/right positioning
- text alignment
- margins/paddings that break RTL
- chart text positioning that assumes LTR

Prefer logical layout utilities/patterns already used by the project.

All user-facing text must be translation-ready.

==================================================
25. INTERNATIONALIZATION
==================================================

Use the project's existing:

react-i18next

pattern.

Add translation keys for:

Reports
Overview
Projects
Members
Total Projects
Total Members
Total Tasks
Completed Tasks
Backlog
Todo
In Progress
Review
Done
Low
Medium
High
Critical
Assigned
Completion
Download Workspace Report
Select Project
Select Member
No Projects
No Members
No Tasks
No Performance Data
etc.

Do not hardcode user-facing English strings inside components if the project uses translations.

Follow the existing translation file structure.

==================================================
26. ACCESSIBILITY
==================================================

Use semantic buttons for actions.

The Download Workspace Report control must be a button if it triggers an API request.

Selectors should have accessible labels.

Charts should have meaningful surrounding labels/titles.

Do not rely only on color to communicate task status or priority.

==================================================
27. ICONS
==================================================

Use:

react-icons

for icons.

Do not add another icon library.

Use icons consistently with the rest of the dashboard.

==================================================
28. STYLING
==================================================

Keep the existing WorkPilot visual language:

- Clean
- Minimal
- SaaS dashboard
- Professional
- Consistent with the existing Workspace Dashboard

Do not redesign the entire dashboard.

Reuse:
- existing cards
- buttons
- tables
- typography
- spacing
- shadows
- borders
- colors
- dark/light mode behavior

where available.

Reports should feel like a native part of the existing dashboard.

==================================================
29. PERFORMANCE
==================================================

Avoid unnecessary API calls.

Examples:

- Do not fetch project reports before projectId exists.
- Do not fetch member performance before memberId exists.
- Do not fetch project performance for irrelevant users if avoidable.
- Do not refetch workspace report on every tab change unnecessarily.

Use React Query caching.

Avoid expensive calculations inside render.

==================================================
30. DOWNLOAD WORKSPACE REPORT
==================================================

Implement:

Download Workspace Report

using:

GET
/api/workspaces/{workSpaceId}/reports/pdf/download

Expected response:

application/pdf

Filename:

workspace-report.pdf

Follow the existing project's API/file-download conventions.

Important:
- It must download the file.
- It must not intentionally navigate the current page to the PDF.
- It must not open a new tab.
- Properly handle API errors.
- Show a loading/disabled state while downloading if consistent with the existing UI patterns.
- Use the existing Axios/service layer.

==================================================
31. COMPONENT RESPONSIBILITIES
==================================================

ReportsPage:
- URL state
- selected tab
- high-level orchestration only

ReportsHeader:
- title
- workspace context
- download button

ReportsTabs:
- tab navigation
- URL synchronization

OverviewTab:
- compose overview sections

WorkspaceStats:
- statistics cards only

TaskStatusChart:
- workspace status chart only

TaskPriorityChart:
- only if a real workspace-level priority API exists
- never fabricate data

MemberPerformanceTable:
- workspace member performance table

ProjectsTab:
- project selection
- compose project report sections

ProjectSelector:
- project selection only

ProjectTaskStatusChart:
- project status chart

ProjectTaskPriorityChart:
- project priority chart

ProjectMemberPerformanceTable:
- project member performance

MembersTab:
- member selection/list
- compose performance section

MemberSelector:
- member selection

MemberPerformanceCard:
- selected member's performance

Services:
- API requests only

Hooks:
- React Query and query state

DTOs:
- API response types only

==================================================
32. IMPORTANT IMPLEMENTATION RULES
==================================================

DO NOT:

- Put API calls directly in components.
- Put all JSX inside ReportsPage.
- Create a huge useReports hook containing unrelated queries if the existing project convention favors smaller hooks.
- Add Redux state for server state.
- Add another API client.
- Add another chart library.
- Add another icon library.
- Add date filtering.
- Add Admin Dashboard behavior.
- Fabricate workspace priority data.
- Hardcode API responses.
- Hardcode fake members/projects.
- Ignore existing project conventions.
- Rewrite unrelated code.
- Change backend APIs.
- Create unnecessary abstractions.

DO:

- Inspect the repository first.
- Reuse existing components.
- Reuse existing API/service patterns.
- Reuse existing React Query patterns.
- Reuse existing permission patterns.
- Reuse existing translation patterns.
- Reuse existing responsive Tailwind patterns.
- Keep components small and focused.
- Make the page responsive.
- Support RTL/LTR.
- Keep URL state synchronized.
- Handle loading/error/empty states.
- Use real API data only.

==================================================
33. IMPLEMENTATION ORDER
==================================================

Implement in this order:

1. Inspect existing project architecture and related dashboard pages.

2. Inspect:
   - workspace APIs
   - project APIs
   - workspace users API
   - existing permission/role helpers
   - existing AccessDenied component
   - existing tables
   - existing cards
   - existing charts
   - existing download/file handling
   - existing translation files

3. Create Reports DTOs/types.

4. Create Reports service methods.

5. Create React Query hooks.

6. Create ReportsPage routing/access behavior.

7. Implement ReportsHeader.

8. Implement ReportsTabs and URL synchronization.

9. Implement Overview.

10. Implement Projects tab.

11. Implement Members tab.

12. Implement PDF download.

13. Add loading states.

14. Add error states.

15. Add empty states.

16. Add translations.

17. Verify RTL/LTR.

18. Verify responsive behavior.

19. Verify TypeScript errors.

20. Verify ESLint/build.

==================================================
34. ACCEPTANCE CRITERIA
==================================================

The implementation is complete only if:

[ ] Owner can open Reports.

[ ] ProjectManager can open Reports.

[ ] Member receives AccessDenied.

[ ] Admin logic is not added to this Workspace Dashboard.

[ ] Reports has Overview / Projects / Members tabs.

[ ] Tab state is stored in URL.

[ ] Project selection is stored in projectId query parameter.

[ ] Member selection is stored in memberId query parameter.

[ ] First project is automatically selected when Projects tab has no projectId.

[ ] First member is automatically selected when Members tab has no memberId.

[ ] Overview loads the workspace report from the backend.

[ ] Overview displays workspace statistics.

[ ] Overview displays task status as a Doughnut chart.

[ ] Overview displays workspace member performance.

[ ] Member performance displays completion percentage.

[ ] Completion percentage has a visual progress indicator.

[ ] Projects tab supports project selection.

[ ] Project status is displayed as a Doughnut chart.

[ ] Project priority is displayed as a Bar chart.

[ ] Project member performance is displayed as a table.

[ ] Members tab displays workspace members.

[ ] Members tab displays selected member performance.

[ ] PDF can be downloaded using "Download Workspace Report".

[ ] PDF download does not navigate to a PDF page.

[ ] All API calls go through the service layer.

[ ] Server state uses TanStack React Query.

[ ] Queries are properly enabled only when required IDs exist.

[ ] Loading states exist.

[ ] Error states exist.

[ ] Empty states exist.

[ ] Page works on mobile.

[ ] Page works on tablet.

[ ] Page works on desktop.

[ ] RTL works.

[ ] LTR works.

[ ] All user-facing strings are translation-ready.

[ ] react-icons is used for icons.

[ ] Chart.js/react-chartjs-2 is used for charts.

[ ] No new chart/icon libraries are introduced.

[ ] ReportsPage is not a giant component.

[ ] Components have focused responsibilities.

[ ] No unrelated files/features were modified.

[ ] TypeScript passes.

[ ] ESLint passes.

[ ] Production build passes.

==================================================
35. FINAL INSTRUCTION
==================================================

Before implementing anything, inspect the existing repository and adapt this plan to the actual project structure.

If an existing component/service/hook already solves part of the problem, reuse it instead of creating a duplicate.

Do not make assumptions when an existing implementation can be inspected.

After implementation, provide a concise summary containing:
- Files created
- Files modified
- APIs integrated
- Main components created
- Any deviations from this plan and why
- TypeScript/build/lint status