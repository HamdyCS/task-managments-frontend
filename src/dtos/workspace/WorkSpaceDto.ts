export default interface WorkSpaceDto {
  id: number;
  name: string;
  description: string;
  createdById: string;
  createdAt: string;
  lastUpdatedById: string | null;
  lastUpdatedAt: string | null;
}
