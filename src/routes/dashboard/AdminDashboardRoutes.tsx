import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import AdminDashboardPage from "../../pages/admin-dashboard/AdminDashboardPage";
import AdminUsersPage from "../../pages/admin-dashboard/AdminUsersPage";
import AdminWorkspacesPage from "../../pages/admin-dashboard/AdminWorkspacesPage";
import AdminDashboardLayout from "../../components/Dashboard/layout/AdminDashboardLayout";
import RequireRole from "../RequireRole";
import AccountSettingsPage from "../../pages/auth/account-settings/AccountSettingsPage";
import AccountProfilePage from "../../pages/auth/account-settings/AccountProfilePage";
import AccountEmailPage from "../../pages/auth/account-settings/AccountEmailPage";
import AccountChangeEmailPage from "../../pages/auth/account-settings/AccountChangeEmailPage";
import AccountPasswordPage from "../../pages/auth/account-settings/AccountPasswordPage";
import AccountDangerPage from "../../pages/auth/account-settings/AccountDangerPage";
import DeleteAccountConfirmPage from "../../pages/auth/account-settings/DeleteAccountConfirmPage";
import VerifyNewEmailPage from "../../pages/auth/account-settings/VerifyNewEmailPage";
import UpdatePasswordPage from "../../pages/auth/account-settings/UpdatePasswordPage";
import AdminDashboardNotFoundPage from "../../pages/admin-dashboard/AdminDashboardNotFoundPage";

const adminDashboard: RouteObject[] = [
  {
    path: "/admin/dashboard",
    element: (
      <RequireRole role="Admin">
        <AdminDashboardLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "workspaces", element: <AdminWorkspacesPage /> },
      {
        path: "account",
        element: <AccountSettingsPage basePath="/admin/dashboard/account" />,
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: "profile", element: <AccountProfilePage /> },
          { path: "email", element: <AccountEmailPage /> },
          { path: "email/change-email", element: <AccountChangeEmailPage /> },
          { path: "verify-new-email", element: <VerifyNewEmailPage /> },
          { path: "update-password", element: <UpdatePasswordPage /> },
          { path: "password", element: <AccountPasswordPage /> },
          { path: "danger", element: <AccountDangerPage /> },
          { path: "confirm-delete", element: <DeleteAccountConfirmPage /> },
        ],
      },
      {
        path: "not-found",
        element: <AdminDashboardNotFoundPage />,
      },
      {
        path: "*",
        element: <Navigate to="/admin/dashboard/not-found" replace />,
      },
    ],
  },
];

export default adminDashboard;
