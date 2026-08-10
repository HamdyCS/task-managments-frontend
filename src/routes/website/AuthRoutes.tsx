import type { RouteObject } from "react-router-dom";
import { LoginPage } from "../../pages/auth/LoginPage";

const AuthRoutes: RouteObject[] = [
  {
    path: "/sign-in",
    element: <LoginPage />,
  },
];

export default AuthRoutes;
