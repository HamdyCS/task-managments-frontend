import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ResetPasswordDto } from "../../dtos/auth/ForgetPasswordDto";
import { resetPassword } from "../../services/authService";
import type { MutationCallBack as MutationCallBacks } from "../MutationCallBack";

export default function useResetPassword(
  opts: MutationCallBacks<void, AxiosError>
) {
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    ResetPasswordDto
  >({
    mutationKey: ["resetPassword"],
    mutationFn: resetPassword,
    onSuccess: (data) => {
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
