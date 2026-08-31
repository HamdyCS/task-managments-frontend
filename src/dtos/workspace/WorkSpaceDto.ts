export default interface WorkSpaceDto {
  id: number;
  name: string;
  description: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  lastUpdatedById: string | null;
  lastUpdatedAt: string | null;
}
