import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiUserPlus,
  FiBriefcase,
  FiTrash2,
  FiUserCheck,
  FiGrid,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
import { fadeIn } from "../../../../animations";
import { useAdminRecentActivities } from "../../../../hooks/admin/useAdminRecentActivities";
import { formatTimeAgo } from "../../../../utils/formatTimeAgo";
import type { RecentActivityType } from "../../../../dtos/admin/RecentActivityDto";

function getActivityIcon(type: RecentActivityType) {
  switch (type) {
    case "UserRegistered":
      return <FiUserPlus size={14} />;
    case "WorkspaceCreated":
      return <FiBriefcase size={14} />;
    case "WorkSpaceDeleted":
      return <FiTrash2 size={14} />;
    case "JoinedWorkspace":
      return <FiUserCheck size={14} />;
    case "ProjectCreated":
      return <FiGrid size={14} />;
    case "ProjectDeleted":
      return <FiX size={14} />;
    case "TaskCompleted":
      return <FiCheckCircle size={14} />;
    default:
      return <FiBriefcase size={14} />;
  }
}

function getActivityColors(type: RecentActivityType): {
  bg: string;
  text: string;
  title: string;
} {
  switch (type) {
    case "UserRegistered":
      return { bg: "bg-primary/10", text: "text-primary", title: "text-primary" };
    case "WorkspaceCreated":
      return { bg: "bg-success/10", text: "text-success", title: "text-success" };
    case "WorkSpaceDeleted":
      return { bg: "bg-destructive/10", text: "text-destructive", title: "text-destructive" };
    case "JoinedWorkspace":
      return { bg: "bg-primary/10", text: "text-primary", title: "text-primary" };
    case "ProjectCreated":
      return { bg: "bg-success/10", text: "text-success", title: "text-success" };
    case "ProjectDeleted":
      return { bg: "bg-destructive/10", text: "text-destructive", title: "text-destructive" };
    case "TaskCompleted":
      return { bg: "bg-success/10", text: "text-success", title: "text-success" };
    default:
      return { bg: "bg-muted", text: "text-muted-foreground", title: "text-muted-foreground" };
  }
}

export default function AdminRecentActivity() {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useAdminRecentActivities();

  const { ref: sentinelRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const activities = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-card border rounded-xl p-6 shadow-sm flex flex-col"
    >
      <h2 className="font-semibold text-lg text-card-foreground mb-6">
        {t("dashboard.admin.recentActivity.title")}
      </h2>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted animate-pulse shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse mb-1 w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.admin.recentActivity.empty")}
          </p>
        ) : (
          <>
            {activities.map((activity) => {
              const colors = getActivityColors(activity.activityType);
              return (
                <div key={activity.id} className="flex gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}
                  >
                    {getActivityIcon(activity.activityType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-relaxed ${colors.title}`}>
                      {activity.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatTimeAgo(activity.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={sentinelRef} className="h-2" />
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
