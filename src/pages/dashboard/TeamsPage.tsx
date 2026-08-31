import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiUserPlus } from "react-icons/fi";
import { fadeIn } from "../../animations";
import useUserWorkspaces from "../../hooks/workspace/useUserWorkspaces";
import useWorkspaceRole from "../../hooks/workspace/useWorkspaceRole";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setSelectedWorkSpace } from "../../store/dashboard/selectedWorkSpace";
import MembersSection from "../../components/Dashboard/teams/MembersSection";
import SentInvitesSection from "../../components/Dashboard/teams/SentInvitesSection";
import ReceivedInvitesSection from "../../components/Dashboard/teams/ReceivedInvitesSection";
import InviteMemberModal from "../../components/Dashboard/teams/InviteMemberModal";
import TeamsPageSkeleton from "../../components/Dashboard/skeleton/TeamsPageSkeleton";

export default function TeamsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const workspaceIdParam = searchParams.get("workspaceId");

  const { data: workspacesData, isLoading: workspacesLoading } =
    useUserWorkspaces();
  const workspaces = useMemo(
    () => workspacesData?.pages.flatMap((p) => p.data) ?? [],
    [workspacesData],
  );
  const effectiveWorkspaceId = workspaceIdParam
    ? Number(workspaceIdParam)
    : null;

  const { data: workspaceRole } = useWorkspaceRole(effectiveWorkspaceId);

  const user = useAppSelector((state) => state.auth.user);
  const currentUserId = user?.id ?? "";

  useEffect(() => {
    if (!effectiveWorkspaceId || !workspaceRole) return;
    const workspace = workspaces.find((w) => w.id === effectiveWorkspaceId);
    if (workspace) {
      dispatch(
        setSelectedWorkSpace({
          workSpaceId: effectiveWorkspaceId,
          workSpace: workspace,
          workSpaceRole: workspaceRole,
        }),
      );
    }
  }, [effectiveWorkspaceId, workspaceRole, workspaces, dispatch]);

  useEffect(() => {
    if (workspaces.length > 0 && !workspaceIdParam) {
      navigate(`/dashboard/team?workspaceId=${workspaces[0].id}`, {
        replace: true,
      });
    }
  }, [workspaces, workspaceIdParam, navigate]);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const hasWorkspace = !!effectiveWorkspaceId;

  if (workspacesLoading) {
    return <TeamsPageSkeleton />;
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">
            {t("dashboard.team.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("dashboard.team.subtitle")}
          </p>
        </div>
        <button
          onClick={() => setInviteModalOpen(true)}
          disabled={!hasWorkspace}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
        >
          <FiUserPlus size={16} />
          {t("dashboard.team.inviteButton")}
        </button>
      </div>

      {/* Members */}
      {hasWorkspace ? (
        <MembersSection
          workspaceId={effectiveWorkspaceId}
          currentUserId={currentUserId}
        />
      ) : (
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-base font-semibold text-card-foreground">
              {t("dashboard.team.members.title")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("dashboard.team.members.subtitle")}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-medium text-card-foreground mb-1">
              {t("dashboard.team.noWorkspace")}
            </p>
          </div>
        </div>
      )}

      {/* Sent Invites */}
      <SentInvitesSection />

      {/* Received Invites */}
      <ReceivedInvitesSection />

      {/* Invite Modal */}
      {hasWorkspace && (
        <InviteMemberModal
          workspaceId={effectiveWorkspaceId}
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
        />
      )}
    </motion.div>
  );
}
