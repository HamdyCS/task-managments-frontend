import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import type ProjectDto from "../../../dtos/project/ProjectDto";
import ProjectRow from "./ProjectRow";

interface Props {
  projects: ProjectDto[];
  canManage: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  onView: (project: ProjectDto) => void;
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
  onLoadMore: () => void;
}

export default function ProjectsTable({
  projects,
  canManage,
  isLoadingMore,
  hasNextPage,
  onView,
  onEdit,
  onDelete,
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
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">
                {t("dashboard.projects.table.project")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.projects.table.description")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.projects.table.createdAt")}
              </th>
              <th className="p-4 font-medium text-right">
                {t("dashboard.projects.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                canManage={canManage}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            {t("dashboard.projects.loading")}
          </div>
        </div>
      )}
    </div>
  );
}
