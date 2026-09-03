import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
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
import useWorkspaceRole from "../../../hooks/workspace/useWorkspaceRole";
import useLogout from "../../../hooks/auth/useLogout";
import { useNotifications } from "../../../hooks/notification/useNotifications";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { Container } from "../../website/layout/Container";
import { setSelectedWorkSpace } from "../../../store/dashboard/selectedWorkSpace";
import getRoleBadgeClasses from "../../../utils/getRoleBadgeClasses";

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

  //fetch user workspaces and current workspace from URL param
  const {
    data: workspacesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserWorkspaces();
  const workspaces = workspacesData?.pages.flatMap((p) => p.data) ?? [];
  const currentWorkspace = workspaces.find((w) => w.id === Number(workspaceId));

  const { ref: sentinelRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  //fetch workspace role for the current workspace
  const { data: workspaceRole } = useWorkspaceRole(
    workspaceId ? Number(workspaceId) : null,
  );

  //fetch unread notifications count
  const { data: unreadNotificationsData } = useNotifications("unread");
  const unreadCount = unreadNotificationsData?.pages?.[0]?.totalCount ?? 0;

  //close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        workspaceMenuRef.current &&
        !workspaceMenuRef.current.contains(e.target as Node)
      ) {
        setIsWorkspaceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //sync selected workspace and role to redux when they change
  useEffect(() => {
    if (!currentWorkspace || !workspaceRole) return;
    dispatch(
      setSelectedWorkSpace({
        workSpaceId: currentWorkspace.id,
        workSpace: currentWorkspace,
        workSpaceRole: workspaceRole,
      }),
    );
  }, [currentWorkspace, workspaceRole, dispatch]);

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.greeting.morning");
    if (hour < 18) return t("dashboard.greeting.afternoon");
    return t("dashboard.greeting.evening");
  }

  const toggleLanguage = () => {
    changeLanguage(isAr ? "en" : "ar");
  };

  //switch workspace by updating URL param
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
      {/* sticky top navbar with greeting, workspace switcher, and user actions */}
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
                {getGreeting()}, {user?.firstName ?? "User"} 👋
              </h1>
              {/* workspace switcher dropdown */}
              <>
                <div className="h-6 w-px bg-border hidden sm:block shrink-0" />

                <div ref={workspaceMenuRef} className="relative min-w-0">
                  <button
                    onClick={() => setIsWorkspaceOpen((o) => !o)}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-card-foreground transition-colors text-sm font-medium min-w-0 max-w-full"
                    title={currentWorkspace?.name}
                  >
                    {currentWorkspace ? (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="truncate">
                          {currentWorkspace.name}
                        </span>

                        {workspaceRole && (
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold leading-none shrink-0 ${getRoleBadgeClasses(workspaceRole)}`}
                          >
                            {t(
                              `dashboard.workspaceSwitcher.role.${workspaceRole}`,
                            )}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        {t(
                          "dashboard.workspaceSwitcher.selectWorkspace",
                          "Select workspace",
                        )}
                      </span>
                    )}

                    <FiChevronDown size={14} className="shrink-0" />
                  </button>
                  {isWorkspaceOpen && (
                    <div className="absolute top-full ltr:left-0 rtl:right-0 mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg py-1 z-50 max-h-72 overflow-y-auto">
                      <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        {t(
                          "dashboard.workspaceSwitcher.title",
                          "Switch workspace",
                        )}
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

                      <div ref={sentinelRef} className="h-2" />

                      {isFetchingNextPage && (
                        <div className="flex justify-center py-2">
                          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            </div>
            <div className="flex items-center gap-1">
              {/* search bar */}
              {/* <div className="search-input relative flex-1">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search spaces, tasks..."
                  className="w-full pl-9 pr-4 py-1.5 bg-muted border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div> */}
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
                <Link
                  to={`/dashboard/notifications${workspaceId ? `?workspaceId=${workspaceId}` : ""}`}
                  className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors relative cursor-pointer"
                >
                  <FiBell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 rtl:-right-1 ltr:-left-1 min-w-[18px] h-[18px] flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
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
      {/* logout confirmation dialog */}
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
