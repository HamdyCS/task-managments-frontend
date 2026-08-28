import { api, authApi } from "../api/Axios";
import config from "../config";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type TaskDto from "../dtos/task/TaskDto";
import type TaskQueryParams from "../dtos/task/TaskQueryParams";
import type { CreateTaskDto } from "../dtos/task/CreateTaskDto";
import type { UpdateTaskDto } from "../dtos/task/UpdateTaskDto";

function buildTaskQueryParams(params: TaskQueryParams): string {
  const query = new URLSearchParams();
  query.set("pageNumber", String(params.pageNumber));
  query.set("pageSize", String(params.pageSize));
  if (params.status) query.set("status", params.status);
  if (params.priority) query.set("priority", params.priority);
  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  return query.toString();
}

export async function getProjectTasks(
  workspaceId: number,
  projectId: number,
  params: TaskQueryParams,
): Promise<PaginationResultDto<TaskDto>> {
  const queryString = buildTaskQueryParams(params);
  const { data } = await authApi.get<PaginationResultDto<TaskDto>>(
    `${config.task.all(workspaceId, projectId)}?${queryString}`,
  );
  return data;
}

export async function getMyTasks(
  workspaceId: number,
  projectId: number,
  params: TaskQueryParams,
): Promise<PaginationResultDto<TaskDto>> {
  const queryString = buildTaskQueryParams(params);
  const { data } = await authApi.get<PaginationResultDto<TaskDto>>(
    `${config.task.my(workspaceId, projectId)}?${queryString}`,
  );
  return data;
}

export async function getTask(
  workspaceId: number,
  projectId: number,
  taskId: number,
): Promise<TaskDto> {
  const { data } = await authApi.get<TaskDto>(
    config.task.single(workspaceId, projectId, taskId),
  );
  return data;
}

export async function createTask(
  workspaceId: number,
  projectId: number,
  createTaskDto: CreateTaskDto,
): Promise<TaskDto> {
  const { data } = await authApi.post<TaskDto>(
    config.task.all(workspaceId, projectId),
    createTaskDto,
  );
  return data;
}

export async function updateTask(
  workspaceId: number,
  projectId: number,
  taskId: number,
  updateTaskDto: UpdateTaskDto,
): Promise<TaskDto> {
  const { data } = await authApi.put<TaskDto>(
    config.task.single(workspaceId, projectId, taskId),
    updateTaskDto,
  );
  return data;
}

export async function deleteTask(
  workspaceId: number,
  projectId: number,
  taskId: number,
): Promise<void> {
  await authApi.delete(config.task.single(workspaceId, projectId, taskId));
}

export async function changeTaskStatus(
  workspaceId: number,
  projectId: number,
  taskId: number,
  status: string,
  isSelf: boolean,
): Promise<TaskDto> {
  const endpoint = isSelf
    ? config.task.selfStatus(workspaceId, projectId, taskId)
    : config.task.status(workspaceId, projectId, taskId);
  const { data } = await authApi.patch<TaskDto>(endpoint, { status });
  return data;
}

export async function assignTask(
  workspaceId: number,
  projectId: number,
  taskId: number,
  userId: string,
): Promise<{ assignments: TaskDto["assignments"] }> {
  const { data } = await authApi.post<{ assignments: TaskDto["assignments"] }>(
    config.task.assign(workspaceId, projectId, taskId),
    { userId },
  );
  return data;
}

export async function unassignTask(
  workspaceId: number,
  projectId: number,
  taskId: number,
  userId: string,
): Promise<void> {
  await authApi.delete(
    config.task.unassign(workspaceId, projectId, taskId, userId),
  );
}
