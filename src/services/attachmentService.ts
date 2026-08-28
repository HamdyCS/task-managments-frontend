import { api } from "../api/Axios";
import config from "../config";
import type { TaskAttachmentDto } from "../dtos/task/TaskDto";

export async function getTaskAttachments(
  workspaceId: number,
  projectId: number,
  taskId: number,
): Promise<TaskAttachmentDto[]> {
  const { data } = await api.get<TaskAttachmentDto[]>(
    config.task.attachments(workspaceId, projectId, taskId),
  );
  return data;
}

export async function uploadAttachment(
  workspaceId: number,
  projectId: number,
  taskId: number,
  file: File,
): Promise<TaskAttachmentDto> {
  const formData = new FormData();
  formData.append("File", file);
  const { data } = await api.post<TaskAttachmentDto>(
    config.task.attachments(workspaceId, projectId, taskId),
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
}

export async function deleteAttachment(
  workspaceId: number,
  projectId: number,
  taskId: number,
  attachmentId: number,
): Promise<void> {
  await api.delete(
    config.task.attachment(workspaceId, projectId, taskId, attachmentId),
  );
}
