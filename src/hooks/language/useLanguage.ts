import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LanguageType } from "../../types/LanguageType";

export function useLanguage() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<LanguageType>(() => {
    //get language from local storage or navigator
    const savedLang = localStorage.getItem("language");

    //if savedLang is null then get language from navigator
    if (savedLang === null) {
      const browserLang =
        navigator.language.split("-")[0] === "ar" ? "ar" : "en";
      localStorage.setItem("language", browserLang);
      return browserLang as LanguageType;
    }

    return savedLang as LanguageType;
  });

  useEffect(() => {
    //handle language
    i18n.changeLanguage(language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    localStorage.setItem("language", language);
  }, [language]);

  const changeLanguage = (newLanguage: LanguageType) =>
    setLanguage(newLanguage);

  return { language, changeLanguage };
}
