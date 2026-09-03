import type { RouteObject } from "react-router-dom";
import DashboardPage from "../../pages/dashboard/DashboardPage";
import TasksPage from "../../pages/dashboard/TasksPage";
import TeamsPage from "../../pages/dashboard/TeamsPage";
import NotificationsPage from "../../pages/dashboard/NotificationsPage";
import WorkspacesPage from "../../pages/dashboard/WorkspacesPage";
import ProjectsPage from "../../pages/dashboard/ProjectsPage";
import DashboardNotFoundPage from "../../pages/dashboard/DashboardNotFoundPage";
import DashboardAccessDeniedPage from "../../pages/dashboard/DashboardAccessDeniedPage";
import ReportsPage from "../../pages/dashboard/ReportsPage";
import DashboardLayout from "../../components/Dashboard/layout/DashboardLayout";
import NotificationProvider from "../../providers/NotificationProvider";
import RequireWorkSpaceRole from "./RequireWorkSpaceRole";

const dashboard: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <NotificationProvider>
        <DashboardLayout />
      </NotificationProvider>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "workspaces", element: <WorkspacesPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "team", element: <TeamsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "access-denied", element: <DashboardAccessDeniedPage /> },
      {
        path: "reports",
        element: <RequireWorkSpaceRole role={["Owner", "ProjectManager"]} />,
        children: [{ index: true, element: <ReportsPage /> }],
      },
      { path: "*", element: <DashboardNotFoundPage /> },
    ],
  },
];

export default dashboard;
