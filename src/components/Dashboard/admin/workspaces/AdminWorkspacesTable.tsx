import { useTranslation } from "react-i18next";
import type WorkSpaceOverviewDto from "../../../../dtos/admin/WorkSpaceOverviewDto";
import AdminWorkspaceRow from "./AdminWorkspaceRow";

interface Props {
  workspaces: WorkSpaceOverviewDto[];
  onViewWorkspace: (workspace: WorkSpaceOverviewDto) => void;
  onViewMembers: (workspace: WorkSpaceOverviewDto) => void;
  onViewProjects: (workspace: WorkSpaceOverviewDto) => void;
}

export default function AdminWorkspacesTable({
  workspaces,
  onViewWorkspace,
  onViewMembers,
  onViewProjects,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">
                {t("dashboard.admin.workspaces.table.workspace")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.admin.workspaces.table.owner")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.admin.workspaces.table.members")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.admin.workspaces.table.projects")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.admin.workspaces.table.tasks")}
              </th>
              <th className="p-4 font-medium">
                {t("dashboard.admin.workspaces.table.created")}
              </th>
              <th className="p-4 font-medium text-right">
                {t("dashboard.admin.workspaces.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {workspaces.map((workspace) => (
              <AdminWorkspaceRow
                key={workspace.id}
                workspace={workspace}
                onViewWorkspace={onViewWorkspace}
                onViewMembers={onViewMembers}
                onViewProjects={onViewProjects}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
