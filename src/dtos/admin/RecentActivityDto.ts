export type RecentActivityType =
  | "UserRegistered"
  | "WorkspaceCreated"
  | "WorkSpaceDeleted"
  | "JoinedWorkspace"
  | "ProjectCreated"
  | "ProjectDeleted"
  | "TaskCompleted";

export interface RecentActivityDto {
  id: number;
  text: string;
  activityType: RecentActivityType;
  createdAt: string;
}
