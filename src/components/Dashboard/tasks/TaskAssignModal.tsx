import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import type WorkSpaceUserDto from "../../../dtos/workspace/WorkSpaceUserDto";
import useAssignTask from "../../../hooks/task/useAssignTask";
import useUnassignTask from "../../../hooks/task/useUnassignTask";
import { toast } from "sonner";

interface Props {
  taskId: number;
  workspaceId: number;
  projectId: number;
  workspaceUsers: WorkSpaceUserDto[];
  currentAssigneeId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TaskAssignModal({
  taskId,
  workspaceId,
  projectId,
  workspaceUsers,
  currentAssigneeId,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const [selectedUserId, setSelectedUserId] = useState(currentAssigneeId ?? "");

  const { mutateAsync: assignTask, isPending: assigning } = useAssignTask({
    onSuccess: () => {
      toast.success(t("dashboard.tasks.assign.success"));
      onSuccess();
    },
  });

  const { mutateAsync: unassignTask, isPending: unassigning } = useUnassignTask(
    {
      onSuccess: () => {
        toast.success(t("dashboard.tasks.unassign.success"));
        onSuccess();
      },
    },
  );

  const handleAssign = async () => {
    if (!selectedUserId) return;
    if (currentAssigneeId && currentAssigneeId !== selectedUserId) {
      await unassignTask({
        workspaceId,
        projectId,
        taskId,
        userId: currentAssigneeId,
      });
    }
    await assignTask({
      workspaceId,
      projectId,
      taskId,
      userId: selectedUserId,
    });
  };

  const handleUnassign = async () => {
    if (!currentAssigneeId) return;
    await unassignTask({
      workspaceId,
      projectId,
      taskId,
      userId: currentAssigneeId,
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
              className="bg-popover text-popover-foreground border border-border rounded-xl shadow-lg w-full max-w-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {t("dashboard.tasks.assign.title")}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {t("dashboard.tasks.assign.selectUser")}
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="">
                      {t("dashboard.tasks.assign.selectUser")}
                    </option>
                    {workspaceUsers.map((u) => (
                      <option key={u.userId} value={u.userId}>
                        {u.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  {currentAssigneeId && (
                    <button
                      onClick={handleUnassign}
                      disabled={unassigning}
                      className="px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors cursor-pointer"
                    >
                      {unassigning
                        ? "..."
                        : t("dashboard.tasks.actions.unassign")}
                    </button>
                  )}
                  <button
                    onClick={handleAssign}
                    disabled={!selectedUserId || assigning}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {assigning ? "..." : t("dashboard.tasks.assign.title")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
