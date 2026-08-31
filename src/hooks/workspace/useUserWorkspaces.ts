import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserWorkspaces } from "../../services/workspaceService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type WorkSpaceDto from "../../dtos/workspace/WorkSpaceDto";

const PAGE_SIZE = 20;

export default function useUserWorkspaces() {
  return useInfiniteQuery<PaginationResultDto<WorkSpaceDto>, Error>({
    queryKey: ["userWorkspaces"],
    queryFn: ({ pageParam = 1 }) =>
      getUserWorkspaces(pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
  });
}
