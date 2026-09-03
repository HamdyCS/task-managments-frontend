import { useQuery } from "@tanstack/react-query";
import { getWorkspaceReport } from "../../services/reportsService";
import type WorkSpaceReportDto from "../../dtos/reports/WorkSpaceReportDto";
import type { AxiosError } from "axios";

export default function useWorkspaceReport(workspaceId: number | null) {
  return useQuery<WorkSpaceReportDto, AxiosError>({
    queryKey: ["workspace-report", workspaceId],
    queryFn: () => getWorkspaceReport(workspaceId!),
    enabled: workspaceId !== null,
  });
}
