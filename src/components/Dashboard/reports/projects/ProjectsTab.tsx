import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type ProjectDto from "../../../../dtos/project/ProjectDto";
import type WorkSpaceUserDto from "../../../../dtos/workspace/WorkSpaceUserDto";
import ProjectSelector from "./ProjectSelector";
import ProjectTaskStatusChart from "./ProjectTaskStatusChart";
import ProjectTaskPriorityChart from "./ProjectTaskPriorityChart";
import ProjectMemberPerformanceTable from "./ProjectMemberPerformanceTable";
import useProjectTasksByStatus from "../../../../hooks/reports/useProjectTasksByStatus";
import useProjectTasksByPriority from "../../../../hooks/reports/useProjectTasksByPriority";

interface Props {
  workspaceId: number;
  projects: ProjectDto[];
  effectiveProjectId: number | null;
  members: WorkSpaceUserDto[];
  isLoading: boolean;
}

export default function ProjectsTab({
  workspaceId,
  projects,
  effectiveProjectId,
  members,
  isLoading,
}: Props) {
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();

  /** Task count breakdown by status for the selected project. */
  const {
    data: statusData,
    isLoading: statusLoading,
  } = useProjectTasksByStatus(workspaceId, effectiveProjectId);

  /** Task count breakdown by priority for the selected project. */
  const {
    data: priorityData,
    isLoading: priorityLoading,
  } = useProjectTasksByPriority(workspaceId, effectiveProjectId);

  /** Update the URL with the newly selected project ID. */
  function handleProjectSelect(projectId: number) {
    setSearchParams((prev) => {
      prev.set("projectId", String(projectId));
      return prev;
    });
  }

  /** Empty state when the workspace has no projects. */
  if (projects.length === 0 && !isLoading) {
    return (
      <div className="bg-card border rounded-xl p-8 shadow-sm text-center">
        <p className="text-muted-foreground text-sm">
          {t("dashboard.reports.noProjects")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project dropdown selector */}
      <ProjectSelector
        projects={projects}
        effectiveProjectId={effectiveProjectId}
        onSelect={handleProjectSelect}
      />

      {/* Side-by-side status and priority charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectTaskStatusChart
          data={statusData ?? []}
          isLoading={statusLoading}
        />
        <ProjectTaskPriorityChart
          data={priorityData ?? []}
          isLoading={priorityLoading}
        />
      </div>

      {/* Per-member performance table scoped to the selected project */}
      <ProjectMemberPerformanceTable
        workspaceId={workspaceId}
        projectId={effectiveProjectId}
        members={members}
      />
    </div>
  );
}
