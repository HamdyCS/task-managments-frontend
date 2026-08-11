import type { RouteObject } from "react-router-dom";
import { LoginPage } from "../../pages/auth/LoginPage";
import { AuthCallbackPage } from "../../pages/auth/AuthCallbackPage";
import { ForgotPasswordPage } from "../../pages/auth/ForgotPasswordPage";
import RequireGuest from "./RequireGuest";

const AuthRoutes: RouteObject[] = [
  {
    element: <RequireGuest />,
    children: [
      {
        path: "/sign-in",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
    ],
  },
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },
];

export default AuthRoutes;
