import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkspace } from "../../services/workspaceService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

export default function useDeleteWorkspace(
  opts: MutationCallBack<void, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    number
  >({
    mutationKey: ["deleteWorkspace"],
    mutationFn: (id) => deleteWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWorkspaces"] });
      opts.onSuccess?.();
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
