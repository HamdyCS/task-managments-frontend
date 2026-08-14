import type { Notification } from "../notification/Notification";

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  completionRate: number;
}

export interface TaskByStatus {
  taskStatus: string;
  count: number;
}

export interface TaskByPriority {
  taskPriority: string;
  count: number;
}

export interface ActiveTask {
  id: number;
  name: string;
  projectName: string;
  priority: string;
  status: string;
  createdAt: string;
  deadLine: string;
}

export interface DashboardDto {
  workspace: { id: number; name: string };
  stats: DashboardStats;
  tasksByStatusReportDtos: TaskByStatus[];
  tasksByPriorityReportDtos: TaskByPriority[];
  latestActiveTasks: ActiveTask[];
  unReadNotifications: Notification[];
}
