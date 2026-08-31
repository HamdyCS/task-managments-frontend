import type { RouteObject } from "react-router-dom";
import DashboardPage from "../../pages/dashboard/DashboardPage";
import TasksPage from "../../pages/dashboard/TasksPage";
import TeamsPage from "../../pages/dashboard/TeamsPage";
import NotificationsPage from "../../pages/dashboard/NotificationsPage";
import DashboardLayout from "../../components/Dashboard/layout/DashboardLayout";
import NotificationProvider from "../../providers/NotificationProvider";

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
      { path: "tasks", element: <TasksPage /> },
      { path: "team", element: <TeamsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
    ],
  },
];

export default dashboard;
