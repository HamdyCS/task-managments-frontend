import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiCalendar,
  FiFlag,
  FiUser,
  FiPaperclip,
  FiMessageSquare,
  FiDownload,
  FiTrash2,
  FiUpload,
  FiEdit2,
} from "react-icons/fi";
import type TaskDto from "../../../dtos/task/TaskDto";
import type { WorkSpaceRole } from "../../../types/WorkSpaceRole";
import type WorkSpaceUserDto from "../../../dtos/workspace/WorkSpaceUserDto";
import type TaskCommentDto from "../../../dtos/task/TaskCommentDto";
import useTaskComments from "../../../hooks/task/useTaskComments";
import useAddComment from "../../../hooks/task/useAddComment";
import useUpdateComment from "../../../hooks/task/useUpdateComment";
import useDeleteComment from "../../../hooks/task/useDeleteComment";
import useTaskAttachments from "../../../hooks/task/useTaskAttachments";
import useUploadAttachment from "../../../hooks/task/useUploadAttachment";
import useDeleteAttachment from "../../../hooks/task/useDeleteAttachment";
import { useAppSelector } from "../../../store/hooks";
import config from "../../../config";

interface Props {
  task: TaskDto;
  workspaceId: number;
  projectId: number;
  workspaceRole: WorkSpaceRole;
  workspaceUsers: WorkSpaceUserDto[];
  onClose: () => void;
  onChangeStatus: (task: TaskDto, status: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  Backlog: "bg-muted text-muted-foreground border border-border",
  Todo: "bg-muted text-muted-foreground border border-border",
  InProgress: "bg-primary/10 text-primary border border-primary/20",
  Review: "bg-warning/10 text-warning border border-warning/20",
  Done: "bg-success/10 text-success border border-success/20",
};

const PRIORITY_STYLES: Record<string, string> = {
  Low: "bg-success/10 text-success border border-success/20",
  Medium: "bg-warning/10 text-warning border border-warning/20",
  High: "bg-destructive/10 text-destructive border border-destructive/20",
  Critical: "bg-destructive/15 text-destructive border border-destructive/30",
};

const STATUSES = ["Backlog", "Todo", "InProgress", "Review", "Done"];

function formatDeadline(deadline: string): string {
  return new Date(deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskDetailsDrawer({
  task,
  workspaceId,
  projectId,
  workspaceRole,
  workspaceUsers,
  onClose,
  onChangeStatus,
}: Props) {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const currentUserId = user?.id ?? "";
  const isManager =
    workspaceRole === "Owner" || workspaceRole === "ProjectManager";

  const assignedUserId = task.assignments.find((a) => a.isActive)?.assignedToId;
  const assignee = workspaceUsers.find((u) => u.id === assignedUserId);

  // Comments
  const { data: commentsData, isLoading: commentsLoading } = useTaskComments(
    workspaceId,
    projectId,
    task.id,
  );
  const comments = commentsData?.data ?? [];
  const { mutateAsync: addComment, isPending: addingComment } = useAddComment({
    onSuccess: () => setCommentText(""),
  });
  const { mutateAsync: updateComment, isPending: updatingComment } =
    useUpdateComment({});
  const { mutateAsync: deleteComment } = useDeleteComment({});

  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  // Attachments
  const { data: attachments, isLoading: attachmentsLoading } =
    useTaskAttachments(workspaceId, projectId, task.id);
  const { mutateAsync: uploadAttachment, isPending: uploading } =
    useUploadAttachment({});
  const { mutateAsync: deleteAttachment } = useDeleteAttachment({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await addComment({
      workspaceId,
      projectId,
      taskId: task.id,
      comment: commentText.trim(),
    });
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editCommentText.trim()) return;
    await updateComment({
      workspaceId,
      projectId,
      taskId: task.id,
      commentId,
      comment: editCommentText.trim(),
    });
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment({ workspaceId, projectId, taskId: task.id, commentId });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      return;
    }
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      return;
    }
    await uploadAttachment({ workspaceId, projectId, taskId: task.id, file });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    await deleteAttachment({
      workspaceId,
      projectId,
      taskId: task.id,
      attachmentId,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 h-full bg-black/50 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-lg bg-card border-l z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-card-foreground truncate">
              {task.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              #{String(task.id).padStart(3, "0")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                <FiFlag size={12} className="inline mr-1" />
                {t("dashboard.tasks.details.status")}
              </label>
              {isManager || assignedUserId === currentUserId ? (
                <select
                  value={task.taskStatus}
                  onChange={(e) => onChangeStatus(task, e.target.value)}
                  className="w-full h-9 px-2 bg-muted border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:border-primary cursor-pointer"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {t(`dashboard.tasks.status.${s}`)}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[task.taskStatus] ?? ""}`}
                >
                  {t(`dashboard.tasks.status.${task.taskStatus}`)}
                </span>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                <FiFlag size={12} className="inline mr-1" />
                {t("dashboard.tasks.details.priority")}
              </label>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${PRIORITY_STYLES[task.taskPriority] ?? ""}`}
              >
                {t(`dashboard.tasks.priority.${task.taskPriority}`)}
              </span>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              <FiCalendar size={12} className="inline mr-1" />
              {t("dashboard.tasks.details.deadline")}
            </label>
            <span className="text-sm text-card-foreground">
              {formatDeadline(task.deadline)}
            </span>
          </div>

          {/* Assignee */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              <FiUser size={12} className="inline mr-1" />
              {t("dashboard.tasks.details.assignee")}
            </label>
            {assignee ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                  {assignee.fullName[0]}
                </div>
                <span className="text-sm text-card-foreground">
                  {assignee.fullName}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                {t("dashboard.tasks.table.unassigned")}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              {t("dashboard.tasks.details.description")}
            </label>
            <p className="text-sm text-card-foreground leading-relaxed">
              {task.description || t("dashboard.tasks.details.noDescription")}
            </p>
          </div>

          {/* Attachments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-muted-foreground">
                <FiPaperclip size={12} className="inline mr-1" />
                {t("dashboard.tasks.details.attachments")}
                {attachments && attachments.length > 0 && (
                  <span className="ml-1 text-muted-foreground">
                    ({attachments.length})
                  </span>
                )}
              </label>
              {isManager && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <FiUpload size={12} />
                    {uploading
                      ? "..."
                      : t("dashboard.tasks.details.uploadAttachment")}
                  </button>
                </>
              )}
            </div>
            {attachmentsLoading ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-muted rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : attachments && attachments.length > 0 ? (
              <div className="space-y-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2.5 bg-muted rounded-lg group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FiPaperclip
                        size={14}
                        className="text-muted-foreground shrink-0"
                      />
                      <span className="text-sm text-card-foreground truncate">
                        {att.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={`${config.BaseApiURl}${config.task.downloadAttachment(
                          workspaceId,
                          projectId,
                          task.id,
                          att.id,
                        )}`}
                        className="p-1.5 text-muted-foreground hover:text-card-foreground transition-colors"
                      >
                        <FiDownload size={14} />
                      </a>
                      {isManager && (
                        <button
                          onClick={() => handleDeleteAttachment(att.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("dashboard.tasks.details.noAttachments")}
              </p>
            )}
          </div>

          {/* Comments */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-3 block">
              <FiMessageSquare size={12} className="inline mr-1" />
              {t("dashboard.tasks.details.comments")}
              {comments.length > 0 && (
                <span className="ml-1 text-muted-foreground">
                  ({comments.length})
                </span>
              )}
            </label>

            {/* Add comment */}
            <div className="flex gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                {user?.firstName?.[0]}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t("dashboard.tasks.details.addComment")}
                  rows={2}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || addingComment}
                    className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {addingComment
                      ? "..."
                      : t("dashboard.tasks.details.postComment")}
                  </button>
                </div>
              </div>
            </div>

            {/* Comments list */}
            {commentsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t("dashboard.tasks.details.noComments")}
              </p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment: TaskCommentDto) => (
                  <div key={comment.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold">
                          {comment.commentByName[0]}
                        </div>
                        <span className="text-xs font-medium text-card-foreground">
                          {comment.commentByName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {comment.commentById === currentUserId && (
                          <button
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditCommentText(comment.comment);
                            }}
                            className="p-1 text-muted-foreground hover:text-card-foreground transition-colors cursor-pointer"
                          >
                            <FiEdit2 size={12} />
                          </button>
                        )}
                        {(comment.commentById === currentUserId ||
                          workspaceRole === "Owner") && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    {editingCommentId === comment.id ? (
                      <div>
                        <textarea
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          rows={2}
                          className="w-full px-2 py-1 bg-background border border-border rounded text-sm text-card-foreground focus:outline-none focus:border-primary resize-none"
                        />
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleUpdateComment(comment.id)}
                            disabled={updatingComment}
                            className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 cursor-pointer"
                          >
                            {t("dashboard.tasks.details.postComment")}
                          </button>
                          <button
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditCommentText("");
                            }}
                            className="px-3 py-1 text-muted-foreground hover:text-card-foreground text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-card-foreground">
                        {comment.comment}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
