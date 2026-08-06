import {
  motion,
  useMotionValueEvent,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX, FiSun, FiMoon, FiGlobe } from "react-icons/fi";
import { Container } from "../../components/layout/Container";
import { useTheme } from "../../hooks/useTheme";
import logo from "../../assets/logo.png";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

const navLinks = [
  { key: "nav.product", href: "#product" },
  { key: "nav.solutions", href: "#solutions" },
  { key: "nav.features", href: "#features" },
];

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const isAr = i18n.language === "ar";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const toggleLanguage = () => {
    const next = isAr ? "en" : "ar";
    i18n.changeLanguage(next);
    localStorage.setItem("language", next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <Container>
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="logo"
                  className="w-15 h-15 rounded-lg object-cover"
                />
                <span className="text-lg font-bold text-foreground">
                  WorkPilot
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(link.key)}
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={toggleLanguage}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors h-10 px-3 rounded-xl hover:bg-accent inline-flex items-center gap-1.5"
                aria-label="Toggle language"
              >
                <FiGlobe className="w-4 h-4" />
                {isAr ? "EN" : "عربي"}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground transition-colors h-10 w-10 rounded-xl hover:bg-accent inline-flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <FiSun className="w-5 h-5" />
                ) : (
                  <FiMoon className="w-5 h-5" />
                )}
              </button>

              <div className="w-px h-6 bg-border mx-1" />

              <Button text={t("nav.getStarted")} to="/sign-up" type="link" />
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-foreground p-2 rounded-xl hover:bg-accent transition-colors"
              aria-label={t("nav.menu")}
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </Container>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-background border-l border-border shadow-xl md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-lg font-bold text-foreground">
                  WorkPilot
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-accent transition-colors"
                  aria-label="Close menu"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl px-4 py-3 transition-colors"
                  >
                    {t(link.key)}
                  </a>
                ))}
              </div>

              <div className="p-4 border-t border-border flex flex-col gap-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl px-4 py-3 transition-colors"
                >
                  <FiGlobe className="w-5 h-5" />
                  {isAr ? "English" : "العربية"}
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl px-4 py-3 transition-colors"
                >
                  {theme === "dark" ? (
                    <FiSun className="w-5 h-5" />
                  ) : (
                    <FiMoon className="w-5 h-5" />
                  )}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </div>

              <div className="p-4 border-t border-border">
                <Button
                  text={t("nav.getStarted")}
                  to="/sign-up"
                  type="link"
                  className="w-full"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
