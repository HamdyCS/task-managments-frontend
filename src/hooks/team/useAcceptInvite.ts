import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptInvite } from "../../services/teamService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

export default function useAcceptInvite(
  opts: MutationCallBack<void, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    number
  >({
    mutationKey: ["acceptInvite"],
    mutationFn: (id) => acceptInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamReceivedInvites"] });
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      opts.onSuccess?.();
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
