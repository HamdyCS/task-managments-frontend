import { useTranslation } from "react-i18next";
import { FiMoreHorizontal, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import type ProjectDto from "../../../dtos/project/ProjectDto";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
} from "@floating-ui/react";

interface Props {
  project: ProjectDto;
  canManage: boolean;
  onView: (project: ProjectDto) => void;
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
}

export default function ProjectActionsMenu({
  project,
  canManage,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    open,
    placement: "bottom-end",
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift({ padding: 10 })],
  });

  useDismiss(context);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <>
      <button
        ref={refs.setReference}
        onClick={() => setOpen(!open)}
        className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
      >
        <FiMoreHorizontal size={16} />
      </button>
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={(node) => {
                refs.setFloating(node);
                (menuRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
              }}
              className="w-44 bg-popover border border-border rounded-xl shadow-lg py-1 z-50"
              style={floatingStyles}
            >
              <button
                onClick={() => {
                  onView(project);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                <FiEye size={14} />
                {t("dashboard.projects.actions.view")}
              </button>
              {canManage && (
                <>
                  <button
                    onClick={() => {
                      onEdit(project);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors cursor-pointer"
                  >
                    <FiEdit2 size={14} />
                    {t("dashboard.projects.actions.edit")}
                  </button>
                  <div className="border-t border-border my-1" />
                  <button
                    onClick={() => {
                      onDelete(project);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent transition-colors cursor-pointer"
                  >
                    <FiTrash2 size={14} />
                    {t("dashboard.projects.actions.delete")}
                  </button>
                </>
              )}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
