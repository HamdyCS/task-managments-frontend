import { useQuery } from "@tanstack/react-query";
import { getProjectMemberPerformance } from "../../services/reportsService";
import type MemberPerformanceDto from "../../dtos/reports/MemberPerformanceDto";
import type { AxiosError } from "axios";

export default function useProjectMemberPerformance(
  workspaceId: number | null,
  projectId: number | null,
  memberId: string | null,
) {
  return useQuery<MemberPerformanceDto, AxiosError>({
    queryKey: ["project-member-performance", workspaceId, projectId, memberId],
    queryFn: () =>
      getProjectMemberPerformance(workspaceId!, projectId!, memberId!),
    enabled: workspaceId !== null && projectId !== null && memberId !== null,
  });
}
