import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyReceivedInvites } from "../../services/teamService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type { WorkSpaceInviteDto } from "../../dtos/workspace/WorkSpaceInviteDto";

const PAGE_SIZE = 20;

export function useMyReceivedInvites() {
  return useInfiniteQuery<PaginationResultDto<WorkSpaceInviteDto>, Error>({
    queryKey: ["teamReceivedInvites"],
    queryFn: ({ pageParam = 1 }) =>
      getMyReceivedInvites(pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
  });
}
