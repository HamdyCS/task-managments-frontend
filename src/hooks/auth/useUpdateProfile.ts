import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type UpdateProfileDto from "../../dtos/auth/UpdateProfileDto";
import type UserDto from "../../dtos/auth/UserDto";
import { updateProfile } from "../../services/authService";
import type { MutationCallBack } from "../MutationCallBack";

export default function useUpdateProfile(
  opts: MutationCallBack<UserDto, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    UserDto,
    AxiosError,
    UpdateProfileDto
  >({
    mutationKey: ["updateProfile"],
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
