import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../../../animations";
import useMemberPerformance from "../../../../hooks/reports/useMemberPerformance";
import type MemberPerformanceDto from "../../../../dtos/reports/MemberPerformanceDto";

interface Props {
  workspaceId: number;
  memberId: string | null;
}

export default function MemberPerformanceCard({ workspaceId, memberId }: Props) {
  const { t } = useTranslation();
  const { data: performance, isLoading, isError } = useMemberPerformance(
    workspaceId,
    memberId,
  );

  /** Prompt the user to select a member first. */
  if (!memberId) {
    return (
      <div className="bg-card border rounded-xl p-8 shadow-sm text-center">
        <p className="text-muted-foreground text-sm">
          {t("dashboard.reports.selectMemberFirst")}
        </p>
      </div>
    );
  }

  /** Loading spinner while the performance data is being fetched. */
  if (isLoading) {
    return (
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-center h-[200px]">
          <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  /** Error or empty state. */
  if (isError || !performance) {
    return (
      <div className="bg-card border rounded-xl p-8 shadow-sm text-center">
        <p className="text-muted-foreground text-sm">
          {t("dashboard.reports.noPerformanceData")}
        </p>
      </div>
    );
  }

  return <PerformanceContent performance={performance} />;
}

function PerformanceContent({
  performance,
}: {
  performance: MemberPerformanceDto;
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={staggerItem}
        className="bg-card border rounded-xl p-6 shadow-sm"
      >
        {/* Member name header */}
        <h3 className="font-semibold text-lg text-card-foreground mb-4">
          {performance.memberName}
        </h3>

        {/* Stat cards: Assigned, In Progress, Done, Completion % */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-card-foreground">
              {performance.assignedCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t("dashboard.reports.table.assigned")}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-card-foreground">
              {performance.inProgressCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t("dashboard.reports.table.inProgress")}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-card-foreground">
              {performance.doneCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t("dashboard.reports.table.done")}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {performance.completionPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t("dashboard.reports.table.completion")}
            </div>
          </div>
        </div>

        {/* Full-width progress bar reflecting completion percentage */}
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-700"
              style={{ width: `${performance.completionPercentage}%` }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
