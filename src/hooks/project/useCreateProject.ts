import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";
import type CreateProjectDto from "../../dtos/project/CreateProjectDto";
import { createProject } from "../../services/projectService";

interface CreateProjectVariables {
  workspaceId: number;
  dto: CreateProjectDto;
}

export default function useCreateProject(
  opts: MutationCallBack<unknown, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    unknown,
    AxiosError,
    CreateProjectVariables
  >({
    mutationKey: ["createProject"],
    mutationFn: ({ workspaceId, dto }) => createProject(workspaceId, dto),
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
