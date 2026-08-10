import { useRoutes } from "react-router-dom";
import WebSiteRoutes from "./routes/website/WebSiteRoutes";
import AuthRoutes from "./routes/website/AuthRoutes";
import AuthProvider from "./providers/AuthProvider";
import LanguageProvider from "./providers/LanguageProvider";
import ThemeProvider from "./providers/ThemeProvider";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      children: WebSiteRoutes,
    },
    ...AuthRoutes,
  ]);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>{routes}</AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
