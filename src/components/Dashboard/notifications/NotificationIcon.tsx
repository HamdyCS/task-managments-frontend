import {
  FiUserPlus,
  FiUserMinus,
  FiActivity,
  FiEdit,
  FiMessageSquare,
  FiClock,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import type { NotificationType } from "../../../types/NotificationType";

interface IconConfig {
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const iconMap: Record<NotificationType, IconConfig> = {
  TaskAssigned: {
    icon: <FiUserPlus size={16} />,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  TaskUnassigned: {
    icon: <FiUserMinus size={16} />,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  TaskStatusUpdated: {
    icon: <FiActivity size={16} />,
    color: "text-success",
    bg: "bg-success/10",
  },
  TaskUpdated: {
    icon: <FiEdit size={16} />,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  CommentAdded: {
    icon: <FiMessageSquare size={16} />,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  DueDateReminder: {
    icon: <FiClock size={16} />,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  TaskDeleted: {
    icon: <FiTrash2 size={16} />,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  WorkSpaceInvite: {
    icon: <FiUsers size={16} />,
    color: "text-success",
    bg: "bg-success/10",
  },
};

export default function NotificationIcon({
  type,
}: {
  type: NotificationType;
}) {
  const config = iconMap[type] ?? iconMap.TaskAssigned;
  return (
    <span
      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}
    >
      {config.icon}
    </span>
  );
}
