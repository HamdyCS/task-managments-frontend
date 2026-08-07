import type { RouteObject } from "react-router-dom";
import { HomePage } from "../../pages/HomePage";
import { NotFoundPage } from "../../pages/NotFoundPage";
import WebSiteLayout from "../../components/website/layout/WebSiteLayout";

const WebSiteRoutes: RouteObject[] = [
  {
    path: "/",
    element: <WebSiteLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

export default WebSiteRoutes;
