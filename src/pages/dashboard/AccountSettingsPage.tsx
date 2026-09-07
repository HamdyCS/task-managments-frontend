import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiTrash2,
} from "react-icons/fi";

type TabId = "profile" | "email" | "password" | "danger";

interface Tab {
  id: TabId;
  labelKey: string;
  icon: React.ReactNode;
  to: string;
  danger?: boolean;
}

const tabs: Tab[] = [
  { id: "profile", labelKey: "dashboard.accountSettings.tabs.profile", icon: <FiUser className="w-4 h-4" />, to: "/dashboard/account/profile" },
  { id: "email", labelKey: "dashboard.accountSettings.tabs.email", icon: <FiMail className="w-4 h-4" />, to: "/dashboard/account/email" },
  { id: "password", labelKey: "dashboard.accountSettings.tabs.password", icon: <FiLock className="w-4 h-4" />, to: "/dashboard/account/password" },
  { id: "danger", labelKey: "dashboard.accountSettings.tabs.dangerZone", icon: <FiTrash2 className="w-4 h-4" />, to: "/dashboard/account/danger", danger: true },
];

export default function AccountSettingsPage() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("dashboard.accountSettings.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("dashboard.accountSettings.subtitle")}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation */}
        <nav className="lg:w-56 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {tabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.to);
              return (
                <NavLink
                  key={tab.id}
                  to={tab.to}
                  className={`
                    relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors whitespace-nowrap
                    ${isActive
                      ? tab.danger
                        ? "text-destructive bg-destructive/10"
                        : "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                  `}
                >
                  {tab.icon}
                  <span>{t(tab.labelKey)}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`
                        absolute inset-0 rounded-lg -z-10
                        ${tab.danger
                          ? "bg-destructive/10"
                          : "bg-primary/10"
                        }
                      `}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
