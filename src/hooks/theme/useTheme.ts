import { useEffect, useState } from "react";
import type { ThemeType } from "../../types/ThemeType";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === null) {
      //get theme from navigator
      const browserTheme =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

      //set theme to local storage
      localStorage.setItem("theme", browserTheme);
      return browserTheme as ThemeType;
    }

    return savedTheme as ThemeType;
  });

  useEffect(() => {
    //handle theme
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((current: ThemeType) => (current === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}
