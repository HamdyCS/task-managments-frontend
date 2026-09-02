import { useTranslation } from "react-i18next";
import type ProjectDto from "../../../dtos/project/ProjectDto";
import ProjectActionsMenu from "./ProjectActionsMenu";

interface Props {
  project: ProjectDto;
  canManage: boolean;
  onView: (project: ProjectDto) => void;
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectRow({
  project,
  canManage,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useTranslation();

  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">
              {project.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-card-foreground truncate">
              {project.name}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm text-muted-foreground max-w-[250px]">
        <span className="truncate block">
          {project.description || "\u2014"}
        </span>
      </td>
      <td className="p-4 text-sm text-muted-foreground">
        {formatDate(project.createdAt)}
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onView(project)}
            className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
          >
            {t("dashboard.projects.actions.view")}
          </button>
          <ProjectActionsMenu
            project={project}
            canManage={canManage}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </td>
    </tr>
  );
}
