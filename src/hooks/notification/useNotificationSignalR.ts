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
      queryClient.invalidateQueries({
        queryKey: ["notifications", "all"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread"],
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
