import { useMutation } from "@tanstack/react-query";
import type RegisterDto from "../../dtos/auth/RegisterDto";
import { register } from "../../services/authService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

export default function useRegister(
  opts: MutationCallBack<{ id: string }, AxiosError>,
) {
  const { mutateAsync, isPending, error, isError } = useMutation<
    { id: string },
    AxiosError,
    RegisterDto
  >({
    mutationKey: ["register"],
    mutationFn: register,
    onSuccess: (data) => {
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
