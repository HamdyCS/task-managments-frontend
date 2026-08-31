import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkspace } from "../../services/workspaceService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";
import type UpdateWorkspaceDto from "../../dtos/workspace/UpdateWorkspaceDto";

interface UpdateWorkspaceVariables {
  id: number;
  dto: UpdateWorkspaceDto;
}

export default function useUpdateWorkspace(
  opts: MutationCallBack<unknown, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    unknown,
    AxiosError,
    UpdateWorkspaceVariables
  >({
    mutationKey: ["updateWorkspace"],
    mutationFn: ({ id, dto }) => updateWorkspace(id, dto),
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
