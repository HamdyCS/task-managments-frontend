import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getWorkSpaceOverviews } from "../../services/adminWorkspaceService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type WorkSpaceOverviewDto from "../../dtos/admin/WorkSpaceOverviewDto";

const PAGE_SIZE = 10;

export function useAdminWorkspaces() {
  const [searchParams] = useSearchParams();

  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || PAGE_SIZE;
  const ownerName = searchParams.get("ownerName") || undefined;
  const workSpaceName = searchParams.get("workSpaceName") || undefined;

  const query = useQuery<PaginationResultDto<WorkSpaceOverviewDto>, Error>({
    queryKey: [
      "adminWorkspaces",
      { pageNumber, pageSize, ownerName, workSpaceName },
    ],
    queryFn: () => getWorkSpaceOverviews(pageNumber, pageSize, ownerName, workSpaceName),
    placeholderData: (prev) => prev,
  });

  return {
    ...query,
    pageNumber,
    pageSize,
    ownerName,
    workSpaceName,
  };
}
