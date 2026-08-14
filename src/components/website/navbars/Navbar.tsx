import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX, FiSun, FiMoon, FiGlobe } from "react-icons/fi";
import { Container } from "../layout/Container";
import logo from "../../../assets/logo.png";
import Button from "../../ui/Button";
import { Link } from "react-router-dom";
import { useTheme } from "../../../hooks/theme/useTheme";
import { useLanguage } from "../../../hooks/language/useLanguage";
import { useAppSelector } from "../../../store/hooks";

const navLinks = [
  { key: "nav.product", href: "/product" },
  { key: "nav.solutions", href: "/solutions" },
  { key: "nav.features", href: "/features" },
];

export function Navbar() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = language === "ar";
  const currentUser = useAppSelector((state) => state.auth.user);

  const toggleLanguage = () => {
    changeLanguage(isAr ? "en" : "ar");
  };

  return (
    <>
      <motion.aside
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-background z-0"
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

              {currentUser ? (
                <Button
                  text={t("nav.dashboard")}
                  to="/dashboard"
                  type="link"
                  className="text-sm"
                />
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors h-10 px-3 rounded-xl hover:bg-accent inline-flex items-center"
                  >
                    {t("nav.signIn")}
                  </Link>
                  <div className="w-px h-6 bg-border mx-1" />
                  <Button
                    text={t("nav.getStarted")}
                    to="/sign-up"
                    type="link"
                    className="text-sm"
                  />
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-foreground p-2 rounded-xl hover:bg-accent transition-colors"
              aria-label={t("nav.menu")}
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </Container>
      </motion.aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
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
                  onClick={() => setMobileMenuOpen(false)}
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
                    onClick={() => setMobileMenuOpen(false)}
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
                {currentUser ? (
                  <Button
                    text={t("nav.dashboard")}
                    to="/dashboard"
                    type="link"
                    className="w-full"
                  />
                ) : (
                  <>
                    <Link
                      to="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl px-4 py-3 transition-colors mb-2"
                    >
                      {t("nav.signIn")}
                    </Link>
                    <Button
                      text={t("nav.getStarted")}
                      to="/sign-up"
                      type="link"
                      className="w-full"
                    />
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
