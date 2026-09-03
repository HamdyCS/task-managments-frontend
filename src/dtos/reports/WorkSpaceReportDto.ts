export interface MemberPerformanceDto {
  id: string;
  name: string;
  assignedCount: number;
  inProgressCount: number;
  doneCount: number;
  completionPercentage: number;
}

export default interface WorkSpaceReportDto {
  workSpaceName: string;
  ownerNames: string[];

  totalProjects: number;
  totalMembers: number;
  totalTasks: number;

  totalBacklogTasks: number;
  totalTodoTasks: number;
  totalInProgressTasks: number;
  totalReviewTasks: number;
  totalDoneTasks: number;

  memberPerformances: MemberPerformanceDto[];
}
