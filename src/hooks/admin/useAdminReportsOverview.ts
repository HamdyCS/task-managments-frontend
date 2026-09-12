import { useQuery } from "@tanstack/react-query";
import { getAdminReportsOverview } from "../../services/adminReportsService";
import type { WorkSpacesOverviewReportDto } from "../../dtos/admin/AdminReportDtos";
import type { AxiosError } from "axios";

export default function useAdminReportsOverview(
  from?: string,
  to?: string,
) {
  return useQuery<WorkSpacesOverviewReportDto, AxiosError>({
    queryKey: ["adminReportsOverview", from, to],
    queryFn: () => getAdminReportsOverview(from, to),
  });
}
