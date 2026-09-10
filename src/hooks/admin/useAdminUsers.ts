import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../services/adminUserService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type AdminUserDto from "../../dtos/admin/AdminUserDto";

const PAGE_SIZE = 20;

export function useAllUsers() {
  const query = useInfiniteQuery<PaginationResultDto<AdminUserDto>, Error>({
    queryKey: ["adminUsers"],
    queryFn: ({ pageParam = 1 }) =>
      getAllUsers(pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
  });

  const allUsers = useMemo(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const admins = useMemo(
    () => allUsers.filter((u) => u.role === "Admin"),
    [allUsers],
  );

  const regularUsers = useMemo(
    () => allUsers.filter((u) => u.role === "User"),
    [allUsers],
  );

  const isLoadingMore = query.isFetching && !query.isLoading;

  return {
    ...query,
    allUsers,
    admins,
    regularUsers,
    isLoadingMore,
  };
}
