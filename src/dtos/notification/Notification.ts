import type { NotificationType } from "../../types/NotificationType";

export interface Notification {
  id: number;
  notifyToId: string;
  taskId: number | null;
  workSpaceInviteId: number | null;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  readAt: string | null;
  notificationType: NotificationType;
}
