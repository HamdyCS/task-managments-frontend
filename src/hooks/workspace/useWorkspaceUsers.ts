import { useQuery } from "@tanstack/react-query";
import { getWorkspaceUsers } from "../../services/workspaceUserService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type WorkSpaceUserDto from "../../dtos/workspace/WorkSpaceUserDto";

export default function useWorkspaceUsers(workspaceId: number | null) {
  return useQuery<PaginationResultDto<WorkSpaceUserDto>, Error>({
    queryKey: ["workspaceUsers", workspaceId],
    queryFn: () => getWorkspaceUsers(workspaceId!),
    enabled: workspaceId !== null,
  });
}
