import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignTask } from "../../services/taskService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

interface AssignTaskVariables {
  workspaceId: number;
  projectId: number;
  taskId: number;
  userId: string;
}

export default function useAssignTask(
  opts: MutationCallBack<unknown, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    unknown,
    AxiosError,
    AssignTaskVariables
  >({
    mutationKey: ["assignTask"],
    mutationFn: ({ workspaceId, projectId, taskId, userId }) =>
      assignTask(workspaceId, projectId, taskId, userId),
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
