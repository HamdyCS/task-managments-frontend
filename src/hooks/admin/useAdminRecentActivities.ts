import { useInfiniteQuery } from "@tanstack/react-query";
import { getAdminRecentActivities } from "../../services/adminDashboardService";
import type { RecentActivityDto } from "../../dtos/admin/RecentActivityDto";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";

const PAGE_SIZE = 10;

export function useAdminRecentActivities() {
  return useInfiniteQuery<PaginationResultDto<RecentActivityDto>, Error>({
    queryKey: ["adminRecentActivities"],
    queryFn: ({ pageParam = 1 }) =>
      getAdminRecentActivities(pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
    staleTime: 10 * 60 * 1000,
  });
}
