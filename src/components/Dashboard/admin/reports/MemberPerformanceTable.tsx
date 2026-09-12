import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import type { AdminMemberPerformanceDto } from "../../../../dtos/admin/AdminReportDtos";

interface Props {
  members: AdminMemberPerformanceDto[];
  isLoadingMore: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export default function MemberPerformanceTable({
  members,
  isLoadingMore,
  hasNextPage,
  onLoadMore,
}: Props) {
  const { t } = useTranslation();

  const { ref: sentinelRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isLoadingMore) {
        onLoadMore();
      }
    },
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
            <th className="px-6 py-3 font-medium">
              {t("dashboard.reports.table.member")}
            </th>
            <th className="px-6 py-3 font-medium text-center">
              {t("dashboard.reports.table.assigned")}
            </th>
            <th className="px-6 py-3 font-medium text-center">
              {t("dashboard.reports.table.inProgress")}
            </th>
            <th className="px-6 py-3 font-medium text-center">
              {t("dashboard.reports.table.done")}
            </th>
            <th className="px-6 py-3 font-medium">
              {t("dashboard.reports.table.completion")}
            </th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-border/50">
          {members.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-8 text-center text-muted-foreground"
              >
                {t("dashboard.admin.reports.empty.noMembers")}
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-card-foreground">
                  {member.name}
                </td>
                <td className="px-6 py-4 text-center text-muted-foreground">
                  {member.assignedCount}
                </td>
                <td className="px-6 py-4 text-center text-muted-foreground">
                  {member.inProgressCount}
                </td>
                <td className="px-6 py-4 text-center text-muted-foreground">
                  {member.doneCount}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${member.completionPercentage}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {member.completionPercentage.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div ref={sentinelRef} className="h-4" />

      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            {t("dashboard.admin.reports.loadingMore")}
          </div>
        </div>
      )}
    </div>
  );
}
