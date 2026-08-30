export interface WorkSpaceInviteDto {
  id: number;
  workSpaceId: number;
  workSpaceName?: string;
  invitedToId: string;
  invitedToEmail?: string;
  invitedById: string;
  invitedByName?: string;
  createdAt: string;
  expiresAt: string;
  workSpaceInviteStatus: "Pending" | "Accepted" | "Rejected";
}

export interface SendInviteDto {
  workSpaceId: number;
  inviteToEmail: string;
  workSpaceRole: string;
}
