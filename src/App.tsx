import { useRoutes } from "react-router-dom";
import WebSiteRoutes from "./routes/website/WebSiteRoutes";
import AuthRoutes from "./routes/website/AuthRoutes";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      children: WebSiteRoutes,
    },
    ...AuthRoutes,
  ]);

  return routes;
}

export default App;
