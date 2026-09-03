import useWorkspaceReport from "../../../../hooks/reports/useWorkspaceReport";
import WorkspaceStats from "./WorkspaceStats";
import TaskStatusChart from "./TaskStatusChart";
import MemberPerformanceTable from "./MemberPerformanceTable";
import ReportsSkeleton from "../../skeleton/ReportsSkeleton";

interface Props {
  workspaceId: number;
}

export default function OverviewTab({ workspaceId }: Props) {
  const { data: report, isLoading, isError } = useWorkspaceReport(workspaceId);

  /** Skeleton placeholder during initial data fetch. */
  if (isLoading) {
    return <ReportsSkeleton />;
  }

  /** Error state — shown when the API call fails or returns no data. */
  if (isError || !report) {
    return (
      <div className="bg-card border rounded-xl p-8 shadow-sm text-center">
        <p className="text-muted-foreground">
          Failed to load workspace report.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary stat cards: total projects, members, tasks, done tasks */}
      <WorkspaceStats
        totalProjects={report.totalProjects}
        totalMembers={report.totalMembers}
        totalTasks={report.totalTasks}
        totalDoneTasks={report.totalDoneTasks}
      />

      {/* Doughnut chart showing task distribution by status */}
      <TaskStatusChart
        backlog={report.totalBacklogTasks}
        todo={report.totalTodoTasks}
        inProgress={report.totalInProgressTasks}
        review={report.totalReviewTasks}
        done={report.totalDoneTasks}
      />

      {/* Per-member performance table for the entire workspace */}
      <MemberPerformanceTable
        members={report.memberPerformances}
      />
    </div>
  );
}
