import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeIn } from "../../../animations";
import type { Notification } from "../../../dtos/notification/Notification";
import type { NotificationType } from "../../../types/NotificationType";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";

interface RecentActivityProps {
  unReadNotifications: Notification[];
}

function getNotificationColors(type: NotificationType): {
  dot: string;
  title: string;
} {
  switch (type) {
    case "TaskAssigned":
      return { dot: "bg-primary", title: "text-primary" };
    case "TaskUnassigned":
      return { dot: "bg-muted-foreground", title: "text-muted-foreground" };
    case "TaskStatusUpdated":
      return { dot: "bg-success", title: "text-success" };
    case "TaskUpdated":
      return { dot: "bg-primary", title: "text-primary" };
    case "CommentAdded":
      return { dot: "bg-muted-foreground", title: "text-muted-foreground" };
    case "DueDateReminder":
      return { dot: "bg-destructive", title: "text-destructive" };
    case "TaskDeleted":
      return { dot: "bg-destructive", title: "text-destructive" };
    case "WorkSpaceInvite":
      return { dot: "bg-success", title: "text-success" };
    default:
      return { dot: "bg-muted-foreground", title: "text-muted-foreground" };
  }
}

export default function RecentActivity({
  unReadNotifications,
}: RecentActivityProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-card border rounded-xl p-6 shadow-sm flex flex-col"
    >
      <h2 className="font-semibold text-lg text-card-foreground mb-6">
        {t("dashboard.recentActivity")}
      </h2>
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {unReadNotifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.noNotifications")}
          </p>
        ) : (
          unReadNotifications.map((notification) => {
            const colors = getNotificationColors(notification.notificationType);
            return (
              <div key={notification.id} className="flex gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${colors.dot} mt-2 shrink-0`}
                />
                <div>
                  <div className={`text-sm font-medium ${colors.title}`}>
                    {notification.title}
                  </div>
                  <div className="text-sm text-card-foreground">
                    {notification.message}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {formatTimeAgo(notification.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
