import { api } from "../api/Axios";
import config from "../config";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type WorkSpaceDto from "../dtos/workspace/WorkSpaceDto";
import type { DashboardDto } from "../dtos/workspace/DashboardDto";

export async function getUserWorkspaces(): Promise<
  PaginationResultDto<WorkSpaceDto>
> {
  const { data } = await api.get<PaginationResultDto<WorkSpaceDto>>(
    config.workspace.all,
  );
  return data;
}

export async function getWorkspaceDashboard(
  workspaceId: number,
): Promise<DashboardDto> {
  const { data } = await api.get<DashboardDto>(
    config.workspace.dashboard(workspaceId),
  );
  return data;
}
