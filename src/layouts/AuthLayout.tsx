import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiSun, FiMoon, FiGlobe } from "react-icons/fi";
import { MdCheck } from "react-icons/md";
import { slideInLeft, slideInRight } from "../animations";
import { useLanguage } from "../hooks/language/useLanguage";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleTheme } from "../store/theme/theme";

const featureGridItemTitle: string[] = [
  "login.features.projects",
  "login.features.collaboration",
  "login.features.analytics",
];

export default function AuthLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const { language, changeLanguage } = useLanguage();

  const isAr = language === "ar";
  const toggleLanguage = () => changeLanguage(isAr ? "en" : "ar");

  return (
    <div className="min-h-screen flex text-foreground overflow-hidden relative bg-background">
      <div className="ambient-glow top-0 left-0 -translate-x-1/2 -translate-y-1/2 md:hidden" />

      {/* Right Side: Auth Form Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 relative z-10 bg-transparent">
        <div className="md:hidden mb-8 flex items-center justify-center w-full">
          <div className="h-10 text-2xl font-bold text-primary">WorkPilot</div>
        </div>

        <motion.div
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[420px] rounded-lg p-8 relative z-10 glass-panel"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-end mb-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground transition-colors h-10 w-10 rounded-xl hover:bg-accent inline-flex items-center justify-center"
                aria-label={t("login.back")}
              >
                {isAr ? (
                  <FiArrowRight className="w-5 h-5" />
                ) : (
                  <FiArrowLeft className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-end gap-1 mb-4">
              <button
                type="button"
                onClick={toggleLanguage}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors h-9 px-2.5 rounded-lg hover:bg-accent inline-flex items-center gap-1.5"
                aria-label="Toggle language"
              >
                <FiGlobe className="w-4 h-4" />
                {isAr ? "EN" : "عربي"}
              </button>
              <button
                type="button"
                onClick={() => dispatch(toggleTheme())}
                className="text-muted-foreground hover:text-foreground transition-colors h-9 w-9 rounded-lg hover:bg-accent inline-flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <FiSun className="w-4 h-4" />
                ) : (
                  <FiMoon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Outlet />
        </motion.div>
      </div>

      {/* Left Side: Marketing Panel (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 relative bg-background border-l border-border overflow-hidden flex-col">
        <div className="absolute inset-0 bg-grid-pattern opacity-50 z-0" />
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />

        <motion.div
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
          className="relative z-10 p-12 lg:p-16 flex flex-col h-full"
        >
          <div className="mb-12">
            <div className="h-10 text-2xl font-bold text-primary">
              WorkPilot
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight drop-shadow-sm">
              {t("login.title")}
              <br />
              <span className="text-primary">{t("login.subtitle")}</span>
            </h2>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              {t("login.subtitle")}
            </p>

            <ul className="space-y-3 mb-12">
              {featureGridItemTitle.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center text-foreground font-medium text-sm gap-1"
                >
                  <span className="w-5 h-5 rounded-full bg-success text-success-foreground flex items-center justify-center ml-3 shadow-sm">
                    <MdCheck className="w-3 h-3" />
                  </span>
                  {t(item)}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto relative w-full pt-8">
            <div className="bg-card rounded-t-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] border border-border border-b-0 p-6 flex flex-col gap-4 relative overflow-hidden transform translate-y-4 hover:translate-y-2 transition-transform duration-500">
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 w-32 bg-muted rounded-sm" />
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted" />
                  <div className="h-6 w-6 rounded-full bg-muted" />
                  <div className="h-6 w-6 rounded-full bg-primary/20" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="h-3 w-20 bg-muted rounded-sm mb-4" />
                  <div className="h-24 bg-background border border-border rounded-lg p-3 flex flex-col gap-2">
                    <div className="h-2 w-3/4 bg-border rounded-sm" />
                    <div className="h-2 w-1/2 bg-muted rounded-sm" />
                    <div className="mt-auto flex justify-between">
                      <div className="h-4 w-12 bg-success/20 rounded-sm" />
                      <div className="h-4 w-4 rounded-full bg-border" />
                    </div>
                  </div>
                  <div className="h-20 bg-background border border-border rounded-lg p-3 flex flex-col gap-2 opacity-70">
                    <div className="h-2 w-full bg-border rounded-sm" />
                    <div className="h-2 w-2/3 bg-muted rounded-sm" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-24 bg-muted rounded-sm mb-4" />
                  <div className="h-28 bg-background border border-primary/30 rounded-lg p-3 flex flex-col gap-2 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    <div className="h-2 w-4/5 bg-border rounded-sm" />
                    <div className="h-2 w-full bg-muted rounded-sm" />
                    <div className="mt-auto flex justify-between">
                      <div className="h-4 w-16 bg-primary/10 rounded-sm" />
                      <div className="flex -space-x-1 space-x-reverse">
                        <div className="h-4 w-4 rounded-full bg-border border border-background" />
                        <div className="h-4 w-4 rounded-full bg-muted border border-background" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-3 w-16 bg-muted rounded-sm mb-4" />
                  <div className="h-24 bg-background border border-border rounded-lg p-3 flex items-end gap-1">
                    <div className="w-1/4 bg-primary/20 rounded-t-sm h-1/3" />
                    <div className="w-1/4 bg-primary/40 rounded-t-sm h-2/3" />
                    <div className="w-1/4 bg-primary/60 rounded-t-sm h-1/2" />
                    <div className="w-1/4 bg-primary rounded-t-sm h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
