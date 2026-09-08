export interface TasksOverviewDto {
  backlogCount: number;
  todoCount: number;
  inProgressCount: number;
  reviewCount: number;
  doneCount: number;
}

export interface AdminDashboardDto {
  totalUsersCount: number;
  totalAdminsCount: number;
  totalUsersInLast30DaysCount: number;
  totalWorkspacesCount: number;
  totalWorkspacesInLast30DaysCount: number;
  totalProjectsCount: number;
  totalProjectsInLast30DaysCount: number;
  totalTasksCount: number;
  totalTasksInLast30DaysCount: number;
  tasksOverviewDto: TasksOverviewDto;
}
