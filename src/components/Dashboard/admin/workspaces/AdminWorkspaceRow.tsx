import { formatDate } from "../../../../utils/formatDate";
import type WorkSpaceOverviewDto from "../../../../dtos/admin/WorkSpaceOverviewDto";
import AdminWorkspaceActions from "./AdminWorkspaceActions";

interface Props {
  workspace: WorkSpaceOverviewDto;
  onViewWorkspace: (workspace: WorkSpaceOverviewDto) => void;
  onViewMembers: (workspace: WorkSpaceOverviewDto) => void;
  onViewProjects: (workspace: WorkSpaceOverviewDto) => void;
}

export default function AdminWorkspaceRow({
  workspace,
  onViewWorkspace,
  onViewMembers,
  onViewProjects,
}: Props) {
  const firstOwner = workspace.ownersNames[0] || "—";

  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="p-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onViewWorkspace(workspace)}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
            {workspace.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-card-foreground">
            {workspace.name}
          </span>
        </div>
      </td>
      <td className="p-4 text-muted-foreground text-sm">{firstOwner}</td>
      <td className="p-4 text-card-foreground text-sm">
        {workspace.membersCount}
      </td>
      <td className="p-4 text-card-foreground text-sm">
        {workspace.projectsCount}
      </td>
      <td className="p-4 text-card-foreground text-sm">
        {workspace.tasksCount}
      </td>
      <td className="p-4 text-muted-foreground text-sm text-nowrap">
        {formatDate(workspace.createdAt)}
      </td>
      <td className="p-4 text-right">
        <AdminWorkspaceActions
          workspace={workspace}
          onViewWorkspace={onViewWorkspace}
          onViewMembers={onViewMembers}
          onViewProjects={onViewProjects}
        />
      </td>
    </tr>
  );
}
