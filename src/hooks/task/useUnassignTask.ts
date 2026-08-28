import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unassignTask } from "../../services/taskService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

interface UnassignTaskVariables {
  workspaceId: number;
  projectId: number;
  taskId: number;
  userId: string;
}

export default function useUnassignTask(
  opts: MutationCallBack<void, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    UnassignTaskVariables
  >({
    mutationKey: ["unassignTask"],
    mutationFn: ({ workspaceId, projectId, taskId, userId }) =>
      unassignTask(workspaceId, projectId, taskId, userId),
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
