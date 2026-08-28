import { api } from "../api/Axios";
import config from "../config";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type WorkSpaceUserDto from "../dtos/workspace/WorkSpaceUserDto";

export async function getWorkspaceUsers(
  workspaceId: number,
): Promise<PaginationResultDto<WorkSpaceUserDto>> {
  const { data } = await api.get<PaginationResultDto<WorkSpaceUserDto>>(
    `${config.workspace.allUsers(workspaceId)}?pageNumber=1&pageSize=100`,
  );
  return data;
}
