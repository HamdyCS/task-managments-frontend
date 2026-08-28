import { useTranslation } from "react-i18next";
import { FiUser } from "react-icons/fi";
import type TaskDto from "../../../dtos/task/TaskDto";
import type { WorkSpaceRole } from "../../../types/WorkSpaceRole";
import type WorkSpaceUserDto from "../../../dtos/workspace/WorkSpaceUserDto";
import { formatDate } from "../../../utils/formatDate";
import TaskActionsMenu from "./TaskActionsMenu";
import { memo } from "react";

interface TaskTableProps {
  tasks: TaskDto[];
  currentUserId: string;
  workspaceRole: WorkSpaceRole;
  workspaceUsers: WorkSpaceUserDto[];
  onTaskClick: (task: TaskDto) => void;
  onEdit: (task: TaskDto) => void;
  onDelete: (task: TaskDto) => void;
  onChangeStatus: (task: TaskDto, status: string) => void;
  onAssign: (task: TaskDto) => void;
  onUnassign: (task: TaskDto, userId: string) => void;
}

const PRIORITY_STYLES: Record<string, string> = {
  Low: "bg-success/10 text-success border border-success/20",
  Medium: "bg-warning/10 text-warning border border-warning/20",
  High: "bg-destructive/10 text-destructive border border-destructive/20",
  Critical: "bg-destructive/15 text-destructive border border-destructive/30",
};

function formatDeadline(deadline: string): string {
  if (deadline === null || deadline === undefined) return "-";
  const date = new Date(deadline);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDeadlineClass(deadline: string): string {
  if (deadline === null || deadline === undefined) return "";
  const date = new Date(deadline);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return "text-destructive font-medium";
  return "text-muted-foreground";
}

function isAssignedToUser(task: TaskDto, userId: string): boolean {
  return task.assignments.some((a) => a.assignedToId === userId && a.isActive);
}

function getAssigneeName(
  task: TaskDto,
  workspaceUsers: WorkSpaceUserDto[],
): string {
  const active = task.assignments.find((a) => a.isActive);
  if (!active) return "";
  const user = workspaceUsers.find((u) => u.userId === active.assignedToId);
  return user?.fullName ?? "";
}

function TasksTable({
  tasks,
  currentUserId,
  workspaceRole,
  workspaceUsers,
  onTaskClick,
  onEdit,
  onDelete,
  onChangeStatus,
  onAssign,
  onUnassign,
}: TaskTableProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">
                {t("dashboard.tasks.table.task")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.tasks.table.createdDate")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.tasks.table.assignee")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.tasks.table.priority")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.tasks.table.status")}
              </th>
              <th className="p-4 font-medium text-right">
                {t("dashboard.tasks.table.deadline")}
              </th>
              <th className="p-4 font-medium text-right w-12">
                {t("dashboard.tasks.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-border/50">
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-muted-foreground"
                >
                  {t("dashboard.tasks.empty.noTasks.description")}
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const assigneeName = getAssigneeName(task, workspaceUsers);
                const isMyTask = isAssignedToUser(task, currentUserId);
                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-muted/50 transition-colors group ${
                      isMyTask
                        ? "bg-primary/[0.03] ltr:border-l-2 rtl:border-r-2 border-primary/30"
                        : ""
                    }`}
                  >
                    <td className="p-4">
                      <div
                        className="font-medium text-card-foreground mb-0.5 group-hover:text-primary transition-colors cursor-pointer"
                        onClick={() => onTaskClick(task)}
                      >
                        {task.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        #{String(task.id).padStart(3, "0")}
                      </div>
                    </td>
                    <td className="p-4">{formatDate(task.createdAt)}</td>
                    <td className="p-4">
                      {assigneeName ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                            {assigneeName[0]}
                          </div>
                          <span className="text-card-foreground text-sm">
                            {assigneeName}
                          </span>
                          {isMyTask && (
                            <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                              {t("dashboard.tasks.table.you")}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <FiUser size={14} />
                          <span className="text-sm">
                            {t("dashboard.tasks.table.unassigned")}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_STYLES[task.taskPriority] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {t(`dashboard.tasks.priority.${task.taskPriority}`)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          task.taskStatus === "InProgress"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : task.taskStatus === "Review"
                              ? "bg-warning/10 text-warning border border-warning/20"
                              : task.taskStatus === "Done"
                                ? "bg-success/10 text-success border border-success/20"
                                : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {t(`dashboard.tasks.status.${task.taskStatus}`)}
                      </span>
                    </td>
                    <td
                      className={`p-4 text-right text-sm ${getDeadlineClass(task.deadline)}`}
                    >
                      {formatDeadline(task.deadline)}
                    </td>
                    <td className="p-4 text-center">
                      <TaskActionsMenu
                        task={task}
                        currentUserId={currentUserId}
                        workspaceRole={workspaceRole}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onChangeStatus={onChangeStatus}
                        onAssign={onAssign}
                        onUnassign={onUnassign}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(TasksTable);
