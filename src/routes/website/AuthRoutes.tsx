import type { RouteObject } from "react-router-dom";
import { LoginPage } from "../../pages/auth/LoginPage";
import { RegisterPage } from "../../pages/auth/RegisterPage";
import { VerifyEmailPage } from "../../pages/auth/VerifyEmailPage";
import { ConfirmEmailPage } from "../../pages/auth/ConfirmEmailPage";
import { AuthCallbackPage } from "../../pages/auth/AuthCallbackPage";
import { ForgotPasswordPage } from "../../pages/auth/ForgotPasswordPage";
import AuthLayout from "../../layouts/AuthLayout";
import RequireGuest from "./RequireGuest";

const AuthRoutes: RouteObject[] = [
  {
    element: <RequireGuest />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/sign-in",
            element: <LoginPage />,
          },
          {
            path: "/sign-up",
            element: <RegisterPage />,
          },
          {
            path: "/verify-email",
            element: <VerifyEmailPage />,
          },
          {
            path: "/confirm-email",
            element: <ConfirmEmailPage />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },
];

export default AuthRoutes;
