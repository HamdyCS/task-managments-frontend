export interface TasksByPriorityReportDto {
  taskPriority: string;
  count: number;
}

export interface TasksByStatusReportDto {
  taskStatus: string;
  count: number;
}

export interface WorkSpacesOverviewReportDto {
  regularUsersCount: number;
  workspacesCount: number;
  projectsCount: number;
  tasksCount: number;
  tasksByPriorityReportDtos: TasksByPriorityReportDto[];
  tasksByStatusReportDtos: TasksByStatusReportDto[];
}

export interface AdminMemberPerformanceDto {
  id: string;
  name: string;
  assignedCount: number;
  inProgressCount: number;
  doneCount: number;
  completionPercentage: number;
}
