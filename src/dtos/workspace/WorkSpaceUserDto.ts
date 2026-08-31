import type WorkSpaceDto from "./WorkSpaceDto";

export default interface WorkSpaceUserDto {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  workSpaceRole: string;
  workSpaceDto: WorkSpaceDto;
}
