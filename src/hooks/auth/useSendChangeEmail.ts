import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { sendChangeEmail } from "../../services/authService";
import type { MutationCallBack } from "../MutationCallBack";

export default function useSendChangeEmail(
  opts: MutationCallBack<void, AxiosError>,
) {
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    string
  >({
    mutationKey: ["sendChangeEmail"],
    mutationFn: sendChangeEmail,
    onSuccess: (data) => {
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
