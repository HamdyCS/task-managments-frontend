import { useQuery } from "@tanstack/react-query";
import { getUserWorkspaces } from "../../services/workspaceService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type WorkSpaceDto from "../../dtos/workspace/WorkSpaceDto";

export default function useUserWorkspaces() {
  return useQuery<PaginationResultDto<WorkSpaceDto>, Error>({
    queryKey: ["userWorkspaces"],
    queryFn: getUserWorkspaces,
  });
}
