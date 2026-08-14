import { useQuery } from "@tanstack/react-query";
import { getWorkspaceDashboard } from "../../services/workspaceService";
import type { DashboardDto } from "../../dtos/workspace/DashboardDto";
import type { AxiosError } from "axios";

export default function useDashboard(workspaceId: number | null) {
  return useQuery<DashboardDto, AxiosError>({
    queryKey: ["workspaceDashboard", workspaceId],
    queryFn: () => getWorkspaceDashboard(workspaceId!),
    enabled: workspaceId !== null,
  });
}
