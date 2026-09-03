import { useQuery } from "@tanstack/react-query";
import { getMemberPerformance } from "../../services/reportsService";
import type MemberPerformanceDto from "../../dtos/reports/MemberPerformanceDto";
import type { AxiosError } from "axios";

export default function useMemberPerformance(
  workspaceId: number | null,
  memberId: string | null,
) {
  return useQuery<MemberPerformanceDto, AxiosError>({
    queryKey: ["member-performance", workspaceId, memberId],
    queryFn: () => getMemberPerformance(workspaceId!, memberId!),
    enabled: workspaceId !== null && memberId !== null,
  });
}
