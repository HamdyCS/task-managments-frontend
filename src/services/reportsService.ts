import { api } from "../api/Axios";
import config from "../config";
import type WorkSpaceReportDto from "../dtos/reports/WorkSpaceReportDto";
import type MemberPerformanceDto from "../dtos/reports/MemberPerformanceDto";
import type {
  TaskByStatusDto,
  TaskByPriorityDto,
} from "../dtos/reports/ProjectReportDtos";

export async function getWorkspaceReport(
  workspaceId: number,
): Promise<WorkSpaceReportDto> {
  const { data } = await api.get<WorkSpaceReportDto>(
    config.reports.workspace(workspaceId),
  );
  return data;
}

export async function getProjectTasksByStatus(
  workspaceId: number,
  projectId: number,
): Promise<TaskByStatusDto[]> {
  const { data } = await api.get<TaskByStatusDto[]>(
    config.reports.projectTasksByStatus(workspaceId, projectId),
  );
  return data;
}

export async function getProjectTasksByPriority(
  workspaceId: number,
  projectId: number,
): Promise<TaskByPriorityDto[]> {
  const { data } = await api.get<TaskByPriorityDto[]>(
    config.reports.projectTasksByPriority(workspaceId, projectId),
  );
  return data;
}

export async function getProjectMemberPerformance(
  workspaceId: number,
  projectId: number,
  memberId: string,
): Promise<MemberPerformanceDto> {
  const { data } = await api.get<MemberPerformanceDto>(
    config.reports.projectMemberPerformance(workspaceId, projectId, memberId),
  );
  return data;
}

export async function getMemberPerformance(
  workspaceId: number,
  memberId: string,
): Promise<MemberPerformanceDto> {
  const { data } = await api.get<MemberPerformanceDto>(
    config.reports.memberPerformance(workspaceId, memberId),
  );
  return data;
}
