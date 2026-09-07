import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type ResetPasswordWithTokenDto from "../../dtos/auth/ResetPasswordWithTokenDto";
import { resetPasswordWithToken } from "../../services/authService";
import type { MutationCallBack } from "../MutationCallBack";

export default function useResetPasswordWithToken(
  opts: MutationCallBack<void, AxiosError>,
) {
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    ResetPasswordWithTokenDto
  >({
    mutationKey: ["resetPasswordWithToken"],
    mutationFn: resetPasswordWithToken,
    onSuccess: (data) => {
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
