import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type WorkSpaceUserDto from "../../../../dtos/workspace/WorkSpaceUserDto";
import MemberSelector from "./MemberSelector";
import MemberPerformanceCard from "./MemberPerformanceCard";

interface Props {
  workspaceId: number;
  members: WorkSpaceUserDto[];
  effectiveMemberId: string | null;
}

export default function MembersTab({
  workspaceId,
  members,
  effectiveMemberId,
}: Props) {
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();

  /** Update the URL with the newly selected member ID. */
  function handleMemberSelect(memberId: string) {
    setSearchParams((prev) => {
      prev.set("memberId", memberId);
      return prev;
    });
  }

  /** Empty state when the workspace has no members. */
  if (members.length === 0) {
    return (
      <div className="bg-card border rounded-xl p-8 shadow-sm text-center">
        <p className="text-muted-foreground text-sm">
          {t("dashboard.reports.noMembers")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Member dropdown selector */}
      <MemberSelector
        members={members}
        effectiveMemberId={effectiveMemberId}
        onSelect={handleMemberSelect}
      />

      {/* Performance card for the selected member */}
      <MemberPerformanceCard
        workspaceId={workspaceId}
        memberId={effectiveMemberId}
      />
    </div>
  );
}
