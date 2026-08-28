import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import type TaskDto from "../../../dtos/task/TaskDto";
import useUpdateTask from "../../../hooks/task/useUpdateTask";
import { toast } from "sonner";

interface Props {
  task: TaskDto;
  workspaceId: number;
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

function formatDeadlineForInput(deadline: string): string {
  const d = new Date(deadline);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export default function TaskEditModal({
  task,
  workspaceId,
  projectId,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const initialDeadline = useMemo(
    () => (task.deadline ? formatDeadlineForInput(task.deadline) : ""),
    [task.deadline],
  );
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description ?? "");
  const [deadline, setDeadline] = useState(initialDeadline);
  const [priority, setPriority] = useState(task.taskPriority);

  const { mutateAsync: updateTask, isPending } = useUpdateTask({
    onSuccess: () => {
      toast.success(t("dashboard.tasks.edit.success"));
      onSuccess();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await updateTask({
      workspaceId,
      projectId,
      taskId: task.id,
      updateTaskDto: {
        name: name.trim(),
        description: description.trim() || undefined,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        priority,
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 h-full bg-black/50 z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-popover text-popover-foreground border border-border rounded-xl shadow-lg w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {t("dashboard.tasks.edit.title")}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {t("dashboard.tasks.details.title")}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {t("dashboard.tasks.details.description")}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      {t("dashboard.tasks.details.deadline")}
                    </label>
                    <input
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      {t("dashboard.tasks.details.priority")}
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {t(`dashboard.tasks.priority.${p}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim() || isPending}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isPending ? "..." : t("dashboard.tasks.edit.title")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
