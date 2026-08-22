import React from "react";
import { useNotifications } from "../hooks/notification/useNotifications";
import useNotificationSignalR from "../hooks/notification/useNotificationSignalR";

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useNotifications("all");

  //set up real time notifications
  useNotificationSignalR();

  return <div>{children}</div>;
}
