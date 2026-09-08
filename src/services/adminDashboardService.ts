import { authApi } from "../api/Axios";
import config from "../config";
import type { AdminDashboardDto } from "../dtos/admin/AdminDashboardDto";
import type { RecentActivityDto } from "../dtos/admin/RecentActivityDto";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";

export async function getAdminDashboard(): Promise<AdminDashboardDto> {
  const { data } = await authApi.get<AdminDashboardDto>(config.admin.dashboard);
  return data;
}

export async function getAdminRecentActivities(
  page: number,
  pageSize: number,
): Promise<PaginationResultDto<RecentActivityDto>> {
  const { data } = await authApi.get<PaginationResultDto<RecentActivityDto>>(
    config.admin.recentActivities(page, pageSize),
  );
  return data;
}
