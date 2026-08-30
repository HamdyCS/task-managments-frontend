import { useNavigate, useSearchParams } from "react-router-dom";
import type { NotificationDto } from "../../../dtos/notification/NotificationDto";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";
import NotificationIcon from "./NotificationIcon";
import useMarkAsRead from "../../../hooks/notification/useMarkAsRead";

interface NotificationItemProps {
  notification: NotificationDto;
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const { mutate: markAsRead } = useMarkAsRead({
    onError: () => {
      notification.isRead = false;
    },
  });

  function handleClick() {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.notificationType === "TaskUnassigned" || 
      notification.notificationType === "TaskStatusUpdated"
      ||
      notification.notificationType === "TaskUpdated"
      ||
      notification.notificationType === "CommentAdded"
      ||
      notification.notificationType === "DueDateReminder"
      ||
      notification.notificationType === "TaskDeleted"
    )
    if (notification.taskId) {
      navigate(`/dashboard/tasks?workspaceId=${workspaceId}`);
    }
  }

  if (notification.notificationType === "WorkSpaceInvite") {
    return null; // rendered by WorkspaceInviteNotification
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-start gap-3.5 p-4 rounded-xl text-start transition-colors cursor-pointer group ${
        notification.isRead
          ? "bg-card hover:bg-accent/50"
          : "bg-primary/20 hover:bg-primary/25"
      }`}
    >
      <NotificationIcon type={notification.notificationType} />

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
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <span className="text-xs text-muted-foreground/70 mt-1 block">
          {formatTimeAgo(notification.createdAt)}
        </span>
      </div>
    </button>
  );
}
