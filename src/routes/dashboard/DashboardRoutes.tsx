import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import DashboardPage from "../../pages/dashboard/DashboardPage";
import TasksPage from "../../pages/dashboard/TasksPage";
import TeamsPage from "../../pages/dashboard/TeamsPage";
import NotificationsPage from "../../pages/dashboard/NotificationsPage";
import WorkspacesPage from "../../pages/dashboard/WorkspacesPage";
import ProjectsPage from "../../pages/dashboard/ProjectsPage";
import AccountSettingsPage from "../../pages/dashboard/AccountSettingsPage";
import AccountProfilePage from "../../pages/dashboard/account-settings/AccountProfilePage";
import AccountEmailPage from "../../pages/dashboard/account-settings/AccountEmailPage";
import AccountChangeEmailPage from "../../pages/dashboard/account-settings/AccountChangeEmailPage";
import AccountPasswordPage from "../../pages/dashboard/account-settings/AccountPasswordPage";
import AccountDangerPage from "../../pages/dashboard/account-settings/AccountDangerPage";
import DeleteAccountConfirmPage from "../../pages/dashboard/account-settings/DeleteAccountConfirmPage";
import VerifyNewEmailPage from "../../pages/dashboard/account-settings/VerifyNewEmailPage";
import UpdatePasswordPage from "../../pages/dashboard/account-settings/UpdatePasswordPage";
import DashboardNotFoundPage from "../../pages/dashboard/DashboardNotFoundPage";
import DashboardAccessDeniedPage from "../../pages/dashboard/DashboardAccessDeniedPage";
import ReportsPage from "../../pages/dashboard/ReportsPage";
import DashboardLayout from "../../components/Dashboard/layout/DashboardLayout";
import NotificationProvider from "../../providers/NotificationProvider";
import RequireWorkSpaceRole from "./RequireWorkSpaceRole";
import RequireRole from "../RequireRole";

const dashboard: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <RequireRole role={"User"}>
        <NotificationProvider>
          <DashboardLayout />
        </NotificationProvider>
      </RequireRole>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "workspaces", element: <WorkspacesPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "team", element: <TeamsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      {
        path: "account",
        element: <AccountSettingsPage basePath="/dashboard/account" />,
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
