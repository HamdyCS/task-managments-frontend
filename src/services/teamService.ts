import { api } from "../api/Axios";
import config from "../config";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type WorkSpaceUserDto from "../dtos/workspace/WorkSpaceUserDto";
import type {
  WorkSpaceInviteDto,
  SendInviteDto,
} from "../dtos/workspace/WorkSpaceInviteDto";

export async function getWorkspaceMembers(
  workspaceId: number,
  page: number,
  pageSize: number,
): Promise<PaginationResultDto<WorkSpaceUserDto>> {
  const { data } = await api.get<PaginationResultDto<WorkSpaceUserDto>>(
    `${config.workspace.allUsers(workspaceId)}?pageNumber=${page}&pageSize=${pageSize}`,
  );
  return data;
}

export async function getMySentInvites(
  page: number,
  pageSize: number,
): Promise<PaginationResultDto<WorkSpaceInviteDto>> {
  const { data } = await api.get<PaginationResultDto<WorkSpaceInviteDto>>(
    config.workspaceInvite.mySent(page, pageSize),
  );
  return data;
}

export async function getMyReceivedInvites(
  page: number,
  pageSize: number,
): Promise<PaginationResultDto<WorkSpaceInviteDto>> {
  const { data } = await api.get<PaginationResultDto<WorkSpaceInviteDto>>(
    config.workspaceInvite.myReceived(page, pageSize),
  );
  return data;
}

export async function sendInvite(
  dto: SendInviteDto,
): Promise<WorkSpaceInviteDto> {
  const { data } = await api.post<WorkSpaceInviteDto>(
    config.workspaceInvite.create,
    dto,
  );
  return data;
}

export async function deleteInvite(id: number): Promise<void> {
  await api.delete(config.workspaceInvite.byId(id));
}

export async function acceptInvite(id: number): Promise<void> {
  await api.patch(config.workspaceInvite.accept(id));
}

export async function rejectInvite(id: number): Promise<void> {
  await api.patch(config.workspaceInvite.reject(id));
}
