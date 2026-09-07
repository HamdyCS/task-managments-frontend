import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { deleteAccountConfirm, logout } from "../../services/authService";
import { useAppDispatch } from "../../store/hooks";
import { clearUser } from "../../store/auth/authSlice";
import type { MutationCallBack } from "../MutationCallBack";

export default function useDeleteAccountConfirm(
  opts: MutationCallBack<void, AxiosError>,
) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    string
  >({
    mutationKey: ["deleteAccountConfirm"],
    mutationFn: deleteAccountConfirm,
    onSuccess: (data) => {
      dispatch(clearUser());
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      navigate("/", { replace: true });
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
