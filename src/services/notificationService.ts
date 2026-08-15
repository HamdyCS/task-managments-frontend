import { api } from "../api/Axios";
import config from "../config";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type { Notification } from "../dtos/notification/Notification";

export async function getNotifications(
  page: number,
  pageSize: number,
): Promise<PaginationResultDto<Notification>> {
  const { data } = await api.get<PaginationResultDto<Notification>>(
    config.notification.all(page, pageSize),
  );
  return data;
}

export async function getUnreadNotifications(
  page: number,
  pageSize: number,
): Promise<PaginationResultDto<Notification>> {
  const { data } = await api.get<PaginationResultDto<Notification>>(
    config.notification.unread(page, pageSize),
  );
  return data;
}

export async function markNotificationAsRead(id: number): Promise<void> {
  await api.put(config.notification.markRead(id));
}
