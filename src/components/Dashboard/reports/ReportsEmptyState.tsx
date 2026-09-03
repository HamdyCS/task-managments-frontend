import { useTranslation } from "react-i18next";
import { FiBarChart2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../../animations";

export default function ReportsEmptyState() {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* Icon badge */}
      <motion.div variants={staggerItem}>
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 mx-auto">
          <FiBarChart2 size={28} className="text-primary" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        variants={staggerItem}
        className="text-lg font-semibold text-card-foreground mb-2"
      >
        {t("dashboard.reports.noWorkspace.title")}
      </motion.h3>

      {/* Description */}
      <motion.p
        variants={staggerItem}
        className="text-sm text-muted-foreground max-w-sm"
      >
        {t("dashboard.reports.noWorkspace.description")}
      </motion.p>
    </motion.div>
  );
}
