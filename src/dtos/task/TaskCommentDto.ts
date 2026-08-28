export default interface TaskCommentDto {
  id: number;
  comment: string;
  taskId: number;
  commentById: string;
  commentByName: string;
  createdAt: string;
  lastUpdatedAt: string | null;
}
