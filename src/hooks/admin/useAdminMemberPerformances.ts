import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAdminMemberPerformances } from "../../services/adminReportsService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type { AdminMemberPerformanceDto } from "../../dtos/admin/AdminReportDtos";

const PAGE_SIZE = 20;

export function useAdminMemberPerformances(memberName?: string) {
  const query = useInfiniteQuery<PaginationResultDto<AdminMemberPerformanceDto>, Error>({
    queryKey: ["adminMemberPerformances", memberName],
    queryFn: ({ pageParam = 1 }) =>
      getAdminMemberPerformances(pageParam as number, PAGE_SIZE, memberName),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
  });

  const allMembers = useMemo(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const isLoadingMore = query.isFetching && !query.isLoading;

  return {
    ...query,
    allMembers,
    isLoadingMore,
  };
}
