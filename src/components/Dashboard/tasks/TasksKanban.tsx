import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../../animations";
import type TaskDto from "../../../dtos/task/TaskDto";
import type { TaskStatus } from "../../../types/TaskStatus";
import { memo } from "react";

interface Props {
  tasks: TaskDto[];
  onTaskClick: (task: TaskDto) => void;
}

const STATUSES: TaskStatus[] = [
  "Backlog",
  "Todo",
  "InProgress",
  "Review",
  "Done",
];

const STATUS_HEADER_STYLES: Record<string, string> = {
  Backlog: "border-muted-foreground/30",
  Todo: "border-muted-foreground/30",
  InProgress: "border-primary/50",
  Review: "border-warning/50",
  Done: "border-success/50",
};

const PRIORITY_DOT: Record<string, string> = {
  Low: "bg-success",
  Medium: "bg-warning",
  High: "bg-destructive",
  Critical: "bg-destructive",
};

function formatDeadline(deadline: string): string {
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
  const date = new Date(deadline);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return "text-destructive font-medium";
  return "text-muted-foreground";
}

function TasksKanban({ tasks, onTaskClick }: Props) {
  const { t } = useTranslation();

  const tasksByStatus = STATUSES.map((status) => ({
    status,
    tasks: tasks.filter((task) => task.taskStatus === status),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {tasksByStatus.map(({ status, tasks: statusTasks }) => (
        <div key={status} className="flex-shrink-0 w-72">
          <div
            className={`border-t-2 ${STATUS_HEADER_STYLES[status]} pt-3 pb-2 mb-3`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-card-foreground">
                {t(`dashboard.tasks.kanban.columns.${status}`)}
              </h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {statusTasks.length}
              </span>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-2 min-h-[200px]"
          >
            {statusTasks.map((task) => (
              <motion.div
                key={task.id}
                variants={staggerItem}
                onClick={() => onTaskClick(task)}
                className="bg-card border rounded-xl p-3 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-medium text-card-foreground leading-snug">
                    {task.name}
                  </h4>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${PRIORITY_DOT[task.taskPriority] ?? "bg-muted-foreground"}`}
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>#{String(task.id).padStart(3, "0")}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      task.taskPriority === "Critical"
                        ? "bg-destructive/10 text-destructive"
                        : task.taskPriority === "High"
                          ? "bg-destructive/10 text-destructive"
                          : task.taskPriority === "Medium"
                            ? "bg-warning/10 text-warning"
                            : "bg-success/10 text-success"
                    }`}
                  >
                    {t(`dashboard.tasks.priority.${task.taskPriority}`)}
                  </span>
                </div>

                {task.deadline && (
                  <div
                    className={`mt-2 text-xs ${getDeadlineClass(task.deadline)}`}
                  >
                    {formatDeadline(task.deadline)}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

export default memo(TasksKanban);
