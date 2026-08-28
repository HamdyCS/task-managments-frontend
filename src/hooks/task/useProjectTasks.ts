import { useQuery } from "@tanstack/react-query";
import { getProjectTasks, getMyTasks } from "../../services/taskService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type TaskDto from "../../dtos/task/TaskDto";
import type TaskQueryParams from "../../dtos/task/TaskQueryParams";
import type { TaskMode } from "../../types/TaskMode";

export default function useProjectTasks(
  workspaceId: number | null,
  projectId: number | null,
  mode: TaskMode,
  params: TaskQueryParams,
) {
  const queryKey = [
    "tasks",
    workspaceId,
    projectId,
    mode,
    params.pageNumber,
    params.pageSize,
    params.status,
    params.priority,
    params.searchTerm,
    params.sortBy,
    params.sortOrder,
  ];

  return useQuery<PaginationResultDto<TaskDto>, Error>({
    queryKey,
    queryFn: () =>
      mode === "my"
        ? getMyTasks(workspaceId!, projectId!, params)
        : getProjectTasks(workspaceId!, projectId!, params),
    enabled: workspaceId !== null && projectId !== null,
    placeholderData: (prev) => prev,
  });
}
