import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../../services/taskService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";
import type { CreateTaskDto } from "../../dtos/task/CreateTaskDto";

interface CreateTaskVariables {
  workspaceId: number;
  projectId: number;
  createTaskDto: CreateTaskDto;
}

export default function useCreateTask(
  opts: MutationCallBack<unknown, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    unknown,
    AxiosError,
    CreateTaskVariables
  >({
    mutationKey: ["createTask"],
    mutationFn: ({ workspaceId, projectId, createTaskDto }) =>
      createTask(workspaceId, projectId, createTaskDto),
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
