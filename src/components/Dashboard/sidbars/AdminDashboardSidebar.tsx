import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLayout,
  FiUsers,
  FiBriefcase,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import useLogout from "../../../hooks/auth/useLogout";
import logo from "../../../assets/logo.png";
import ConfirmDialog from "../../ui/ConfirmDialog";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  to: string;
  section: string;
  end: boolean;
}

interface AdminDashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboardSidebar({
  isOpen,
  onClose,
}: AdminDashboardSidebarProps) {
  const { t, i18n } = useTranslation();
  const { mutateAsync: logout, isPending } = useLogout();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      icon: <FiLayout size={20} />,
      label: t("dashboard.admin.sidebar.overview"),
      to: "/admin/dashboard",
      section: "overview",
      end: true,
    },
    {
      icon: <FiUsers size={20} />,
      label: t("dashboard.admin.sidebar.users"),
      to: "/admin/users",
      section: "users",
      end: true,
    },
    {
      icon: <FiBriefcase size={20} />,
      label: t("dashboard.admin.sidebar.workspaces"),
      to: "/admin/workspaces",
      section: "workspaces",
      end: true,
    },
    {
      icon: <FiBarChart2 size={20} />,
      label: t("dashboard.admin.sidebar.reports"),
      to: "/admin/reports",
      section: "reports",
      end: true,
    },
  ];

  const bottomItems: NavItem[] = [
    {
      icon: <FiSettings size={20} />,
      label: t("dashboard.sidebar.settings"),
      to: "/admin/settings",
      section: "settings",
      end: false,
    },
  ];

  const sidebarContent = (
    <>
      <div className="px-6 mb-8 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="w-15 h-15 rounded-lg object-cover"
          />
          <span className="text-lg font-bold text-foreground">WorkPilot</span>
        </Link>
      </div>

      <div className="px-6 mb-2 mt-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {t("dashboard.admin.sidebar.admin")}
      </div>

      <div className="flex-1 overflow-y-auto ltr:pr-2 rtl:pl-2">
        {navItems.map((item) => (
          <NavLink
            key={item.section}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 mb-1 ltr:rounded-r-lg ltr:border-l-4 rtl:rounded-l-lg rtl:border-r-4 transition-colors duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border-primary"
                  : "text-muted-foreground hover:text-card-foreground hover:bg-muted border-transparent"
              }`
            }
            onClick={onClose}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="px-4 mt-auto pt-4 border-t">
        {bottomItems.map((item) => (
          <NavLink
            key={item.section}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 mb-1 ltr:rounded-r-lg ltr:border-l-4 rtl:rounded-l-lg rtl:border-r-4 transition-colors duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border-primary"
                  : "text-muted-foreground hover:text-card-foreground hover:bg-muted border-transparent"
              }`
            }
            onClick={onClose}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => setIsLogoutDialogOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ltr:rounded-r-lg ltr:border-l-4 rtl:rounded-l-lg rtl:border-r-4 border-transparent transition-colors duration-200 cursor-pointer"
        >
          <FiLogOut size={20} />
          <span className="text-sm font-medium">
            {t("dashboard.admin.sidebar.logout")}
          </span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex fixed ltr:left-0 rtl:right-0 top-0 h-full w-[260px] bg-card ltr:border-r rtl:border-l flex-col py-4 z-50">
        {sidebarContent}
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 bg-black/50 z-50 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: i18n.dir() === "rtl" ? 260 : -260 }}
              animate={{ x: 0 }}
              exit={{ x: i18n.dir() === "rtl" ? 260 : -260 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed ltr:left-0 rtl:right-0 top-0 h-full w-[260px] bg-card border-r flex flex-col py-4 z-50 lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute top-4 ltr:right-4 rtl:left-4 text-muted-foreground hover:text-card-foreground"
              >
                <FiX size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
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
