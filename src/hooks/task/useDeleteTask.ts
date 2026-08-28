import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../../services/taskService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

interface DeleteTaskVariables {
  workspaceId: number;
  projectId: number;
  taskId: number;
}

export default function useDeleteTask(
  opts: MutationCallBack<void, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    DeleteTaskVariables
  >({
    mutationKey: ["deleteTask"],
    mutationFn: ({ workspaceId, projectId, taskId }) =>
      deleteTask(workspaceId, projectId, taskId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.workspaceId, variables.projectId],
      });
      opts.onSuccess?.(_data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
