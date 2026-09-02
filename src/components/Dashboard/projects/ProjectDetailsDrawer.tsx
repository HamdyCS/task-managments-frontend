import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiCalendar,
  FiClock,
  FiFileText,
  FiArrowRight,
} from "react-icons/fi";
import type ProjectDto from "../../../dtos/project/ProjectDto";

interface Props {
  project: ProjectDto | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectDetailsDrawer({
  project,
  isOpen,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewTasks = () => {
    if (!project) return;
    navigate(
      `/dashboard/tasks?workspaceId=${project.workSpaceId}&projectId=${project.id}`,
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-card border-l z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-card-foreground">
                {t("dashboard.projects.details.title")}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Project Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">
                      {project.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-card-foreground">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <FiFileText
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <span className="text-muted-foreground">
                      {t("dashboard.projects.details.description")}:
                    </span>
                    <span className="text-card-foreground">
                      {project.description || "\u2014"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <FiCalendar
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <span className="text-muted-foreground">
                      {t("dashboard.projects.details.created")}:
                    </span>
                    <span className="text-card-foreground">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <FiClock
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <span className="text-muted-foreground">
                      {t("dashboard.projects.details.lastUpdated")}:
                    </span>
                    <span className="text-card-foreground">
                      {project.lastUpdatedAt
                        ? formatDate(project.lastUpdatedAt)
                        : "\u2014"}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Tasks CTA */}
              <button
                onClick={handleViewTasks}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
              >
                {t("dashboard.projects.details.viewTasks")}
                <FiArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
