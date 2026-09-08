import type { RouteObject } from "react-router-dom";
import AdminDashboardPage from "../../pages/dashboard/AdminDashboardPage";
import AdminDashboardLayout from "../../components/Dashboard/layout/AdminDashboardLayout";
import RequireRole from "../RequireRole";

const adminDashboard: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <RequireRole role="Admin">
        <AdminDashboardLayout />
      </RequireRole>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboardPage /> },
    ],
  },
];

export default adminDashboard;
