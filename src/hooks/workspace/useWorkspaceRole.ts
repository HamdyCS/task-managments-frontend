import { useQuery } from "@tanstack/react-query";
import { getWorkspaceRole } from "../../services/workspaceService";
import type { WorkSpaceRole } from "../../types/WorkSpaceRole";
import type { AxiosError } from "axios";

export default function useWorkspaceRole(workspaceId: number | null) {
  return useQuery<WorkSpaceRole, AxiosError>({
    queryKey: ["workspaceRole", workspaceId],
    queryFn: () => getWorkspaceRole(workspaceId!),
    enabled: workspaceId !== null,
  });
}
