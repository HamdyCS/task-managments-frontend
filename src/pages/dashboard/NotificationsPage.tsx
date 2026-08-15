import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../animations";
import { useNotifications } from "../../hooks/notification/useNotifications";
import NotificationItem from "../../components/Dashboard/notifications/NotificationItem";
import WorkspaceInviteNotification from "../../components/Dashboard/notifications/WorkspaceInviteNotification";
import NotificationSkeleton from "../../components/Dashboard/notifications/NotificationSkeleton";
import NotificationEmptyState from "../../components/Dashboard/notifications/NotificationEmptyState";
import type { NotificationFilter } from "../../types/NotificationFilter";

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useNotifications(filter);

  const { ref: sentinelRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];
  const isLoadingMore = isFetching && !isLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-card-foreground">
          {t("dashboard.notifications.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("dashboard.notifications.subtitle")}
        </p>
      </div>

      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            filter === "all"
              ? "bg-card text-card-foreground shadow-sm"
              : "text-muted-foreground hover:text-card-foreground"
          }`}
        >
          {t("dashboard.notifications.filters.all")}
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            filter === "unread"
              ? "bg-card text-card-foreground shadow-sm"
              : "text-muted-foreground hover:text-card-foreground"
          }`}
        >
          {t("dashboard.notifications.filters.unread")}
        </button>
      </div>

      {isLoading ? (
        <NotificationSkeleton />
      ) : notifications.length === 0 ? (
        <NotificationEmptyState type={filter} />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {notifications.map((notification) => (
            <motion.div key={notification.id} variants={staggerItem}>
              {notification.notificationType === "WorkSpaceInvite" ? (
                <WorkspaceInviteNotification notification={notification} />
              ) : (
                <NotificationItem notification={notification} />
              )}
            </motion.div>
          ))}

          <div ref={sentinelRef} className="h-4" />

          {isLoadingMore && (
            <div className="flex justify-center py-4">
              <span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
