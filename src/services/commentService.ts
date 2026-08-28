import { api } from "../api/Axios";
import config from "../config";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type TaskCommentDto from "../dtos/task/TaskCommentDto";

export async function getTaskComments(
  workspaceId: number,
  projectId: number,
  taskId: number,
  pageNumber: number = 1,
  pageSize: number = 20,
): Promise<PaginationResultDto<TaskCommentDto>> {
  const { data } = await api.get<PaginationResultDto<TaskCommentDto>>(
    `${config.task.comments(workspaceId, projectId, taskId)}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
  return data;
}

export async function addComment(
  workspaceId: number,
  projectId: number,
  taskId: number,
  comment: string,
): Promise<TaskCommentDto> {
  const { data } = await api.post<TaskCommentDto>(
    config.task.comments(workspaceId, projectId, taskId),
    { comment },
  );
  return data;
}

export async function updateComment(
  workspaceId: number,
  projectId: number,
  taskId: number,
  commentId: number,
  comment: string,
): Promise<TaskCommentDto> {
  const { data } = await api.put<TaskCommentDto>(
    config.task.comment(workspaceId, projectId, taskId, commentId),
    { comment },
  );
  return data;
}

export async function deleteComment(
  workspaceId: number,
  projectId: number,
  taskId: number,
  commentId: number,
): Promise<void> {
  await api.delete(
    config.task.comment(workspaceId, projectId, taskId, commentId),
  );
}
