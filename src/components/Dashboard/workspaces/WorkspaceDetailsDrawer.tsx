import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiCalendar,
  FiUser,
  FiUsers,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import type WorkSpaceDto from "../../../dtos/workspace/WorkSpaceDto";
import type WorkSpaceUserDto from "../../../dtos/workspace/WorkSpaceUserDto";
import useWorkspaceRole from "../../../hooks/workspace/useWorkspaceRole";
import { useWorkspaceMembers } from "../../../hooks/workspace/useWorkspaceMembers";
import getRoleBadgeClasses from "../../../utils/getRoleBadgeClasses";
import { useAppSelector } from "../../../store/hooks";

interface Props {
  workspace: WorkSpaceDto | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function MemberRow({
  member,
  currentUserId,
}: {
  member: WorkSpaceUserDto;
  currentUserId: string;
}) {
  const { t } = useTranslation();
  const isCurrentUser = member.userId === currentUserId;
  const initials = member.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    "bg-primary/10 text-primary",
    "bg-success/10 text-success",
    "bg-warning/10 text-warning",
    "bg-destructive/10 text-destructive",
  ];
  let hash = 0;
  for (let i = 0; i < member.fullName.length; i++) {
    hash = member.fullName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const avatarColor = colors[Math.abs(hash) % colors.length];

  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${avatarColor}`}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-card-foreground truncate">
          {member.fullName}
          {isCurrentUser && (
            <span className="text-xs text-primary font-normal ms-1 mx-2!">
              ({t("dashboard.workspaces.details.you")})
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
      </div>
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeClasses(member.workSpaceRole as "Owner" | "ProjectManager" | "Member")}`}
      >
        {t(`dashboard.workspaces.role.${member.workSpaceRole}`)}
      </span>
    </div>
  );
}

export default function WorkspaceDetailsDrawer({
  workspace,
  isOpen,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const currentUserId = user?.id ?? "";

  const isOwner = workspace?.createdById === currentUserId;

  // Fetch role for the opened workspace
  const { data: workspaceRole, isLoading: roleLoading } = useWorkspaceRole(
    isOpen && workspace ? workspace.id : null,
  );

  // Fetch members for the opened workspace
  const {
    data: membersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: membersLoading,
  } = useWorkspaceMembers(isOpen && workspace ? workspace.id : null);

  const members =
    membersData?.pages.flatMap(
      (page: { data: WorkSpaceUserDto[] }) => page.data,
    ) ?? [];

  const { ref: sentinelRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const displayRole = workspaceRole ?? "Member";

  return (
    <AnimatePresence>
      {isOpen && workspace && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-card border-l z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-card-foreground">
                {t("dashboard.workspaces.details.title")}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Workspace Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">
                      {workspace.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-card-foreground">
                      {workspace.name}
                    </h3>
                    {workspace.description && (
                      <p className="text-sm text-muted-foreground">
                        {workspace.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <FiUser
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <span className="text-muted-foreground">
                      {t("dashboard.workspaces.details.owner")}:
                    </span>
                    <span className="text-card-foreground font-medium">
                      {workspace.createdByName || "—"}
                      {isOwner && (
                        <span className="text-xs text-primary font-normal ms-1 mx-2!">
                          ({t("dashboard.workspaces.details.you")})
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <FiFileText
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <span className="text-muted-foreground">
                      {t("dashboard.workspaces.details.description")}:
                    </span>
                    <span className="text-card-foreground">
                      {workspace.description || "—"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <FiUsers
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <span className="text-muted-foreground">
                      {t("dashboard.workspaces.details.yourRole")}:
                    </span>
                    {roleLoading ? (
                      <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClasses(displayRole)}`}
                      >
                        {t(`dashboard.workspaces.role.${displayRole}`)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <FiCalendar
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <span className="text-muted-foreground">
                      {t("dashboard.workspaces.details.created")}:
                    </span>
                    <span className="text-card-foreground">
                      {formatDate(workspace.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <FiClock
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <span className="text-muted-foreground">
                      {t("dashboard.workspaces.details.lastUpdated")}:
                    </span>
                    <span className="text-card-foreground">
                      {workspace.lastUpdatedAt
                        ? formatDate(workspace.lastUpdatedAt)
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div>
                <h4 className="text-sm font-semibold text-card-foreground mb-3">
                  {t("dashboard.workspaces.details.members")}
                </h4>

                {membersLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 bg-muted rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.workspaces.members.empty")}
                  </p>
                ) : (
                  <div className="divide-y divide-border/50">
                    {members.map((member) => (
                      <MemberRow
                        key={member.id}
                        member={member}
                        currentUserId={currentUserId}
                      />
                    ))}
                    <div ref={sentinelRef} className="h-2" />
                    {isFetchingNextPage && (
                      <div className="flex justify-center py-3">
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
