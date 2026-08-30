import { useInfiniteQuery } from "@tanstack/react-query";
import { getWorkspaceMembers } from "../../services/teamService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type WorkSpaceUserDto from "../../dtos/workspace/WorkSpaceUserDto";

const PAGE_SIZE = 20;

export function useTeamMembers(workspaceId: number | null) {
  return useInfiniteQuery<PaginationResultDto<WorkSpaceUserDto>, Error>({
    queryKey: ["teamMembers", workspaceId],
    queryFn: ({ pageParam = 1 }) =>
      getWorkspaceMembers(workspaceId!, pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
    enabled: workspaceId !== null,
  });
}
