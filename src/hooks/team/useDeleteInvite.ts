import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInvite } from "../../services/teamService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

export default function useDeleteInvite(
  opts: MutationCallBack<void, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    number
  >({
    mutationKey: ["deleteInvite"],
    mutationFn: (id) => deleteInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamSentInvites"] });
      opts.onSuccess?.();
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
