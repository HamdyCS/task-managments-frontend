import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace } from "../../services/workspaceService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";
import type CreateWorkspaceDto from "../../dtos/workspace/CreateWorkspaceDto";

export default function useCreateWorkspace(
  opts: MutationCallBack<unknown, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    unknown,
    AxiosError,
    CreateWorkspaceDto
  >({
    mutationKey: ["createWorkspace"],
    mutationFn: (dto) => createWorkspace(dto),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["userWorkspaces"] });
      opts.onSuccess?.(_data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
