import { useInfiniteQuery } from "@tanstack/react-query";
import { getWorkspaceProjects } from "../../services/projectService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type ProjectDto from "../../dtos/project/ProjectDto";

const PAGE_SIZE = 20;

export default function useProjects(workspaceId: number | null) {
  return useInfiniteQuery<PaginationResultDto<ProjectDto>, Error>({
    queryKey: ["projects", workspaceId],
    queryFn: ({ pageParam = 1 }) =>
      getWorkspaceProjects(workspaceId!, pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
    enabled: workspaceId !== null,
  });
}
