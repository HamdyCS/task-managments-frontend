import { api } from "../api/Axios";
import config from "../config";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type ProjectDto from "../dtos/project/ProjectDto";
import type CreateProjectDto from "../dtos/project/CreateProjectDto";
import type UpdateProjectDto from "../dtos/project/UpdateProjectDto";

export async function getWorkspaceProjects(
  workspaceId: number,
  pageNumber = 1,
  pageSize = 20,
): Promise<PaginationResultDto<ProjectDto>> {
  const { data } = await api.get<PaginationResultDto<ProjectDto>>(
    config.project.all(workspaceId, pageNumber, pageSize),
  );
  return data;
}

export async function getProjectById(
  workspaceId: number,
  projectId: number,
): Promise<ProjectDto> {
  const { data } = await api.get<ProjectDto>(
    config.project.single(workspaceId, projectId),
  );
  return data;
}

export async function createProject(
  workspaceId: number,
  dto: CreateProjectDto,
): Promise<ProjectDto> {
  const { data } = await api.post<ProjectDto>(
    config.project.create(workspaceId),
    dto,
  );
  return data;
}

export async function updateProject(
  workspaceId: number,
  projectId: number,
  dto: UpdateProjectDto,
): Promise<ProjectDto> {
  const { data } = await api.put<ProjectDto>(
    config.project.update(workspaceId, projectId),
    dto,
  );
  return data;
}

export async function deleteProject(
  workspaceId: number,
  projectId: number,
): Promise<void> {
  await api.delete(config.project.delete(workspaceId, projectId));
}
