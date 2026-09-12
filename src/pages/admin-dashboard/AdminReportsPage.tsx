import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertCircle } from "react-icons/fi";
import useAdminReportsOverview from "../../hooks/admin/useAdminReportsOverview";
import ReportsHeader from "../../components/Dashboard/admin/reports/ReportsHeader";
import ReportsSummaryCards from "../../components/Dashboard/admin/reports/ReportsSummaryCards";
import TaskStatusDistribution from "../../components/Dashboard/admin/reports/TaskStatusDistribution";
import TasksByPriorityChart from "../../components/Dashboard/admin/reports/TasksByPriorityChart";
import ReportsSkeleton from "../../components/Dashboard/admin/reports/ReportsSkeleton";
import MemberPerformance from "../../components/Dashboard/admin/reports/MemberPerformance";

interface DateRange {
  from?: Date;
  to?: Date;
}

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function AdminReportsPage() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const from = dateRange.from ? formatDate(dateRange.from) : undefined;
  const to = dateRange.to ? formatDate(dateRange.to) : undefined;

  const {
    data: overview,
    isLoading,
    isError,
  } = useAdminReportsOverview(from, to);

  return (
    <div className="space-y-6 pb-6 min-h-screen">
      <ReportsHeader
        isLoading={isLoading}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {isLoading ? (
        <ReportsSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FiAlertCircle size={48} className="text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            {t("dashboard.admin.reports.error.title")}
          </h3>
          <p className="text-muted-foreground text-sm max-w-md">
            {t("dashboard.admin.reports.error.description")}
          </p>
        </div>
      ) : overview ? (
        <>
          <ReportsSummaryCards
            regularUsersCount={overview.regularUsersCount}
            workspacesCount={overview.workspacesCount}
            projectsCount={overview.projectsCount}
            tasksCount={overview.tasksCount}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TaskStatusDistribution data={overview.tasksByStatusReportDtos} />
            <TasksByPriorityChart data={overview.tasksByPriorityReportDtos} />
          </div>
        </>
      ) : null}

      <MemberPerformance />
    </div>
  );
}
