import { useTranslation } from "react-i18next";
import type WorkSpaceDto from "../../../dtos/workspace/WorkSpaceDto";
import WorkspaceActionsMenu from "./WorkspaceActionsMenu";
import getRoleBadgeClasses from "../../../utils/getRoleBadgeClasses";

interface Props {
  workspace: WorkSpaceDto;
  currentUserId: string;
  onView: (workspace: WorkSpaceDto) => void;
  onEdit: (workspace: WorkSpaceDto) => void;
  onDelete: (workspace: WorkSpaceDto) => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WorkspaceRow({
  workspace,
  currentUserId,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const isOwner = workspace.createdById === currentUserId;

  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">
              {workspace.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-card-foreground truncate">
              {workspace.name}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm text-muted-foreground max-w-[200px]">
        <span className="truncate block">
          {workspace.description || "—"}
        </span>
      </td>
      <td className="p-4 text-sm text-muted-foreground">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClasses(isOwner ? "Owner" : "Member")}`}
        >
          {t(`dashboard.workspaces.role.${isOwner ? "Owner" : "Member"}`)}
        </span>
      </td>
      <td className="p-4 text-sm text-muted-foreground">
        {formatDate(workspace.createdAt)}
      </td>
      <td className="p-4 text-sm text-muted-foreground">
        {workspace.lastUpdatedAt ? formatDate(workspace.lastUpdatedAt) : "—"}
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onView(workspace)}
            className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
          >
            {t("dashboard.workspaces.actions.view")}
          </button>
          <WorkspaceActionsMenu
            workspace={workspace}
            currentUserId={currentUserId}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </td>
    </tr>
  );
}
