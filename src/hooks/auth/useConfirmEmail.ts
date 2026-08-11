import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { confirmEmail } from "../../services/authService";
import type { MutationCallBack as MutationCallBacks } from "../MutationCallBack";

interface ConfirmEmailParams {
  email: string;
  token: string;
}

export default function useConfirmEmail(
  opts: MutationCallBacks<void, AxiosError>
) {
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    ConfirmEmailParams
  >({
    mutationKey: ["confirmEmail"],
    mutationFn: ({ email, token }) => confirmEmail(email, token),
    onSuccess: (data) => {
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
