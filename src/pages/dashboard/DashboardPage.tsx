import { useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useUserWorkspaces from "../../hooks/workspace/useUserWorkspaces";
import useWorkspaceRole from "../../hooks/workspace/useWorkspaceRole";
import useDashboard from "../../hooks/workspace/useDashboard";
import { useAppDispatch } from "../../store/hooks";
import DashboardSkeleton from "../../components/Dashboard/skeleton/DashboardSkeleton";
import NoWorkspace from "../../components/Dashboard/empty/NoWorkspace";
import KpiCards from "../../components/Dashboard/sections/KpiCards";
import TaskDistribution from "../../components/Dashboard/sections/TaskDistribution";
import RecentActivity from "../../components/Dashboard/sections/RecentActivity";
import ActiveTasksTable from "../../components/Dashboard/sections/ActiveTasksTable";
import { setSelectedWorkSpace } from "../../store/dashboard/selectedWorkSpace";

export default function DashboardPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const workspaceIdParam = searchParams.get("workspaceId");

  //fetch user workspaces
  const { data: workspacesData, isLoading: workspacesLoading } =
    useUserWorkspaces();

  //get workspaces from data
  const workspaces = useMemo(
    () => workspacesData?.data ?? [],
    [workspacesData],
  );

  //check if user has workspaces
  const hasWorkspaces = workspaces.length > 0;

  //get workspace id from query params
  const effectiveWorkspaceId = workspaceIdParam
    ? Number(workspaceIdParam)
    : null;

  //fetch workspace role
  const { data: workspaceRole } = useWorkspaceRole(effectiveWorkspaceId);

  //redux dispatch
  const dispatch = useAppDispatch();

  //fetch dashboard data
  const { data: dashboardData, isPending: dashboardLoading } =
    useDashboard(effectiveWorkspaceId);

  //handle redirect to the first workspace
  useEffect(() => {
    if (hasWorkspaces && !workspaceIdParam) {
      navigate(`/dashboard?workspaceId=${workspaces[0].id}`, { replace: true });
    }
  }, [hasWorkspaces, workspaceIdParam, workspaces, navigate]);

  //sync selected workspace to redux
  useEffect(() => {
    if (!effectiveWorkspaceId || !workspaceRole) return;
    const workspace = workspaces.find((w) => w.id === effectiveWorkspaceId);
    if (workspace) {
      dispatch(
        setSelectedWorkSpace({
          workSpaceId: effectiveWorkspaceId,
          workSpace: workspace,
          workSpaceRole: workspaceRole,
        }),
      );
    }
  }, [effectiveWorkspaceId, workspaceRole, workspaces, dispatch]);

  //handle loading state
  if (workspacesLoading || dashboardLoading) {
    return <DashboardSkeleton />;
  }

  //handle no workspaces state
  if (!hasWorkspaces) {
    return <NoWorkspace />;
  }

  //destructure dashboard data
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
