import { useQuery } from "@tanstack/react-query";
import { getProjectTasksByStatus } from "../../services/reportsService";
import type { TaskByStatusDto } from "../../dtos/reports/ProjectReportDtos";
import type { AxiosError } from "axios";

export default function useProjectTasksByStatus(
  workspaceId: number | null,
  projectId: number | null,
) {
  return useQuery<TaskByStatusDto[], AxiosError>({
    queryKey: ["project-tasks-by-status", workspaceId, projectId],
    queryFn: () => getProjectTasksByStatus(workspaceId!, projectId!),
    enabled: workspaceId !== null && projectId !== null,
  });
}
