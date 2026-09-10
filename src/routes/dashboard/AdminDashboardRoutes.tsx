import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import AdminDashboardPage from "../../pages/dashboard/AdminDashboardPage";
import AdminUsersPage from "../../pages/dashboard/AdminUsersPage";
import AdminWorkspacesPage from "../../pages/dashboard/AdminWorkspacesPage";
import AdminDashboardLayout from "../../components/Dashboard/layout/AdminDashboardLayout";
import RequireRole from "../RequireRole";
import AccountSettingsPage from "../../pages/dashboard/AccountSettingsPage";
import AccountProfilePage from "../../pages/dashboard/account-settings/AccountProfilePage";
import AccountEmailPage from "../../pages/dashboard/account-settings/AccountEmailPage";
import AccountChangeEmailPage from "../../pages/dashboard/account-settings/AccountChangeEmailPage";
import AccountPasswordPage from "../../pages/dashboard/account-settings/AccountPasswordPage";
import AccountDangerPage from "../../pages/dashboard/account-settings/AccountDangerPage";
import DeleteAccountConfirmPage from "../../pages/dashboard/account-settings/DeleteAccountConfirmPage";
import VerifyNewEmailPage from "../../pages/dashboard/account-settings/VerifyNewEmailPage";
import UpdatePasswordPage from "../../pages/dashboard/account-settings/UpdatePasswordPage";

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
    ],
  },
];

export default adminDashboard;
