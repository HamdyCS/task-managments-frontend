import { useInfiniteQuery } from "@tanstack/react-query";
import { getMySentInvites } from "../../services/teamService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type { WorkSpaceInviteDto } from "../../dtos/workspace/WorkSpaceInviteDto";

const PAGE_SIZE = 20;

export function useMySentInvites() {
  return useInfiniteQuery<PaginationResultDto<WorkSpaceInviteDto>, Error>({
    queryKey: ["teamSentInvites"],
    queryFn: ({ pageParam = 1 }) =>
      getMySentInvites(pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
  });
}
