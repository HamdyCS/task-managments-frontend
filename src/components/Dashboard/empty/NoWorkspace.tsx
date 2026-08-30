import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiPlus, FiMail } from "react-icons/fi";
import { staggerContainer, staggerItem } from "../../../animations";
import Button from "../../ui/Button";

export default function NoWorkspace() {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <motion.div
        variants={staggerItem}
        className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6"
      >
        <FiPlus className="text-muted-foreground" size={32} />
      </motion.div>

      <motion.h2
        variants={staggerItem}
        className="text-2xl font-semibold text-card-foreground mb-2"
      >
        {t("dashboard.noWorkspace.title")}
      </motion.h2>

      <motion.p
        variants={staggerItem}
        className="text-muted-foreground mb-8 max-w-md"
      >
        {t("dashboard.noWorkspace.description")}
      </motion.p>

      <motion.div
        variants={staggerItem}
        className="flex flex-col md:flex-row gap-4"
      >
        <Button
          text={t("dashboard.noWorkspace.create")}
          type="button"
          Icon={<FiPlus size={18} />}
          className="w-[250px]! h-12!"
        />
        <Button
          text={t("dashboard.noWorkspace.acceptInvite")}
          type="link"
          to="/dashboard/team"
          Icon={<FiMail size={18} />}
          className="shadow-none w-[250px]! h-12!"
        />
      </motion.div>
    </motion.div>
  );
}
