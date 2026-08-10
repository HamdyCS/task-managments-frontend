import { useMutation } from "@tanstack/react-query";
import type LoginDto from "../../dtos/auth/LoginDto";
import { login } from "../../services/authService";
import type { AxiosError } from "axios";
import type { MutationCallBack as MutationCallBacks } from "../MutationCallBack";

export default function useLogin(opts: MutationCallBacks<void, AxiosError>) {
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    LoginDto
  >({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
