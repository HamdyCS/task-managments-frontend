import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "../../services/projectService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

interface DeleteProjectVariables {
  workspaceId: number;
  projectId: number;
}

export default function useDeleteProject(
  opts: MutationCallBack<void, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    DeleteProjectVariables
  >({
    mutationKey: ["deleteProject"],
    mutationFn: ({ workspaceId, projectId }) =>
      deleteProject(workspaceId, projectId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.workspaceId],
      });
      opts.onSuccess?.();
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
