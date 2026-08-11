import { useMutation } from "@tanstack/react-query";
import type LoginDto from "../../dtos/auth/LoginDto";
import { login } from "../../services/authService";
import type { AxiosError } from "axios";
import type { MutationCallBack as MutationCallBacks } from "../MutationCallBack";
import { useQueryClient } from "@tanstack/react-query";

export default function useLogin(opts: MutationCallBacks<void, AxiosError>) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    LoginDto
  >({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      //get current user
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      console.log("first");
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
