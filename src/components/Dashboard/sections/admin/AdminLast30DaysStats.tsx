import { motion } from "framer-motion";
import { FiUserPlus, FiBriefcase, FiGrid } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { fadeIn } from "../../../../animations";
import { AnimatedCounter } from "../../../common/AnimatedCounter";
import type { AdminDashboardDto } from "../../../../dtos/admin/AdminDashboardDto";

interface Props {
  data: AdminDashboardDto;
}

export default function AdminLast30DaysStats({ data }: Props) {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("dashboard.admin.last30Days.users"),
      value: data.totalUsersInLast30DaysCount,
      icon: <FiUserPlus size={18} />,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: t("dashboard.admin.last30Days.workspaces"),
      value: data.totalWorkspacesInLast30DaysCount,
      icon: <FiBriefcase size={18} />,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: t("dashboard.admin.last30Days.projects"),
      value: data.totalProjectsInLast30DaysCount,
      icon: <FiGrid size={18} />,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-card border rounded-xl p-6 shadow-sm flex flex-col"
    >
      <h2 className="font-semibold text-lg text-card-foreground mb-1">
        {t("dashboard.admin.last30Days.title")}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        {t("dashboard.admin.last30Days.subtitle")}
      </p>

      <div className="flex-1 flex flex-col justify-center gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}
            >
              {stat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-semibold text-card-foreground">
                <AnimatedCounter end={stat.value} duration={1.2} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
