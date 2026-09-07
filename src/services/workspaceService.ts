import { authApi } from "../api/Axios";
import config from "../config";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type WorkSpaceDto from "../dtos/workspace/WorkSpaceDto";
import type CreateWorkspaceDto from "../dtos/workspace/CreateWorkspaceDto";
import type UpdateWorkspaceDto from "../dtos/workspace/UpdateWorkspaceDto";
import type { DashboardDto } from "../dtos/workspace/DashboardDto";
import type { WorkSpaceRole } from "../types/WorkSpaceRole";

export async function getUserWorkspaces(
  page = 1,
  pageSize = 100,
): Promise<PaginationResultDto<WorkSpaceDto>> {
  const { data } = await authApi.get<PaginationResultDto<WorkSpaceDto>>(
    config.workspace.all(page, pageSize),
  );
  return data;
}

export async function getWorkspaceById(id: number): Promise<WorkSpaceDto> {
  const { data } = await authApi.get<WorkSpaceDto>(config.workspace.single(id));
  return data;
}

export async function createWorkspace(
  dto: CreateWorkspaceDto,
): Promise<WorkSpaceDto> {
  const { data } = await authApi.post<WorkSpaceDto>(
    config.workspace.create,
    dto,
  );
  return data;
}

export async function updateWorkspace(
  id: number,
  dto: UpdateWorkspaceDto,
): Promise<WorkSpaceDto> {
  const { data } = await authApi.put<WorkSpaceDto>(
    config.workspace.update(id),
    dto,
  );
  return data;
}

export async function deleteWorkspace(id: number): Promise<void> {
  await authApi.delete(config.workspace.delete(id));
}

export async function getWorkspaceDashboard(
  workspaceId: number,
): Promise<DashboardDto> {
  const { data } = await authApi.get<DashboardDto>(
    config.workspace.dashboard(workspaceId),
  );
  return data;
}

export async function getWorkspaceRole(
  workspaceId: number,
): Promise<WorkSpaceRole> {
  const { data } = await authApi.get<WorkSpaceRole>(
    config.workspace.myRole(workspaceId),
  );
  return data;
}
