import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiBell,
  FiChevronDown,
  FiSearch,
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
import useUserWorkspaces from "../../../hooks/workspace/useUserWorkspaces";
import useLogout from "../../../hooks/auth/useLogout";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { Container } from "../../website/layout/Container";

interface DashboardNavbarProps {
  onMenuClick: () => void;
}

export default function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const { language, changeLanguage } = useLanguage();
  const user = useAppSelector((state) => state.auth.user);
  const isAr = language === "ar";
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const workspaceMenuRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: logout, isPending } = useLogout();

  const { data: workspacesData } = useUserWorkspaces();
  const workspaces = workspacesData?.data ?? [];
  const currentWorkspace = workspaces.find((w) => w.id === Number(workspaceId));


  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (workspaceMenuRef.current && !workspaceMenuRef.current.contains(e.target as Node)) {
        setIsWorkspaceOpen(false);
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

  function switchWorkspace(id: number) {
    if (id === Number(workspaceId)) {
      setIsWorkspaceOpen(false);
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.set("workspaceId", String(id));
    navigate(`/dashboard?${params.toString()}`, { replace: true });
    setIsWorkspaceOpen(false);
  }

  return (
    <>
      <nav className="h-16 border-b bg-background/80 backdrop-blur-md shrink-0 z-40 sticky top-0">
        <Container className="px-6 h-full max-w-full!">
          <div className="flex h-full justify-between gap-4">
            <div className="flex items-center gap-4 ">
              <button
                onClick={onMenuClick}
                className="lg:hidden text-muted-foreground hover:text-card-foreground"
              >
                <FiMenu size={20} />
              </button>
              <h1 className="text-lg hidden md:block font-semibold text-card-foreground">
                {getGreeting()}, {user?.firstName ?? "User"} 👋
              </h1>
              {currentWorkspace && (
                <>
                  <div className="h-6 w-px bg-border hidden sm:block" />
                  <div ref={workspaceMenuRef} className="relative hidden sm:block">
                    <button
                      onClick={() => setIsWorkspaceOpen((o) => !o)}
                      className="flex items-center gap-1 text-muted-foreground hover:text-card-foreground transition-colors text-sm font-medium"
                    >
                      {currentWorkspace.name}
                      <FiChevronDown size={14} />
                    </button>
                    {isWorkspaceOpen && (
                      <div className="absolute top-full ltr:left-0 rtl:right-0 mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg py-1 z-50">
                        <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                          {t("dashboard.workspaceSwitcher.title", "Switch workspace")}
                        </div>
                        {workspaces.map((ws) => (
                          <button
                            key={ws.id}
                            onClick={() => switchWorkspace(ws.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer ${
                              ws.id === Number(workspaceId)
                                ? "bg-accent text-card-foreground font-medium"
                                : "text-popover-foreground hover:bg-accent"
                            }`}
                          >
                            <span className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                              {ws.name[0]}
                            </span>
                            <span className="truncate">{ws.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <div className="search-input relative flex-1">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search spaces, tasks..."
                  className="w-full pl-9 pr-4 py-1.5 bg-muted border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors h-10 px-3 rounded-xl hover:bg-accent inline-flex items-center gap-1.5"
                  aria-label="Toggle language"
                >
                  <FiGlobe className="w-4 h-4" />
                  {isAr ? "EN" : "عربي"}
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(toggleTheme())}
                  className="text-muted-foreground hover:text-card-foreground transition-colors h-10 w-10 rounded-xl hover:bg-accent inline-flex items-center justify-center"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <FiSun className="w-5 h-5" />
                  ) : (
                    <FiMoon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => navigate(`/dashboard/notifications?workspaceId=${workspaceId}`)}
                  className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors relative"
                >
                  <FiBell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
                </button>
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
                        to="/settings"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent transition-colors cursor-pointer"
                      >
                        <FiSettings size={16} />
                        {t("dashboard.accountMenu.settings")}
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
