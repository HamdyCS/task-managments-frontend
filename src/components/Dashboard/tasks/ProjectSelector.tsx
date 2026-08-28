import { useTranslation } from "react-i18next";
import { FiChevronDown } from "react-icons/fi";
import type ProjectDto from "../../../dtos/project/ProjectDto";

interface Props {
  projects: ProjectDto[];
  selectedProjectId: number | null;
  onSelect: (projectId: number) => void;
}

export default function ProjectSelector({
  projects,
  selectedProjectId,
  onSelect,
}: Props) {
  const { t } = useTranslation();

  if (projects.length === 0) return null;

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {t("dashboard.tasks.projectSelector.label")}
      </label>
      <div className="relative">
        <select
          value={selectedProjectId ?? ""}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="appearance-none w-full h-10 pl-3 pr-10 bg-muted border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <FiChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>
    </div>
  );
}
