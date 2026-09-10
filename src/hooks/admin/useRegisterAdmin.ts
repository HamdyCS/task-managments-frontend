import { useMutation } from "@tanstack/react-query";
import type RegisterDto from "../../dtos/auth/RegisterDto";
import { registerAdmin } from "../../services/adminUserService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

export default function useRegisterAdmin(
  opts: MutationCallBack<{ id: string }, AxiosError>,
) {
  const { mutateAsync, isPending, error, isError } = useMutation<
    { id: string },
    AxiosError,
    RegisterDto
  >({
    mutationKey: ["registerAdmin"],
    mutationFn: registerAdmin,
    onSuccess: (data) => {
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
