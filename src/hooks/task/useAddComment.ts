import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "../../services/commentService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

interface AddCommentVariables {
  workspaceId: number;
  projectId: number;
  taskId: number;
  comment: string;
}

export default function useAddComment(
  opts: MutationCallBack<unknown, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    unknown,
    AxiosError,
    AddCommentVariables
  >({
    mutationKey: ["addComment"],
    mutationFn: ({ workspaceId, projectId, taskId, comment }) =>
      addComment(workspaceId, projectId, taskId, comment),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "taskComments",
          variables.workspaceId,
          variables.projectId,
          variables.taskId,
        ],
      });
      opts.onSuccess?.(_data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });

  return { mutateAsync, isPending, isError, error };
}
