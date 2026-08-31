import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import type WorkSpaceDto from "../../../dtos/workspace/WorkSpaceDto";
import WorkspaceRow from "./WorkspaceRow";

interface Props {
  workspaces: WorkSpaceDto[];
  currentUserId: string;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  onView: (workspace: WorkSpaceDto) => void;
  onEdit: (workspace: WorkSpaceDto) => void;
  onDelete: (workspace: WorkSpaceDto) => void;
  onLoadMore: () => void;
}

export default function WorkspacesTable({
  workspaces,
  currentUserId,
  isLoadingMore,
  hasNextPage,
  onView,
  onEdit,
  onDelete,
  onLoadMore,
}: Props) {
  const { t } = useTranslation();

  const { ref: sentinelRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isLoadingMore) {
        onLoadMore();
      }
    },
  });

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">
                {t("dashboard.workspaces.table.workspace")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.workspaces.table.description")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.workspaces.table.role")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.workspaces.table.createdAt")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.workspaces.table.lastUpdatedAt")}
              </th>
              <th className="p-4 font-medium text-right">
                {t("dashboard.workspaces.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {workspaces.map((workspace) => (
              <WorkspaceRow
                key={workspace.id}
                workspace={workspace}
                currentUserId={currentUserId}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            {t("dashboard.workspaces.loading")}
          </div>
        </div>
      )}
    </div>
  );
}
