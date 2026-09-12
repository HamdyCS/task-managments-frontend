import { motion } from "framer-motion";
import { FiUsers, FiBriefcase, FiFolder, FiList } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { staggerContainer, staggerItem } from "../../../../animations";
import { AnimatedCounter } from "../../../common/AnimatedCounter";

interface Props {
  regularUsersCount: number;
  workspacesCount: number;
  projectsCount: number;
  tasksCount: number;
}

export default function ReportsSummaryCards({
  regularUsersCount,
  workspacesCount,
  projectsCount,
  tasksCount,
}: Props) {
  const { t } = useTranslation();

  const cards = [
    {
      label: t("dashboard.admin.reports.summaryCards.regularUsers"),
      value: regularUsersCount,
      icon: <FiUsers className="text-primary" size={20} />,
      iconBg: "bg-primary/10",
    },
    {
      label: t("dashboard.admin.reports.summaryCards.workspaces"),
      value: workspacesCount,
      icon: <FiBriefcase className="text-primary" size={20} />,
      iconBg: "bg-primary/10",
    },
    {
      label: t("dashboard.admin.reports.summaryCards.projects"),
      value: projectsCount,
      icon: <FiFolder className="text-primary" size={20} />,
      iconBg: "bg-primary/10",
    },
    {
      label: t("dashboard.admin.reports.summaryCards.tasks"),
      value: tasksCount,
      icon: <FiList className="text-primary" size={20} />,
      iconBg: "bg-primary/10",
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
          <div className="text-2xl font-semibold text-card-foreground">
            <AnimatedCounter end={card.value} duration={1.2} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
