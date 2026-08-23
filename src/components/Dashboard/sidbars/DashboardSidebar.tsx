import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLayout,
  FiCheckSquare,
  FiBell,
  FiGrid,
  FiUsers,
  FiBarChart2,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { useAppSelector } from "../../../store/hooks";
import logo from "../../../assets/logo.png";
import { useLanguage } from "../../../hooks/language/useLanguage";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  to: string;
  section: string;
}

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const { t, i18n } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const selectedWorkSpace = useAppSelector((state) => state.selectedWorkSpace);

  //get location
  const location = useLocation();

  const navSections: { id: string; title: string; items: NavItem[] }[] = [
    {
      id: "main",
      title: t("dashboard.sidebar.main"),
      items: [
        {
          icon: <FiLayout size={20} />,
          label: t("dashboard.sidebar.dashboard"),
          to: `/dashboard?workspaceId=${workspaceId}`,
          section: "dashboard",
        },
        {
          icon: <FiCheckSquare size={20} />,
          label: t("dashboard.sidebar.tasks"),
          to: `/dashboard/tasks?workspaceId=${workspaceId}`,
          section: "tasks",
        },
        {
          icon: <FiBell size={20} />,
          label: t("dashboard.sidebar.notifications"),
          to: `/dashboard/notifications?workspaceId=${workspaceId}`,
          section: "notifications",
        },
      ],
    },
    {
      id: "workspace",
      title: t("dashboard.sidebar.workspace"),
      items: [
        {
          icon: <FiGrid size={20} />,
          label: t("dashboard.sidebar.projects"),
          to: `/dashboard/projects?workspaceId=${workspaceId}`,
          section: "projects",
        },
        {
          icon: <FiUsers size={20} />,
          label: t("dashboard.sidebar.team"),
          to: `/dashboard/team?workspaceId=${workspaceId}`,
          section: "team",
        },
      ],
    },
    {
      id: "analytics",
      title: t("dashboard.sidebar.analytics"),
      items: [
        {
          icon: <FiBarChart2 size={20} />,
          label: t("dashboard.sidebar.reports"),
          to: `/dashboard/reports?workspaceId=${workspaceId}`,
          section: "reports",
        },
      ],
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

      <div className="flex-1 overflow-y-auto pr-2">
        {navSections.map((section) => {
          // if the user is a member, do not show the analytics section
          if (
            section.id == "analytics" &&
            selectedWorkSpace.workSpaceRole == "Member"
          ) {
            return null;
          }
          return (
            <div key={section.title}>
              <div className="px-6 mb-2 mt-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {section.title}
              </div>
              {section.items.map((item) => (
                <NavLink
                  key={item.section}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 mb-1 rounded-r-lg border-l-4 transition-colors duration-200 ${
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
          );
        })}
      </div>

      <div className="px-4 mt-auto pt-4 border-t">
        <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium mb-4 hover:bg-primary/90 transition-colors shadow-sm group">
          <FiPlus
            size={18}
            className="group-hover:rotate-90 transition-transform"
          />
          {t("dashboard.sidebar.create")}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex fixed  ltr:left-0 rtl:right-0 top-0 h-full w-[260px] bg-card ltr:border-r rtl:border-l flex-col py-4 z-50 ">
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
              className=" fixed top-0
               bg-black/50 z-50 lg:hidden"
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
                className="absolute top-4 ltr:right-4 rtl:left-4  text-muted-foreground hover:text-card-foreground"
              >
                <FiX size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
