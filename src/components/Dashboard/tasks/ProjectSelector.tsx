import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiChevronDown } from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import type ProjectDto from "../../../dtos/project/ProjectDto";

interface Props {
  projects: ProjectDto[];
  selectedProjectId: number | null;
  onSelect: (projectId: number) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export default function ProjectSelector({
  projects,
  selectedProjectId,
  onSelect,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const { ref: sentinelRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage && onLoadMore) {
        onLoadMore();
      }
    },
  });

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleSelect = useCallback(
    (projectId: number) => {
      onSelect(projectId);
      setOpen(false);
    },
    [onSelect],
  );

  if (projects.length === 0 && !isFetchingNextPage) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {t("dashboard.tasks.projectSelector.label")}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="appearance-none w-full h-10 pl-3 pr-10 bg-muted border border-border rounded-lg text-sm text-card-foreground text-left focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
      >
        {selectedProject
          ? selectedProject.name
          : t("dashboard.tasks.projectSelector.label")}
      </button>
      <FiChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />

      {open && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => handleSelect(project.id)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${
                project.id === selectedProjectId
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-popover-foreground hover:bg-accent"
              }`}
            >
              {project.name}
            </button>
          ))}

          {/* Infinite scroll sentinel */}
          {hasNextPage && (
            <div ref={sentinelRef} className="h-2" />
          )}

          {isFetchingNextPage && (
            <div className="flex justify-center py-2">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
