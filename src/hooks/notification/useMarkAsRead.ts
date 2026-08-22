import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { markNotificationAsRead } from "../../services/notificationService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type { NotificationDto } from "../../dtos/notification/NotificationDto";

export default function useMarkAsRead(
  callback: MutationCallBack<void, AxiosError>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => markNotificationAsRead(id),

    //Optimistic Update (ننفترض ان العملية هتنجح فبنحدث الكاش)
    onMutate: async (id) => {
      //Cancel any ongoing refetches for notifications (all and unread)
      await queryClient.cancelQueries({
        queryKey: ["notifications"],
      });

      //Get previous state
      const previousNotifications = queryClient.getQueryData<
        InfiniteData<PaginationResultDto<NotificationDto>>
      >(["notifications", "all"]);

      //if no previous data return
      if (!previousNotifications) {
        return { previousNotifications };
      }

      //mark notification as read without change previous data and state)
      const updatedNotifications: InfiniteData<
        PaginationResultDto<NotificationDto>
      > = {
        ...previousNotifications,

        pages: previousNotifications.pages.map((page) => ({
          ...page,

          data: page.data.map((notification) =>
            notification.id === id
              ? {
                  ...notification,
                  isRead: true,
                  readAt: new Date().toISOString(),
                }
              : notification,
          ),
        })),
      };

      //update the cache for unread notifications
      const previousUnreadNotifications = queryClient.getQueryData<
        InfiniteData<PaginationResultDto<NotificationDto>>
      >(["notifications", "unread"]);

      //if no previous data return
      if (!previousUnreadNotifications) {
        //update the cache
        queryClient.setQueryData(
          ["notifications", "all"],
          updatedNotifications,
        );
        return { previousNotifications };
      }

      const updatedUnreadNotifications: InfiniteData<
        PaginationResultDto<NotificationDto>
      > = {
        ...previousUnreadNotifications,

        pages: previousUnreadNotifications.pages.map((page) => ({
          ...page,

          data: page.data.filter((notification) => notification.id !== id),
        })),
      };

      //update the cache
      queryClient.setQueryData(["notifications", "all"], updatedNotifications);
      queryClient.setQueryData(
        ["notifications", "unread"],
        updatedUnreadNotifications,
      );

      // Return a context object with the previous data for rollback
      return { previousNotifications, previousUnreadNotifications };
    },

    // if mutation fails
    onError: (error: AxiosError, id, context) => {
      // Rollback to previous state
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications", "all"],
          context.previousNotifications,
        );
      }

      if (context?.previousUnreadNotifications) {
        queryClient.setQueryData(
          ["notifications", "unread"],
          context.previousUnreadNotifications,
        );
      }

      if (callback.onError) {
        callback.onError(error);
      }
    },

    onSuccess: (data, variables, context) => {
      if (callback.onSuccess) {
        callback.onSuccess(data);
      }
    },

    // if mutation succeeds or fails
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
}
