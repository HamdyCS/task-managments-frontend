import { useTranslation } from "react-i18next";
import { FiMoreHorizontal } from "react-icons/fi";
import { useEffect, useState } from "react";
import type TaskDto from "../../../dtos/task/TaskDto";
import type { WorkSpaceRole } from "../../../types/WorkSpaceRole";
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
  const { refs, floatingStyles, context } = useFloating({
    open,

    // المكان المبدئي
    placement: "bottom-end",
    onOpenChange: setOpen,

    // تحديث المنيو تلقائيا يعني مثلا مع تغيير حجم الشاشة  مثل تصغير الشاشة او سكرول
    whileElementsMounted: autoUpdate,

    middleware: [
      //مسافة بين الزر والمينيو
      offset(5),

      // لو المنيو خارج الشاشة يغير مكانه
      flip(),

      // مسافة بين المنيو والحواف
      shift({ padding: 10 }),
    ],
  });

  //اطفاء المينيو علي ضغط escape or click outside
  const {} = useDismiss(context);

  const isManager = canManageTask(workspaceRole);
  const assignedUserId = task.assignments.find((a) => a.isActive)?.assignedToId;
  const isSelf = assignedUserId === currentUserId;

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
              className="w-48 bg-popover border border-border rounded-xl shadow-lg py-1 "
              ref={refs.setFloating}
              style={floatingStyles}
              aria-labelledby="floating-focus-manager"
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
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
