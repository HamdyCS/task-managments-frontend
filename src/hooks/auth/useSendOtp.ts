import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { SendOtpDto } from "../../dtos/auth/ForgetPasswordDto";
import { sendOtp } from "../../services/authService";
import type { MutationCallBack as MutationCallBacks } from "../MutationCallBack";

export default function useSendOtp(
  opts: MutationCallBacks<void, AxiosError>
) {
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    SendOtpDto
  >({
    mutationKey: ["sendOtp"],
    mutationFn: sendOtp,
    onSuccess: (data) => {
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
