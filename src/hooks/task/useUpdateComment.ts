import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../../services/commentService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

interface UpdateCommentVariables {
  workspaceId: number;
  projectId: number;
  taskId: number;
  commentId: number;
  comment: string;
}

export default function useUpdateComment(
  opts: MutationCallBack<unknown, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    unknown,
    AxiosError,
    UpdateCommentVariables
  >({
    mutationKey: ["updateComment"],
    mutationFn: ({ workspaceId, projectId, taskId, commentId, comment }) =>
      updateComment(workspaceId, projectId, taskId, commentId, comment),
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
