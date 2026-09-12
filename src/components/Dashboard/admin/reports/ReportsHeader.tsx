import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../animations";
import config from "../../../../config";
import DateRangePicker from "../../../ui/DateRangePicker";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface Props {
  isLoading: boolean;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export default function ReportsHeader({
  isLoading,
  dateRange,
  onDateRangeChange,
}: Props) {
  const { t } = useTranslation();
  const [isDownloading] = useState(false);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const pdfUrl = dateRange.from && dateRange.to
    ? `${config.BaseApiURl}${config.admin.reports.pdfDownload(
        formatDate(dateRange.from),
        formatDate(dateRange.to),
      )}`
    : `${config.BaseApiURl}${config.admin.reports.pdfDownload()}`;

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("dashboard.admin.reports.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("dashboard.admin.reports.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />

        <a
          href={pdfUrl}
          download
          className={`inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer w-fit ${
            isLoading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {isDownloading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <FiDownload size={16} />
          )}
          {t("dashboard.admin.reports.downloadPdf")}
        </a>
      </div>
    </motion.div>
  );
}
