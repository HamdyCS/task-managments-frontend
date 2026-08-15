import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadNotifications,
} from "../../services/notificationService";
import type { Notification } from "../../dtos/notification/Notification";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type { NotificationFilter } from "../../types/NotificationFilter";

const PAGE_SIZE = 20;

export function useNotifications(filter: NotificationFilter) {
  return useInfiniteQuery<PaginationResultDto<Notification>, Error>({
    queryKey: ["notifications", filter],
    queryFn: ({ pageParam = 1 }) =>
      filter === "unread"
        ? getUnreadNotifications(pageParam as number, PAGE_SIZE)
        : getNotifications(pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
  });
}
