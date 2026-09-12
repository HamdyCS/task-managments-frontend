import { authApi } from "../api/Axios";
import config from "../config";
import type { WorkSpacesOverviewReportDto } from "../dtos/admin/AdminReportDtos";
import type { AdminMemberPerformanceDto } from "../dtos/admin/AdminReportDtos";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";

export async function getAdminReportsOverview(
  from?: string,
  to?: string,
): Promise<WorkSpacesOverviewReportDto> {
  const { data } = await authApi.get<WorkSpacesOverviewReportDto>(
    config.admin.reports.overview(from, to),
  );
  return data;
}

export async function getAdminMemberPerformances(
  pageNumber: number,
  pageSize: number,
  memberName?: string,
): Promise<PaginationResultDto<AdminMemberPerformanceDto>> {
  const { data } = await authApi.get<PaginationResultDto<AdminMemberPerformanceDto>>(
    config.admin.reports.memberPerformances(pageNumber, pageSize, memberName),
  );
  return data;
}
