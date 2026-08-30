import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { useTeamMembers } from "../../../hooks/team/useTeamMembers";
import getRoleBadgeClasses from "../../../utils/getRoleBadgeClasses";
import type WorkSpaceUserDto from "../../../dtos/workspace/WorkSpaceUserDto";

interface Props {
  workspaceId: number;
  currentUserId: string;
}

export default function MembersSection({
  workspaceId,
  currentUserId,
}: Props) {
  const { t } = useTranslation();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useTeamMembers(workspaceId);

  const { ref: sentinelRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const members = data?.pages.flatMap((page: { data: WorkSpaceUserDto[] }) => page.data) ?? [];
  const isLoadingMore = isFetching && !isLoading;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-primary/10 text-primary",
      "bg-success/10 text-success",
      "bg-warning/10 text-warning",
      "bg-destructive/10 text-destructive",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-base font-semibold text-card-foreground">
          {t("dashboard.team.members.title")}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("dashboard.team.members.subtitle")}
        </p>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-card-foreground mb-1">
            {t("dashboard.team.members.empty.title")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.team.members.empty.description")}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">
                  {t("dashboard.team.members.table.member")}
                </th>
                <th className="p-4 font-medium">
                  {t("dashboard.team.members.table.email")}
                </th>
                <th className="p-4 font-medium">
                  {t("dashboard.team.members.table.role")}
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border/50">
              {members.map((member: WorkSpaceUserDto) => {
                const isCurrentUser = member.userId === currentUserId;
                return (
                  <tr
                    key={member.id}
                    className={`transition-colors ${
                      isCurrentUser ? "bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${getAvatarColor(member.fullName)}`}
                        >
                          {getInitials(member.fullName)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-card-foreground">
                            {member.fullName}
                          </span>
                          {isCurrentUser && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                              {t("dashboard.team.members.you")}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {member.email}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClasses(member.workSpaceRole)}`}
                      >
                        {t(
                          `dashboard.workspaceSwitcher.role.${member.workSpaceRole}`,
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div ref={sentinelRef} className="h-4" />

      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
