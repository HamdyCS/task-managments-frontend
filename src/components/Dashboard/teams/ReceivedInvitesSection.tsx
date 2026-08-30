import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { FiCheck, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { useMyReceivedInvites } from "../../../hooks/team/useMyReceivedInvites";
import useAcceptInvite from "../../../hooks/team/useAcceptInvite";
import useRejectInvite from "../../../hooks/team/useRejectInvite";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { formatDate } from "../../../utils/formatDate";
import type { WorkSpaceInviteDto } from "../../../dtos/workspace/WorkSpaceInviteDto";

export default function ReceivedInvitesSection() {
  const { t } = useTranslation();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useMyReceivedInvites();

  const { ref: sentinelRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const invites = data?.pages.flatMap((page: { data: WorkSpaceInviteDto[] }) => page.data) ?? [];
  const isLoadingMore = isFetching && !isLoading;

  const [rejectId, setRejectId] = useState<number | null>(null);

  const { mutateAsync: acceptInviteMutation, isPending: accepting } =
    useAcceptInvite({
      onSuccess: () => {
        toast.success(t("dashboard.team.receivedInvites.accept.success"));
      },
      onError: () => {
        toast.error(t("dashboard.team.receivedInvites.accept.error"));
      },
    });

  const { mutateAsync: rejectInviteMutation, isPending: rejecting } =
    useRejectInvite({
      onSuccess: () => {
        toast.success(t("dashboard.team.receivedInvites.reject.success"));
        setRejectId(null);
      },
      onError: () => {
        toast.error(t("dashboard.team.receivedInvites.reject.error"));
      },
    });

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-warning/10 text-warning";
      case "Accepted":
        return "bg-success/10 text-success";
      case "Rejected":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-base font-semibold text-card-foreground">
            {t("dashboard.team.receivedInvites.title")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("dashboard.team.receivedInvites.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : invites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-medium text-card-foreground mb-1">
              {t("dashboard.team.receivedInvites.empty.title")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.team.receivedInvites.empty.description")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">
                    {t("dashboard.team.receivedInvites.table.workspace")}
                  </th>
                  <th className="p-4 font-medium">
                    {t("dashboard.team.receivedInvites.table.sentDate")}
                  </th>
                  <th className="p-4 font-medium">
                    {t("dashboard.team.receivedInvites.table.status")}
                  </th>
                  <th className="p-4 font-medium">
                    {t("dashboard.team.receivedInvites.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border/50">
                {invites.map((invite: WorkSpaceInviteDto) => (
                  <tr
                    key={invite.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4 text-card-foreground font-medium">
                      {invite.workSpaceName ?? `Workspace #${invite.workSpaceId}`}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {formatDate(invite.createdAt)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(invite.workSpaceInviteStatus)}`}
                      >
                        {t(
                          `dashboard.team.inviteStatus.${invite.workSpaceInviteStatus}`,
                        )}
                      </span>
                    </td>
                    <td className="p-4">
                      {invite.workSpaceInviteStatus === "Pending" && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => acceptInviteMutation(invite.id)}
                            disabled={accepting}
                            className="p-1.5 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title={t(
                              "dashboard.team.receivedInvites.actions.accept",
                            )}
                          >
                            <FiCheck size={14} />
                          </button>
                          <button
                            onClick={() => setRejectId(invite.id)}
                            disabled={rejecting}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title={t(
                              "dashboard.team.receivedInvites.actions.reject",
                            )}
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
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

      <ConfirmDialog
        open={rejectId !== null}
        onClose={() => setRejectId(null)}
        onConfirm={() => {
          if (rejectId !== null) {
            rejectInviteMutation(rejectId);
          }
        }}
        title={t("dashboard.team.receivedInvites.reject.title")}
        confirmText={t("dashboard.team.receivedInvites.reject.confirm")}
        cancelText={t("dashboard.team.receivedInvites.reject.cancel")}
        isLoading={rejecting}
      />
    </>
  );
}
