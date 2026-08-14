import { api } from "../api/Axios";
import config from "../config";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type WorkSpaceDto from "../dtos/workspace/WorkSpaceDto";
import type { WorkSpaceDashboardDto } from "../dtos/workspace/WorkSpaceDashboardDto";

export async function getUserWorkspaces(): Promise<PaginationResultDto<WorkSpaceDto>> {
  const { data } = await api.get<PaginationResultDto<WorkSpaceDto>>(config.workspace.all);
  return data;
}

export async function getWorkspaceDashboard(workspaceId: number): Promise<WorkSpaceDashboardDto> {
  const { data } = await api.get<WorkSpaceDashboardDto>(config.workspace.dashboard(workspaceId));
  return data;
}
