import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../animations";
import type ProjectDto from "../../../../dtos/project/ProjectDto";

interface Props {
  projects: ProjectDto[];
  effectiveProjectId: number | null;
  onSelect: (projectId: number) => void;
}

export default function ProjectSelector({
  projects,
  effectiveProjectId,
  onSelect,
}: Props) {
  const { t } = useTranslation();

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        {t("dashboard.reports.selectProject")}
      </label>
      <select
        value={effectiveProjectId ?? ""}
        onChange={(e) => onSelect(Number(e.target.value))}
        className="w-full sm:w-auto bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </motion.div>
  );
}
