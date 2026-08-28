export default interface ProjectDto {
  id: number;
  name: string;
  description: string;
  status: string;
  workSpaceId: number;
  createdById: string;
  createdAt: string;
  lastUpdatedById: string | null;
  lastUpdatedAt: string | null;
}
