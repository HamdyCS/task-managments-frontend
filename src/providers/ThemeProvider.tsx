
import type React from "react";
import { useTheme } from "../hooks/theme/useTheme";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return <div>{children}</div>;
}
