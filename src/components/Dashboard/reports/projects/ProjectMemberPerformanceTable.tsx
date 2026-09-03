import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../animations";
import type WorkSpaceUserDto from "../../../../dtos/workspace/WorkSpaceUserDto";
import useProjectMemberPerformance from "../../../../hooks/reports/useProjectMemberPerformance";

interface Props {
  workspaceId: number;
  projectId: number | null;
  members: WorkSpaceUserDto[];
}

export default function ProjectMemberPerformanceTable({
  workspaceId,
  projectId,
  members,
}: Props) {
  const { t } = useTranslation();

  /** Guard: prompt the user to select a project first. */
  if (!projectId) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="bg-card border rounded-xl p-8 shadow-sm text-center"
      >
        <p className="text-muted-foreground text-sm">
          {t("dashboard.reports.selectProjectFirst")}
        </p>
      </motion.div>
    );
  }

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
          {t("dashboard.reports.projectMemberPerformance")}
        </h2>
      </div>

      {/* Responsive table */}
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
                  {t("dashboard.reports.noMembers")}
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <MemberRow
                  key={member.userId}
                  workspaceId={workspaceId}
                  projectId={projectId}
                  memberId={member.userId}
                  memberName={member.fullName}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function MemberRow({
  workspaceId,
  projectId,
  memberId,
  memberName,
}: {
  workspaceId: number;
  projectId: number;
  memberId: string;
  memberName: string;
}) {
  const { data: performance, isLoading } = useProjectMemberPerformance(
    workspaceId,
    projectId,
    memberId,
  );

  /** Loading state — show a spinner in the data cells. */
  if (isLoading) {
    return (
      <tr className="hover:bg-muted/50 transition-colors">
        <td className="px-6 py-4 font-medium text-card-foreground">
          {memberName}
        </td>
        <td colSpan={4} className="px-6 py-4 text-center">
          <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent inline-block" />
        </td>
      </tr>
    );
  }

  /** No data available — show a dash placeholder. */
  if (!performance) {
    return (
      <tr className="hover:bg-muted/50 transition-colors">
        <td className="px-6 py-4 font-medium text-card-foreground">
          {memberName}
        </td>
        <td
          colSpan={4}
          className="px-6 py-4 text-center text-muted-foreground text-xs"
        >
          -
        </td>
      </tr>
    );
  }

  /** Fully loaded row with performance metrics. */
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="px-6 py-4 font-medium text-card-foreground">
        {memberName}
      </td>
      <td className="px-6 py-4 text-center text-muted-foreground">
        {performance.assignedCount}
      </td>
      <td className="px-6 py-4 text-center text-muted-foreground">
        {performance.inProgressCount}
      </td>
      <td className="px-6 py-4 text-center text-muted-foreground">
        {performance.doneCount}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3 min-w-[140px]">
          {/* Completion progress bar */}
          <div className="flex-1 bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${performance.completionPercentage}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {performance.completionPercentage.toFixed(1)}%
          </span>
        </div>
      </td>
    </tr>
  );
}
