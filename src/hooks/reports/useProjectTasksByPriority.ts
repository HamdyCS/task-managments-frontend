import { useQuery } from "@tanstack/react-query";
import { getProjectTasksByPriority } from "../../services/reportsService";
import type { TaskByPriorityDto } from "../../dtos/reports/ProjectReportDtos";
import type { AxiosError } from "axios";

export default function useProjectTasksByPriority(
  workspaceId: number | null,
  projectId: number | null,
) {
  return useQuery<TaskByPriorityDto[], AxiosError>({
    queryKey: ["project-tasks-by-priority", workspaceId, projectId],
    queryFn: () => getProjectTasksByPriority(workspaceId!, projectId!),
    enabled: workspaceId !== null && projectId !== null,
  });
}
