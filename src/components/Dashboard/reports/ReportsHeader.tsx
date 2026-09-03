import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";
import { fadeIn } from "../../../animations";
import config from "../../../config";

interface Props {
  workspaceId: number;
}

export default function ReportsHeader({ workspaceId }: Props) {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      {/* Page title */}
      <h1 className="text-2xl font-bold text-foreground">
        {t("dashboard.reports.title")}
      </h1>

      {/* PDF download link — opens the backend endpoint as a file download */}
      <a
        href={`${config.BaseApiURl}${config.reports.workspacePdf(workspaceId)}`}
        download
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer w-fit"
      >
        {isDownloading ? (
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <FiDownload size={16} />
        )}
        {t("dashboard.reports.downloadButton")}
      </a>
    </motion.div>
  );
}
