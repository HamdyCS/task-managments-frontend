import { useEffect } from "react";
import { HubConnectionBuilder, type HubConnection } from "@microsoft/signalr";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";

import config from "../../config";
import type { NotificationDto } from "../../dtos/notification/NotificationDto";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";

export default function useNotificationSignalR() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const connection: HubConnection = new HubConnectionBuilder()
      .withUrl(config.SignalRUrl, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    const updateCacheNotifications = (notification: NotificationDto) => {
      // =========================
      // All Notifications
      // =========================

      queryClient.setQueryData<
        InfiniteData<PaginationResultDto<NotificationDto>>
      >(["notifications", "all"], (previousNotifications) => {
        if (!previousNotifications) {
          return previousNotifications;
        }

        return {
          ...previousNotifications,
          pages: previousNotifications.pages.map((page, index) => {
            //if not first page return page as is
            if (index !== 0) {
              return page;
            }

            //add notification to be first element in first page
            return {
              ...page,
              data: [notification, ...page.data],
            };
          }),
        };
      });

      // =========================
      // Unread Notifications
      // =========================

      queryClient.setQueryData<
        InfiniteData<PaginationResultDto<NotificationDto>>
      >(["notifications", "unread"], (previousUnreadNotifications) => {
        if (!previousUnreadNotifications) {
          return previousUnreadNotifications;
        }

        return {
          ...previousUnreadNotifications,
          pages: previousUnreadNotifications.pages.map((page, index) => {
            //if not first page return page as is
            if (index !== 0) {
              return page;
            }

            //add notification to be first element in first page
            return {
              ...page,
              data: [notification, ...page.data],
            };
          }),
        };
      });
    };

    const startConnection = async () => {
      try {
        connection.on("ReceiveNotification", updateCacheNotifications);

        await connection.start();
      } catch (err) {
        console.error("SignalR connection failed:", err);
      }
    };

    startConnection();

    return () => {
      connection.off("ReceiveNotification", updateCacheNotifications);

      connection.stop();
    };
  }, [queryClient]);
}
