import type { RouteObject } from "react-router-dom";
import DashboardPage from "../../pages/dashboard/DashboardPage";
import NotificationsPage from "../../pages/dashboard/NotificationsPage";
import DashboardLayout from "../../components/Dashboard/layout/DashboardLayout";
import RequireRole from "../RequireRole";

const dashboard: RouteObject[] = [
  {
    element: <RequireRole role="User" />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "notifications", element: <NotificationsPage /> },
        ],
      },
    ],
  },
];

export default dashboard;
