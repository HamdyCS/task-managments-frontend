import { api } from "../api/Axios";
import config from "../config";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type ProjectDto from "../dtos/project/ProjectDto";

export async function getWorkspaceProjects(
  workspaceId: number,
): Promise<PaginationResultDto<ProjectDto>> {
  const { data } = await api.get<PaginationResultDto<ProjectDto>>(
    config.project.all(workspaceId),
  );
  return data;
}
