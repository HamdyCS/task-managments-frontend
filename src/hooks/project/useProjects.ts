import { useQuery } from "@tanstack/react-query";
import { getWorkspaceProjects } from "../../services/projectService";
import type PaginationResultDto from "../../dtos/workspace/PaginationResultDto";
import type ProjectDto from "../../dtos/project/ProjectDto";

export default function useProjects(workspaceId: number | null) {
  return useQuery<PaginationResultDto<ProjectDto>, Error>({
    queryKey: ["projects", workspaceId],
    queryFn: () => getWorkspaceProjects(workspaceId!),
    enabled: workspaceId !== null,
  });
}
