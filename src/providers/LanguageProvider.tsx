import type React from "react";
import { useLanguage } from "../hooks/language/useLanguage";

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = useLanguage();

  return <div>{children}</div>;
}
