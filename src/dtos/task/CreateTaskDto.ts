export interface CreateTaskDto {
  name: string;
  description?: string;
  deadline?: string;
  priority: string;
  assignedUserId?: string;
}
