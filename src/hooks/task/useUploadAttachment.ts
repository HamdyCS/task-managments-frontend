import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAttachment } from "../../services/attachmentService";
import type { AxiosError } from "axios";
import type { MutationCallBack } from "../MutationCallBack";

interface UploadAttachmentVariables {
  workspaceId: number;
  projectId: number;
  taskId: number;
  file: File;
}

export default function useUploadAttachment(
  opts: MutationCallBack<unknown, AxiosError>,
) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<
    unknown,
    AxiosError,
    UploadAttachmentVariables
  >({
    mutationKey: ["uploadAttachment"],
    mutationFn: ({ workspaceId, projectId, taskId, file }) =>
      uploadAttachment(workspaceId, projectId, taskId, file),
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
