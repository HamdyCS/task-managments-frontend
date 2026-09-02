import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../../services/projectService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";
import type UpdateProjectDto from "../../dtos/project/UpdateProjectDto";

interface UpdateProjectVariables {
  workspaceId: number;
  projectId: number;
  dto: UpdateProjectDto;
}

export default function useUpdateProject(
  opts: MutationCallBack<unknown, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    unknown,
    AxiosError,
    UpdateProjectVariables
  >({
    mutationKey: ["updateProject"],
    mutationFn: ({ workspaceId, projectId, dto }) =>
      updateProject(workspaceId, projectId, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.workspaceId],
      });
      opts.onSuccess?.(_data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
