import { useTranslation } from "react-i18next";
import { FiMoreHorizontal } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type TaskDto from "../../../dtos/task/TaskDto";
import type { WorkSpaceRole } from "../../../types/WorkSpaceRole";

const STATUSES = ["Backlog", "Todo", "InProgress", "Review", "Done"];

const STATUS_STYLES: Record<string, string> = {
  Backlog: "bg-muted text-muted-foreground border border-border",
  Todo: "bg-muted text-muted-foreground border border-border",
  InProgress: "bg-primary/10 text-primary border border-primary/20",
  Review: "bg-warning/10 text-warning border border-warning/20",
  Done: "bg-success/10 text-success border border-success/20",
};

function canManageTask(role: WorkSpaceRole): boolean {
  return role === "Owner" || role === "ProjectManager";
}

interface TaskActionsMenuProps {
  task: TaskDto;
  currentUserId: string;
  workspaceRole: WorkSpaceRole;
  onEdit: (task: TaskDto) => void;
  onDelete: (task: TaskDto) => void;
  onChangeStatus: (task: TaskDto, status: string) => void;
  onAssign: (task: TaskDto) => void;
  onUnassign: (task: TaskDto, userId: string) => void;
}

export default function TaskActionsMenu({
  task,
  currentUserId,
  workspaceRole,
  onEdit,
  onDelete,
  onChangeStatus,
  onAssign,
  onUnassign,
}: TaskActionsMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isManager = canManageTask(workspaceRole);
  const assignedUserId = task.assignments.find((a) => a.isActive)?.assignedToId;
  const isSelf = assignedUserId === currentUserId;

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isRtl =
        document.dir === "rtl" || document.documentElement.dir === "rtl";

      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: isRtl
          ? rect.left + window.scrollX
          : rect.right + window.scrollX - 192,
      });
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
      >
        <FiMoreHorizontal size={16} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className="w-48 bg-popover border border-border rounded-xl shadow-lg py-1 z-[9999]"
          >
            {isManager && (
              <>
                <button
                  onClick={() => {
                    onEdit(task);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  {t("dashboard.tasks.actions.edit")}
                </button>
                <button
                  onClick={() => {
                    onAssign(task);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  {t("dashboard.tasks.actions.assign")}
                </button>
                {assignedUserId && (
                  <button
                    onClick={() => {
                      onUnassign(task, assignedUserId);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors cursor-pointer"
                  >
                    {t("dashboard.tasks.actions.unassign")}
                  </button>
                )}
                <div className="border-t border-border my-1" />
                <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {t("dashboard.tasks.actions.changeStatus")}
                </div>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onChangeStatus(task, s);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer ${
                      task.taskStatus === s
                        ? "bg-accent text-card-foreground font-medium"
                        : "text-popover-foreground hover:bg-accent"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        STATUS_STYLES[s]?.includes("primary")
                          ? "bg-primary"
                          : STATUS_STYLES[s]?.includes("success")
                            ? "bg-success"
                            : STATUS_STYLES[s]?.includes("warning")
                              ? "bg-warning"
                              : STATUS_STYLES[s]?.includes("destructive")
                                ? "bg-destructive"
                                : "bg-muted-foreground"
                      }`}
                    />
                    {t(`dashboard.tasks.status.${s}`)}
                  </button>
                ))}
                <div className="border-t border-border my-1" />
                <button
                  onClick={() => {
                    onDelete(task);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent transition-colors cursor-pointer"
                >
                  {t("dashboard.tasks.actions.delete")}
                </button>
              </>
            )}
            {!isManager && (
              <>
                {isSelf && (
                  <>
                    <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                      {t("dashboard.tasks.actions.changeStatus")}
                    </div>
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          onChangeStatus(task, s);
                          setOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer ${
                          task.taskStatus === s
                            ? "bg-accent text-card-foreground font-medium"
                            : "text-popover-foreground hover:bg-accent"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            STATUS_STYLES[s]?.includes("primary")
                              ? "bg-primary"
                              : STATUS_STYLES[s]?.includes("success")
                                ? "bg-success"
                                : STATUS_STYLES[s]?.includes("warning")
                                  ? "bg-warning"
                                  : STATUS_STYLES[s]?.includes("destructive")
                                    ? "bg-destructive"
                                    : "bg-muted-foreground"
                          }`}
                        />
                        {t(`dashboard.tasks.status.${s}`)}
                      </button>
                    ))}
                  </>
                )}
                {!isSelf && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No actions available
                  </div>
                )}
              </>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
