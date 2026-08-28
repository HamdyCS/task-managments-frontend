import { useQuery } from "@tanstack/react-query";
import { getTaskComments } from "../../services/commentService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type TaskCommentDto from "../../dtos/task/TaskCommentDto";

export default function useTaskComments(
  workspaceId: number | null,
  projectId: number | null,
  taskId: number | null,
) {
  return useQuery<PaginationResultDto<TaskCommentDto>, Error>({
    queryKey: ["taskComments", workspaceId, projectId, taskId],
    queryFn: () => getTaskComments(workspaceId!, projectId!, taskId!),
    enabled: workspaceId !== null && projectId !== null && taskId !== null,
  });
}
