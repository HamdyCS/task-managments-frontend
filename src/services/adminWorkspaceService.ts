import { authApi } from "../api/Axios";
import config from "../config";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type WorkSpaceOverviewDto from "../dtos/admin/WorkSpaceOverviewDto";
import type WorkSpaceDetailsDto from "../dtos/admin/WorkSpaceDetailsDto";

export async function getWorkSpaceOverviews(
  pageNumber: number,
  pageSize: number,
  ownerName?: string,
  workSpaceName?: string,
): Promise<PaginationResultDto<WorkSpaceOverviewDto>> {
  const { data } = await authApi.get<PaginationResultDto<WorkSpaceOverviewDto>>(
    config.admin.workspaces.overviews(pageNumber, pageSize, ownerName, workSpaceName),
  );
  return data;
}

export async function getWorkSpaceDetails(
  workSpaceId: number,
): Promise<WorkSpaceDetailsDto> {
  const { data } = await authApi.get<WorkSpaceDetailsDto>(
    config.admin.workspaces.details(workSpaceId),
  );
  return data;
}
