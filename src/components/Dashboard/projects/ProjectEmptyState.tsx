import { useTranslation } from "react-i18next";
import { FiFolder } from "react-icons/fi";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../../animations";
import Button from "../../ui/Button";

interface Props {
  isFiltered: boolean;
  canCreate: boolean;
  onCreateClick: () => void;
}

export default function ProjectEmptyState({
  isFiltered,
  canCreate,
  onCreateClick,
}: Props) {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div variants={staggerItem}>
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 mx-auto">
          <FiFolder size={28} className="text-primary" />
        </div>
      </motion.div>

      <motion.h3
        variants={staggerItem}
        className="text-lg font-semibold text-card-foreground mb-2"
      >
        {isFiltered
          ? t("dashboard.projects.emptyFiltered.title")
          : t("dashboard.projects.empty.title")}
      </motion.h3>

      <motion.p
        variants={staggerItem}
        className="text-sm text-muted-foreground max-w-sm mb-6"
      >
        {isFiltered
          ? t("dashboard.projects.emptyFiltered.description")
          : t("dashboard.projects.empty.description")}
      </motion.p>

      {!isFiltered && canCreate && (
        <motion.div variants={staggerItem}>
          <Button
            type="button"
            text={t("dashboard.projects.empty.create")}
            onClick={onCreateClick}
            className="px-6"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
