import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../../../animations";

type TabType = "overview" | "projects" | "members";

interface Props {
  activeTab: TabType;
  workspaceId: number;
}

/** Tab definitions — keys map to URL search params, labels are i18n keys. */
const TABS: { key: TabType; labelKey: string }[] = [
  { key: "overview", labelKey: "dashboard.reports.tabs.overview" },
  { key: "projects", labelKey: "dashboard.reports.tabs.projects" },
  { key: "members", labelKey: "dashboard.reports.tabs.members" },
];

export default function ReportsTabs({ activeTab, workspaceId }: Props) {
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();

  /** Handle tab click: update the `tab` param and remove stale sub-params. */
  function handleTabChange(tab: TabType) {
    setSearchParams((prev) => {
      prev.set("tab", tab);
      // Overview shows workspace-wide data, so remove project/member filters
      if (tab === "overview") {
        prev.delete("projectId");
        prev.delete("memberId");
      }
      // Projects tab doesn't need a member filter
      if (tab === "projects") {
        prev.delete("memberId");
      }
      // Members tab doesn't need a project filter
      if (tab === "members") {
        prev.delete("projectId");
      }
      // Ensure workspaceId is always present
      if (!prev.has("workspaceId")) {
        prev.set("workspaceId", String(workspaceId));
      }
      return prev;
    });
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex gap-1 bg-muted p-1 rounded-xl w-fit"
    >
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleTabChange(tab.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === tab.key
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t(tab.labelKey)}
        </button>
      ))}
    </motion.div>
  );
}
