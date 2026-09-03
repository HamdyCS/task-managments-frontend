import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../animations";
import type { MemberPerformanceDto } from "../../../../dtos/reports/WorkSpaceReportDto";

interface Props {
  members: MemberPerformanceDto[];
}

export default function MemberPerformanceTable({ members }: Props) {
  const { t } = useTranslation();

  console.log(members)
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-card border rounded-xl shadow-sm overflow-hidden"
    >
      {/* Section header */}
      <div className="p-6 pb-4">
        <h2 className="font-semibold text-lg text-card-foreground">
          {t("dashboard.reports.memberPerformance")}
        </h2>
      </div>

      {/* Responsive table wrapper */}
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
                  {t("dashboard.reports.noPerformanceData")}
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
                      {/* Progress bar */}
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
      </div>
    </motion.div>
  );
}
