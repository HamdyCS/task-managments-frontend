import { Link } from "react-router-dom";
import { FiArrowRight, FiFilter } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn } from "../../../animations";
import type { ActiveTask } from "../../../dtos/workspace/DashboardDto";

interface Props {
  tasks: ActiveTask[];
  workspaceId: number;
}

const PRIORITY_STYLES: Record<string, string> = {
  Low: "bg-success/10 text-success border border-success/20",
  Medium: "bg-warning/10 text-warning border border-warning/20",
  High: "bg-destructive/10 text-destructive border border-destructive/20",
  Critical: "bg-destructive/15 text-destructive border border-destructive/30",
};

const STATUS_STYLES: Record<string, string> = {
  Backlog: "bg-muted text-muted-foreground border border-border",
  Todo: "bg-muted text-muted-foreground border border-border",
  InProgress: "bg-primary/10 text-primary border border-primary/20",
  Review: "bg-warning/10 text-warning border border-warning/20",
  Done: "bg-success/10 text-success border border-success/20",
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

export default function ActiveTasksTable({ tasks, workspaceId }: Props) {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col"
    >
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg text-card-foreground">
          {t("dashboard.activeTasks")}
        </h2>
        <div className="flex gap-4 items-center">
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <FiFilter size={18} />
          </button>
          <Link
            to={`/dashboard/tasks?workspaceId=${workspaceId}`}
            className="text-primary text-sm hover:underline flex items-center gap-1"
          >
            {t("dashboard.viewAll")} <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Task Name</th>
              <th className="p-4 font-medium">Project</th>
              <th className="p-4 font-medium">Priority</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Deadline</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-border/50">
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  No active tasks
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-muted/50 transition-colors group"
                >
                  <td className="p-4">
                    <div className="font-medium text-card-foreground mb-0.5 group-hover:text-primary transition-colors cursor-pointer">
                      {task.name}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      #{String(task.id).padStart(3, "0")}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {task.projectName}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_STYLES[task.priority] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[task.status] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td
                    className={`p-4 text-right text-sm ${getDeadlineClass(task.deadLine)}`}
                  >
                    {formatDeadline(task.deadLine)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
