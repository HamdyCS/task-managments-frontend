import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type UserDto from "../../dtos/auth/UserDto";
import { getCurrentUser } from "../../services/authService";
import { useAppDispatch } from "../../store/hooks";
import { clearUser, setUser } from "../../store/auth/authSlice";

export default function useCurrentUser() {
  const appDispatch = useAppDispatch();

  const { data, isError, isSuccess, error, isPending } = useQuery<
    UserDto,
    AxiosError
  >({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (isSuccess && data !== undefined) {
      appDispatch(setUser(data));
    }
    if (isError) {
      appDispatch(clearUser());
    }
  }, [data, isError, isSuccess, error, isPending]);

  return { data, isError, isSuccess, isPending };
}
