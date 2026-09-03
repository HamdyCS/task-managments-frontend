import { motion } from "framer-motion";
import { FiFolder, FiUsers, FiList, FiCheckCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { staggerContainer, staggerItem } from "../../../../animations";
import { AnimatedCounter } from "../../../common/AnimatedCounter";

interface Props {
  totalProjects: number;
  totalMembers: number;
  totalTasks: number;
  totalDoneTasks: number;
}

export default function WorkspaceStats({
  totalProjects,
  totalMembers,
  totalTasks,
  totalDoneTasks,
}: Props) {
  const { t } = useTranslation();

  /** Percentage of tasks that are in "Done" status. */
  const completionPercentage =
    totalTasks > 0 ? (totalDoneTasks / totalTasks) * 100 : 0;

  /** Card configuration — drives the rendered grid. */
  const cards = [
    {
      label: t("dashboard.reports.stats.totalProjects"),
      value: totalProjects,
      icon: <FiFolder className="text-primary" size={20} />,
      iconBg: "bg-primary/10",
    },
    {
      label: t("dashboard.reports.stats.totalMembers"),
      value: totalMembers,
      icon: <FiUsers className="text-primary" size={20} />,
      iconBg: "bg-primary/10",
    },
    {
      label: t("dashboard.reports.stats.totalTasks"),
      value: totalTasks,
      icon: <FiList className="text-primary" size={20} />,
      iconBg: "bg-primary/10",
    },
    {
      label: t("dashboard.reports.stats.completedTasks"),
      value: totalDoneTasks,
      icon: <FiCheckCircle className="text-success" size={20} />,
      iconBg: "bg-success/10",
      showProgress: true,
      progress: completionPercentage,
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
          {/* Label + icon row */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-muted-foreground text-sm font-medium">
              {card.label}
            </span>
            <span className={`${card.iconBg} p-1.5 rounded-lg`}>
              {card.icon}
            </span>
          </div>

          {/* Animated numeric value */}
          <div className="text-2xl font-semibold text-card-foreground mb-1">
            <AnimatedCounter end={card.value} duration={1.2} />
          </div>

          {/* Either a progress bar (for completed tasks) or a generic label */}
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
                  {totalDoneTasks}{" "}
                  {t("dashboard.reports.stats.ofTotal", { total: totalTasks })}
                </span>
                <span>{card.progress.toFixed(1)}%</span>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-xs">
              {t("dashboard.reports.stats.acrossWorkspace")}
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
