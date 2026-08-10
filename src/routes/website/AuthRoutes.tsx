import type { RouteObject } from "react-router-dom";
import { LoginPage } from "../../pages/auth/LoginPage";
import { AuthCallbackPage } from "../../pages/auth/AuthCallbackPage";
import RequireGuest from "./RequireGuest";

const AuthRoutes: RouteObject[] = [
  {
    element: <RequireGuest />,
    children: [
      {
        path: "/sign-in",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },
];

export default AuthRoutes;
