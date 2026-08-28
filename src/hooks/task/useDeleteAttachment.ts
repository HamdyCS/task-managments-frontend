import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAttachment } from "../../services/attachmentService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

interface DeleteAttachmentVariables {
  workspaceId: number;
  projectId: number;
  taskId: number;
  attachmentId: number;
}

export default function useDeleteAttachment(
  opts: MutationCallBack<void, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    void,
    AxiosError,
    DeleteAttachmentVariables
  >({
    mutationKey: ["deleteAttachment"],
    mutationFn: ({ workspaceId, projectId, taskId, attachmentId }) =>
      deleteAttachment(workspaceId, projectId, taskId, attachmentId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "taskAttachments",
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
