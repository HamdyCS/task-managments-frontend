import { useTranslation } from "react-i18next";
import { FiGrid } from "react-icons/fi";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../../animations";
import Button from "../../ui/Button";

interface Props {
  isFiltered: boolean;
  onCreateClick: () => void;
}

export default function WorkspaceEmptyState({
  isFiltered,
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
          <FiGrid size={28} className="text-primary" />
        </div>
      </motion.div>

      <motion.h3
        variants={staggerItem}
        className="text-lg font-semibold text-card-foreground mb-2"
      >
        {isFiltered
          ? t("dashboard.workspaces.emptyFiltered.title")
          : t("dashboard.workspaces.empty.title")}
      </motion.h3>

      <motion.p
        variants={staggerItem}
        className="text-sm text-muted-foreground max-w-sm mb-6"
      >
        {isFiltered
          ? t("dashboard.workspaces.emptyFiltered.description")
          : t("dashboard.workspaces.empty.description")}
      </motion.p>

      {!isFiltered && (
        <motion.div variants={staggerItem}>
          <Button
            type="button"
            text={t("dashboard.workspaces.empty.create")}
            onClick={onCreateClick}
            className="px-6"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
