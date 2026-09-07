import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { sendPasswordResetEmail } from "../../services/authService";
import type { MutationCallBack } from "../MutationCallBack";

export default function useSendPasswordResetEmail(
  opts: MutationCallBack<void, AxiosError>,
) {
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    void
  >({
    mutationKey: ["sendPasswordResetEmail"],
    mutationFn: sendPasswordResetEmail,
    onSuccess: (data) => {
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
