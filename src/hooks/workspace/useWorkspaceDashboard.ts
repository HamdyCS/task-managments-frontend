import { useQuery } from "@tanstack/react-query";
import { getWorkspaceDashboard } from "../../services/workspaceService";
import type { WorkSpaceDashboardDto } from "../../dtos/workspace/WorkSpaceDashboardDto";
import type { AxiosError } from "axios";

export default function useWorkspaceDashboard(workspaceId: number | null) {
  return useQuery<WorkSpaceDashboardDto, AxiosError>({
    queryKey: ["workspaceDashboard", workspaceId],
    queryFn: () => getWorkspaceDashboard(workspaceId!),
    enabled: workspaceId !== null,   
  });
}
