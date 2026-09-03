import { useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useUserWorkspaces from "../../hooks/workspace/useUserWorkspaces";
import useWorkspaceRole from "../../hooks/workspace/useWorkspaceRole";
import useProjects from "../../hooks/project/useProjects";
import { useWorkspaceMembers } from "../../hooks/workspace/useWorkspaceMembers";
import ReportsSkeleton from "../../components/Dashboard/skeleton/ReportsSkeleton";
import ReportsEmptyState from "../../components/Dashboard/reports/ReportsEmptyState";
import ReportsHeader from "../../components/Dashboard/reports/ReportsHeader";
import ReportsTabs from "../../components/Dashboard/reports/ReportsTabs";
import OverviewTab from "../../components/Dashboard/reports/overview/OverviewTab";
import ProjectsTab from "../../components/Dashboard/reports/projects/ProjectsTab";
import MembersTab from "../../components/Dashboard/reports/members/MembersTab";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type WorkSpaceDto from "../../dtos/workspace/WorkSpaceDto";
import type ProjectDto from "../../dtos/project/ProjectDto";
import type WorkSpaceUserDto from "../../dtos/workspace/WorkSpaceUserDto";

type TabType = "overview" | "projects" | "members";

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // Workspace selection
  // ---------------------------------------------------------------------------

  /** Raw workspace ID from the URL (?workspaceId=…). */
  const workspaceIdParam = searchParams.get("workspaceId");

  /** All workspaces the current user has access to (paginated → flattened). */
  const { data: workspacesData, isLoading: workspacesLoading } =
    useUserWorkspaces();

  /** Flattened list of workspace DTOs from the paginated query result. */
  const workspaces = useMemo(
    () =>
      workspacesData?.pages.flatMap(
        (p: PaginationResultDto<WorkSpaceDto>) => p.data,
      ) ?? [],
    [workspacesData],
  );

  /** Parsed numeric workspace ID, or null when no workspace is selected yet. */
  const effectiveWorkspaceId = workspaceIdParam
    ? Number(workspaceIdParam)
    : null;

  // ---------------------------------------------------------------------------
  // Role check & dependent data
  // ---------------------------------------------------------------------------

  /** The current user's role inside the selected workspace (e.g. Admin, Member). */
  const { data: workspaceRole, isLoading: roleLoading } =
    useWorkspaceRole(effectiveWorkspaceId);

  /** All projects belonging to the selected workspace. */
  const { data: projectsData, isLoading: projectsLoading } =
    useProjects(effectiveWorkspaceId);

  /** Flattened list of project DTOs. */
  const projects = useMemo(
    () =>
      projectsData?.pages.flatMap(
        (p: PaginationResultDto<ProjectDto>) => p.data,
      ) ?? [],
    [projectsData],
  );

  /** All members of the selected workspace. */
  const { data: membersData } = useWorkspaceMembers(effectiveWorkspaceId);

  /** Flattened list of workspace member DTOs. */
  const members = useMemo(
    () =>
      membersData?.pages.flatMap(
        (p: PaginationResultDto<WorkSpaceUserDto>) => p.data,
      ) ?? [],
    [membersData],
  );


  // ---------------------------------------------------------------------------
  // Auto-select first workspace when none is in the URL
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (workspaces.length > 0 && !workspaceIdParam) {
      navigate(`/dashboard/reports?workspaceId=${workspaces[0].id}`, {
        replace: true,
      });
    }
  }, [workspaces, workspaceIdParam, navigate]);

  // ---------------------------------------------------------------------------
  // Tab & sub-selection state (read from URL)
  // ---------------------------------------------------------------------------

  /** Currently active tab, defaults to "overview" if not present in the URL. */
  const tab = (searchParams.get("tab") as TabType) || "overview";
  const projectIdParam = searchParams.get("projectId");
  const memberIdParam = searchParams.get("memberId");

  /** Ensure a "tab" param always exists in the URL (defaults to "overview"). */
  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams(
        (prev) => {
          prev.set("tab", "overview");
          return prev;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams]);

  // ---------------------------------------------------------------------------
  // Project sub-selection (used by the Projects tab)
  // ---------------------------------------------------------------------------

  /**
   * Resolves the effective project ID:
   *  - If the URL contains a valid projectId, use it.
   *  - Otherwise fall back to the first project in the list.
   */
  const effectiveProjectId = useMemo(() => {
    if (projects.length === 0) return null;
    if (projectIdParam) {
      const parsed = Number(projectIdParam);
      if (projects.find((p) => p.id === parsed)) return parsed;
    }
    return projects[0]?.id ?? null;
  }, [projects, projectIdParam]);

  /** Auto-select the first project when switching to the Projects tab. */
  useEffect(() => {
    if (tab === "projects" && projects.length > 0 && !projectIdParam) {
      setSearchParams(
        (prev) => {
          prev.set("projectId", String(projects[0].id));
          return prev;
        },
        { replace: true },
      );
    }
  }, [tab, projects, projectIdParam, setSearchParams]);

  // ---------------------------------------------------------------------------
  // Member sub-selection (used by the Members tab)
  // ---------------------------------------------------------------------------

  /**
   * Resolves the effective member ID:
   *  - If the URL contains a valid memberId, use it.
   *  - Otherwise fall back to the first member in the list.
   */
  const effectiveMemberId = useMemo(() => {
    if (members.length === 0) return null;
    if (memberIdParam) {
      const found = members.find((m) => m.userId === memberIdParam);
      if (found) return found.userId;
    }
    return members[0]?.userId ?? null;
  }, [members, memberIdParam]);

  /** Auto-select the first member when switching to the Members tab. */
  useEffect(() => {
    if (tab === "members" && members.length > 0 && !memberIdParam) {
      setSearchParams(
        (prev) => {
          prev.set("memberId", members[0].userId);
          return prev;
        },
        { replace: true },
      );
    }
  }, [tab, members, memberIdParam, setSearchParams]);

  // ---------------------------------------------------------------------------
  // Guard clauses
  // ---------------------------------------------------------------------------

  /** Show a skeleton while workspace or role data is loading. */
  if (workspacesLoading || roleLoading) {
    return <ReportsSkeleton />;
  }


  /** Show an empty state when no workspace is selected or available. */
  if (!effectiveWorkspaceId) {
    return <ReportsEmptyState />;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6 pb-6">
      {/* Page title + PDF download button */}
      <ReportsHeader workspaceId={effectiveWorkspaceId} />

      {/* Tab bar: Overview | Projects | Members */}
      <ReportsTabs activeTab={tab} workspaceId={effectiveWorkspaceId} />

      {/* Active tab content — only one is rendered at a time */}
      {tab === "overview" && <OverviewTab workspaceId={effectiveWorkspaceId} />}

      {tab === "projects" && (
        <ProjectsTab
          workspaceId={effectiveWorkspaceId}
          projects={projects}
          effectiveProjectId={effectiveProjectId}
          members={members}
          isLoading={projectsLoading}
        />
      )}

      {tab === "members" && (
        <MembersTab
          workspaceId={effectiveWorkspaceId}
          members={members}
          effectiveMemberId={effectiveMemberId}
        />
      )}
    </div>
  );
}
