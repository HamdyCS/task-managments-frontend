import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiMenu,
  FiSun,
  FiMoon,
  FiGlobe,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useLanguage } from "../../../hooks/language/useLanguage";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toggleTheme } from "../../../store/theme/theme";
import useLogout from "../../../hooks/auth/useLogout";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { Container } from "../../website/layout/Container";

interface AdminDashboardNavbarProps {
  onMenuClick: () => void;
}

export default function AdminDashboardNavbar({
  onMenuClick,
}: AdminDashboardNavbarProps) {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const { language, changeLanguage } = useLanguage();
  const user = useAppSelector((state) => state.auth.user);
  const isAr = language === "ar";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: logout, isPending } = useLogout();

  //close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.greeting.morning");
    if (hour < 18) return t("dashboard.greeting.afternoon");
    return t("dashboard.greeting.evening");
  }

  const toggleLanguage = () => {
    changeLanguage(isAr ? "en" : "ar");
  };

  return (
    <>
      <nav className="h-16 border-b bg-background/80 backdrop-blur-md shrink-0 z-40 sticky top-0">
        <Container className="px-6 h-full max-w-full!">
          <div className="flex h-full justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <button
                onClick={onMenuClick}
                className="lg:hidden text-muted-foreground hover:text-card-foreground cursor-pointer shrink-0"
              >
                <FiMenu size={20} />
              </button>
              <h1 className="text-lg hidden md:block font-semibold text-card-foreground shrink-0">
                {getGreeting()}, {user?.firstName ?? "Admin"} 👋
              </h1>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                  {t("dashboard.admin.badge")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors h-10 px-3 rounded-xl hover:bg-accent inline-flex items-center gap-1.5 cursor-pointer"
                  aria-label="Toggle language"
                >
                  <FiGlobe className="w-4 h-4" />
                  {isAr ? "EN" : "عربي"}
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(toggleTheme())}
                  className="text-muted-foreground hover:text-card-foreground transition-colors h-10 w-10 rounded-xl hover:bg-accent inline-flex items-center justify-center cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <FiSun className="w-5 h-5" />
                  ) : (
                    <FiMoon className="w-5 h-5" />
                  )}
                </button>
                {/* user account menu */}
                <div ref={menuRef} className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="account-menu-btn w-8 h-8 rounded-full overflow-hidden border bg-muted flex items-center justify-center text-xs font-medium text-card-foreground cursor-pointer"
                  >
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </button>
                  {isMenuOpen && (
                    <div className="absolute top-full rtl:left-0 ltr:right-0 mt-2 w-48 bg-popover border border-border rounded-xl shadow-lg py-1 z-50">
                      <Link
                        to="/admin/dashboard/account"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent transition-colors cursor-pointer"
                      >
                        <FiSettings size={16} />
                        {t("dashboard.sidebar.settings")}
                      </Link>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsLogoutDialogOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-accent transition-colors cursor-pointer"
                      >
                        <FiLogOut size={16} />
                        {t("dashboard.accountMenu.logout")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </nav>
      <ConfirmDialog
        open={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={() => logout()}
        title={t("dashboard.logoutConfirm.title")}
        confirmText={t("dashboard.logoutConfirm.continue")}
        cancelText={t("dashboard.logoutConfirm.cancel")}
        isLoading={isPending}
      />
    </>
  );
}
