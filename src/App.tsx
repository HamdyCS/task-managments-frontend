import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRoutes } from "react-router-dom";
import WebSiteRoutes from "./routes/website/WebSiteRoutes";

function App() {
  const { i18n } = useTranslation();

  //handle theme and language
  useEffect(() => {
    //handle language
    const savedLang = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLang);
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLang;

    //handle theme
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
      document.documentElement.style.colorScheme = savedTheme;
    }
  }, [i18n]);

  const routes = useRoutes([
    {
      path: "/",
      children: WebSiteRoutes,
    },
  ]);

  return routes;
}

export default App;
