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

export interface WorkSpaceDashboardDto {
  workspace: { id: number; name: string };
  stats: DashboardStats;
  tasksByStatusReportDtos: TaskByStatus[];
  tasksByPriorityReportDtos: TaskByPriority[];
  activeTasks: ActiveTask[];
  unReadNotifications: unknown[];
}
