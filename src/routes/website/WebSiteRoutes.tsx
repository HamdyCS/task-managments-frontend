import type { RouteObject } from "react-router-dom";
import { HomePage } from "../../pages/HomePage";
import { ProductPage } from "../../pages/ProductPage";
import { FeaturesPage } from "../../pages/FeaturesPage";
import { SolutionsPage } from "../../pages/SolutionsPage";
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
        path: "product",
        element: <ProductPage />,
      },
      {
        path: "features",
        element: <FeaturesPage />,
      },
      {
        path: "solutions",
        element: <SolutionsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

export default WebSiteRoutes;
