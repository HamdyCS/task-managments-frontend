import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Notification } from "../../../dtos/notification/Notification";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";
import NotificationIcon from "./NotificationIcon";
import useMarkAsRead from "../../../hooks/notification/useMarkAsRead";

interface WorkspaceInviteNotificationProps {
  notification: Notification;
}

export default function WorkspaceInviteNotification({
  notification,
}: WorkspaceInviteNotificationProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const { mutate: markAsRead } = useMarkAsRead({
    onError: () => {
      notification.isRead = false;
    },
  });

  function handleAccept(e: React.MouseEvent) {
    e.stopPropagation();
    markAsRead(notification.id);
    notification.isRead = true;
    if (workspaceId) {
      navigate(`/dashboard?workspaceId=${workspaceId}`);
    }
  }

  function handleDecline(e: React.MouseEvent) {
    e.stopPropagation();
    markAsRead(notification.id);
  }

  return (
    <div
      className={`w-full flex items-start gap-3.5 p-4 rounded-xl text-start transition-colors ${
        notification.isRead
          ? "bg-card hover:bg-accent/50"
          : "bg-primary/20 hover:bg-primary/25"
      }`}
    >
      <NotificationIcon type="WorkSpaceInvite" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm leading-snug ${
              notification.isRead
                ? "font-medium text-card-foreground"
                : "font-semibold text-card-foreground"
            }`}
          >
            {notification.title}
          </span>
          {!notification.isRead && (
            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {notification.message}
        </p>
        <span className="text-xs text-muted-foreground/70 mt-1 block">
          {formatTimeAgo(notification.createdAt)}
        </span>

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            {t("dashboard.notifications.accept")}
          </button>
          <button
            onClick={handleDecline}
            className="px-4 py-1.5 bg-muted text-muted-foreground text-sm font-medium rounded-lg hover:bg-muted/80 hover:text-card-foreground transition-colors cursor-pointer"
          >
            {t("dashboard.notifications.decline")}
          </button>
        </div>
      </div>
    </div>
  );
}
