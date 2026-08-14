import { useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useUserWorkspaces from "../../hooks/workspace/useUserWorkspaces";
import useDashboard from "../../hooks/workspace/useDashboard";
import DashboardSkeleton from "../../components/Dashboard/skeleton/DashboardSkeleton";
import NoWorkspace from "../../components/Dashboard/empty/NoWorkspace";
import KpiCards from "../../components/Dashboard/sections/KpiCards";
import TaskDistribution from "../../components/Dashboard/sections/TaskDistribution";
import RecentActivity from "../../components/Dashboard/sections/RecentActivity";
import ActiveTasksTable from "../../components/Dashboard/sections/ActiveTasksTable";
import TeamPerformance from "../../components/Dashboard/sections/TeamPerformance";

export default function DashboardPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const workspaceIdParam = searchParams.get("workspaceId");

  const { data: workspacesData, isLoading: workspacesLoading } =
    useUserWorkspaces();

  const workspaces = useMemo(
    () => workspacesData?.data ?? [],
    [workspacesData],
  );
  const hasWorkspaces = workspaces.length > 0;

  const effectiveWorkspaceId = workspaceIdParam
    ? Number(workspaceIdParam)
    : null;

  const { data: dashboardData, isPending: dashboardLoading } =
    useDashboard(effectiveWorkspaceId);

  //handle redirect to the first workspace
  useEffect(() => {
    if (hasWorkspaces && !workspaceIdParam) {
      navigate(`/dashboard?workspaceId=${workspaces[0].id}`, { replace: true });
    }
  }, [hasWorkspaces, workspaceIdParam, workspaces, navigate]);

  console.log(dashboardData);

  if (workspacesLoading || dashboardLoading) {
    return <DashboardSkeleton />;
  }

  if (!hasWorkspaces) {
    return <NoWorkspace />;
  }

  const {
    stats,
    tasksByStatusReportDtos,
    latestActiveTasks: activeTasks,
    unReadNotifications,
  } = dashboardData;

  return (
    <div className="space-y-6 pb-6">
      <KpiCards stats={stats} totalTasks={stats.totalTasks} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskDistribution
            data={tasksByStatusReportDtos}
            workspaceId={effectiveWorkspaceId!}
          />
        </div>
        <RecentActivity unReadNotifications={unReadNotifications} />
      </div>

      <ActiveTasksTable
        tasks={activeTasks}
        workspaceId={effectiveWorkspaceId!}
      />

      {/* <TeamPerformance members={[]} /> */}
    </div>
  );
}
