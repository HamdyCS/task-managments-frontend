import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ThemeType } from "../../types/ThemeType";

const initialState = () => {
  var savedTheme = localStorage.getItem("theme");

  if (savedTheme === null) {
    //get theme from navigator
    const browserTheme =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    //set theme to local storage
    localStorage.setItem("theme", browserTheme);

    //apply theme to document
    if (browserTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
    return browserTheme as ThemeType;
  }

  //apply theme to document
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }

  return savedTheme as ThemeType;
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      localStorage.setItem("theme", action.payload);
      state = action.payload;
      document.documentElement.classList.toggle("dark");
      return action.payload;
    },
    toggleTheme: (state) => {
      const newTheme = state === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      state = newTheme;
      document.documentElement.classList.toggle("dark");
      return newTheme;
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
