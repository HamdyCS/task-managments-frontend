import type { RouteObject } from "react-router-dom";
import { HomePage } from "../../pages/HomePage";

const WebSiteRoutes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
];

export default WebSiteRoutes;
