import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../../services/taskService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";
import type { UpdateTaskDto } from "../../dtos/task/UpdateTaskDto";

interface UpdateTaskVariables {
  workspaceId: number;
  projectId: number;
  taskId: number;
  updateTaskDto: UpdateTaskDto;
}

export default function useUpdateTask(
  opts: MutationCallBack<unknown, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    unknown,
    AxiosError,
    UpdateTaskVariables
  >({
    mutationKey: ["updateTask"],
    mutationFn: ({ workspaceId, projectId, taskId, updateTaskDto }) =>
      updateTask(workspaceId, projectId, taskId, updateTaskDto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.workspaceId, variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "task",
          variables.workspaceId,
          variables.projectId,
          variables.taskId,
        ],
      });
      opts.onSuccess?.(_data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
