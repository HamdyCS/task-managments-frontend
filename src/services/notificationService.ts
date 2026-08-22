import { api } from "../api/Axios";
import config from "../config";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type { NotificationDto } from "../dtos/notification/NotificationDto";

export async function getNotifications(
  page: number,
  pageSize: number,
): Promise<PaginationResultDto<NotificationDto>> {
  const { data } = await api.get<PaginationResultDto<NotificationDto>>(
    config.notification.all(page, pageSize),
  );
  return data;
}

export async function getUnreadNotifications(
  page: number,
  pageSize: number,
): Promise<PaginationResultDto<NotificationDto>> {
  const { data } = await api.get<PaginationResultDto<NotificationDto>>(
    config.notification.unread(page, pageSize),
  );
  return data;
}

export async function markNotificationAsRead(id: number): Promise<void> {
  await api.put(config.notification.markRead(id));
}
