import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { deleteAccountSendEmail } from "../../services/authService";
import type { MutationCallBack } from "../MutationCallBack";

export default function useDeleteAccountSendEmail(
  opts: MutationCallBack<void, AxiosError>,
) {
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError
  >({
    mutationKey: ["deleteAccountSendEmail"],
    mutationFn: deleteAccountSendEmail,
    onSuccess: (data) => {
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
