import { useQuery } from "@tanstack/react-query";
import { getTask } from "../../services/taskService";
import type TaskDto from "../../dtos/task/TaskDto";

export default function useTask(
  workspaceId: number | null,
  projectId: number | null,
  taskId: number | null,
) {
  return useQuery<TaskDto, Error>({
    queryKey: ["task", workspaceId, projectId, taskId],
    queryFn: () => getTask(workspaceId!, projectId!, taskId!),
    enabled: workspaceId !== null && projectId !== null && taskId !== null,
  });
}
