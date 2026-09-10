import { useQuery } from "@tanstack/react-query";
import { getWorkSpaceDetails } from "../../services/adminWorkspaceService";
import type WorkSpaceDetailsDto from "../../dtos/admin/WorkSpaceDetailsDto";

export function useAdminWorkspaceDetails(workspaceId: number | null) {
  return useQuery<WorkSpaceDetailsDto, Error>({
    queryKey: ["adminWorkspaceDetails", workspaceId],
    queryFn: () => getWorkSpaceDetails(workspaceId!),
    enabled: workspaceId !== null,
  });
}
