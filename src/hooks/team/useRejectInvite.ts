import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectInvite } from "../../services/teamService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

export default function useRejectInvite(
  opts: MutationCallBack<void, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    number
  >({
    mutationKey: ["rejectInvite"],
    mutationFn: (id) => rejectInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamReceivedInvites"] });
      opts.onSuccess?.();
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
