import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeTaskStatus } from "../../services/taskService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

interface ChangeStatusVariables {
  workspaceId: number;
  projectId: number;
  taskId: number;
  status: string;
  isSelf: boolean;
}

export default function useChangeTaskStatus(
  opts: MutationCallBack<unknown, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    unknown,
    AxiosError,
    ChangeStatusVariables
  >({
    mutationKey: ["changeTaskStatus"],
    mutationFn: ({ workspaceId, projectId, taskId, status, isSelf }) =>
      changeTaskStatus(workspaceId, projectId, taskId, status, isSelf),
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
