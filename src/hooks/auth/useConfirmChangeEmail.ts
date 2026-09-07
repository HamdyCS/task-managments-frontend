import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type ChangeEmailDto from "../../dtos/auth/ChangeEmailDto";
import { confirmChangeEmail } from "../../services/authService";
import type { MutationCallBack } from "../MutationCallBack";

export default function useConfirmChangeEmail(
  opts: MutationCallBack<void, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    ChangeEmailDto
  >({
    mutationKey: ["confirmChangeEmail"],
    mutationFn: confirmChangeEmail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
