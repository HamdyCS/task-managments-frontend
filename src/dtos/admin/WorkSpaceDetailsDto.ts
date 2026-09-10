import type WorkSpaceOverviewDto from "./WorkSpaceOverviewDto";
import type WorkSpaceMemberDto from "./WorkSpaceMemberDto";

export default interface WorkSpaceDetailsDto {
  workSpaceOverview: WorkSpaceOverviewDto;
  completionPercentage: number;
  members: WorkSpaceMemberDto[];
  projectNames: string[];
}
