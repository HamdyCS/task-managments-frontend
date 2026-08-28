import { useQuery } from "@tanstack/react-query";
import { getTaskAttachments } from "../../services/attachmentService";
import type { TaskAttachmentDto } from "../../dtos/task/TaskDto";

export default function useTaskAttachments(
  workspaceId: number | null,
  projectId: number | null,
  taskId: number | null,
) {
  return useQuery<TaskAttachmentDto[], Error>({
    queryKey: ["taskAttachments", workspaceId, projectId, taskId],
    queryFn: () => getTaskAttachments(workspaceId!, projectId!, taskId!),
    enabled: workspaceId !== null && projectId !== null && taskId !== null,
  });
}
