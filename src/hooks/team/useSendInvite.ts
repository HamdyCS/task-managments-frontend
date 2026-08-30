import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendInvite } from "../../services/teamService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";
import type { SendInviteDto } from "../../dtos/workspace/WorkSpaceInviteDto";

export default function useSendInvite(
  opts: MutationCallBack<unknown, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    unknown,
    AxiosError,
    SendInviteDto
  >({
    mutationKey: ["sendInvite"],
    mutationFn: (dto) => sendInvite(dto),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["teamSentInvites"] });
      opts.onSuccess?.(_data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
