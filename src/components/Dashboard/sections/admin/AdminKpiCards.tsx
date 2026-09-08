import { motion } from "framer-motion";
import { FiUsers, FiBriefcase, FiGrid, FiList } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { staggerContainer, staggerItem } from "../../../../animations";
import { AnimatedCounter } from "../../../common/AnimatedCounter";
import type { AdminDashboardDto } from "../../../../dtos/admin/AdminDashboardDto";

interface Props {
  data: AdminDashboardDto;
}

export default function AdminKpiCards({ data }: Props) {
  const { t } = useTranslation();

  const cards = [
    {
      label: t("dashboard.admin.kpi.totalUsers"),
      value: data.totalUsersCount,
      icon: <FiUsers className="text-primary" size={20} />,
      iconBg: "bg-primary/10",
      subtitle: t("dashboard.admin.kpi.acrossPlatform"),
    },
    {
      label: t("dashboard.admin.kpi.totalWorkspaces"),
      value: data.totalWorkspacesCount,
      icon: <FiBriefcase className="text-primary" size={20} />,
      iconBg: "bg-primary/10",
      subtitle: t("dashboard.admin.kpi.totalWorkspacesSub"),
    },
    {
      label: t("dashboard.admin.kpi.totalProjects"),
      value: data.totalProjectsCount,
      icon: <FiGrid className="text-warning" size={20} />,
      iconBg: "bg-warning/10",
      subtitle: t("dashboard.admin.kpi.totalProjectsSub"),
    },
    {
      label: t("dashboard.admin.kpi.totalTasks"),
      value: data.totalTasksCount,
      icon: <FiList className="text-success" size={20} />,
      iconBg: "bg-success/10",
      subtitle: t("dashboard.admin.kpi.totalTasksSub"),
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card) => (
        <motion.div
          key={card.label}
          variants={staggerItem}
          className="bg-card border rounded-xl p-5 shadow-sm hover:border-primary/30 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-muted-foreground text-sm font-medium">
              {card.label}
            </span>
            <span className={`${card.iconBg} p-1.5 rounded-lg`}>
              {card.icon}
            </span>
          </div>
          <div className="text-2xl font-semibold text-card-foreground mb-1">
            <AnimatedCounter end={card.value} duration={1.2} />
          </div>
          <div className="text-muted-foreground text-xs">{card.subtitle}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
