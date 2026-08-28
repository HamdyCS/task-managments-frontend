export interface TaskAssignmentDto {
  id: number;
  assignedToId: string;
  assignedById: string;
  createdAt: string;
  unassignedAt: string | null;
  isActive: boolean;
}

export interface TaskAttachmentDto {
  id: number;
  name: string;
  url: string;
  createdAt: string;
}

export default interface TaskDto {
  id: number;
  name: string;
  description: string;
  deadline: string;
  taskStatus: string;
  taskPriority: string;
  createdAt: string;
  lastUpdatedAt: string | null;
  lastUpdatedById: string | null;
  projectId: number;
  createdById: string;
  assignments: TaskAssignmentDto[];
  attachments: TaskAttachmentDto[];
}
