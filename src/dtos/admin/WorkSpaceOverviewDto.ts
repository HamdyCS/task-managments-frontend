export default interface WorkSpaceOverviewDto {
  id: number;
  name: string;
  ownersNames: string[];
  membersCount: number;
  projectsCount: number;
  tasksCount: number;
  createdAt: string;
}
