import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { useAppDispatch } from "../../store/hooks";
import { clearUser } from "../../store/auth/authSlice";

export default function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      navigate("/");
    },
  });

  return { mutateAsync, isPending };
}
