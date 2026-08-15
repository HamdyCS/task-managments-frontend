import { useTranslation } from "react-i18next";
import { FiBell } from "react-icons/fi";

interface NotificationEmptyStateProps {
  type: "all" | "unread";
}

export default function NotificationEmptyState({
  type,
}: NotificationEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <FiBell size={24} className="text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-card-foreground mb-1">
        {type === "unread"
          ? t("dashboard.notifications.emptyUnread.title")
          : t("dashboard.notifications.empty.title")}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {type === "unread"
          ? t("dashboard.notifications.emptyUnread.description")
          : t("dashboard.notifications.empty.description")}
      </p>
    </div>
  );
}
