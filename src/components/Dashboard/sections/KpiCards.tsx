import { motion } from "framer-motion";
import { FiFolder, FiList, FiLoader, FiCheckCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { staggerContainer, staggerItem } from "../../../animations";
import { AnimatedCounter } from "../../common/AnimatedCounter";
import type { DashboardStats } from "../../../dtos/workspace/WorkSpaceDashboardDto";

interface Props {
  stats: DashboardStats;
  totalTasks: number;
}

export default function KpiCards({ stats, totalTasks }: Props) {
  const { t } = useTranslation();

  const cards = [
    {
      label: t("dashboard.kpi.totalProjects"),
      value: stats.totalProjects,
      icon: <FiFolder className="text-primary" size={20} />,
      iconBg: "bg-primary/10",
      subtitle: t("dashboard.kpi.acrossWorkspace"),
    },
    {
      label: t("dashboard.kpi.totalTasks"),
      value: stats.totalTasks,
      icon: <FiList className="text-primary" size={20} />,
      iconBg: "bg-primary/10",
      subtitle: t("dashboard.kpi.acrossProjects"),
    },
    {
      label: t("dashboard.kpi.inProgress"),
      value: stats.inProgressTasks,
      icon: <FiLoader className="text-warning" size={20} />,
      iconBg: "bg-warning/10",
      subtitle: t("dashboard.kpi.currentlyActive"),
    },
    {
      label: t("dashboard.kpi.completed"),
      value: stats.completedTasks,
      icon: <FiCheckCircle className="text-success" size={20} />,
      iconBg: "bg-success/10",
      subtitle: null,
      showProgress: true,
      progress: totalTasks > 0 ? (stats.completedTasks / totalTasks) * 100 : 0,
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
          {card.showProgress ? (
            <div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                <div
                  className="bg-success h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${card.progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-muted-foreground text-xs mt-1">
                <span>
                  {stats.completedTasks} {t("dashboard.kpi.ofCompleted", { total: totalTasks })}
                </span>
                <span>{card.progress.toFixed(1)}%</span>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-xs">{card.subtitle}</div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
