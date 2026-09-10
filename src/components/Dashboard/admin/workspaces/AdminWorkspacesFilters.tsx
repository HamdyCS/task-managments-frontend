import { useTranslation } from "react-i18next";
import { FiSearch, FiX } from "react-icons/fi";

interface Props {
  workspaceName: string;
  ownerName: string;
  onWorkspaceNameChange: (value: string) => void;
  onOwnerNameChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export default function AdminWorkspacesFilters({
  workspaceName,
  ownerName,
  onWorkspaceNameChange,
  onOwnerNameChange,
  onReset,
  hasActiveFilters,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
        />
        <input
          type="text"
          value={workspaceName}
          onChange={(e) => onWorkspaceNameChange(e.target.value)}
          placeholder={t("dashboard.admin.workspaces.filters.searchWorkspace")}
          className="w-full h-10 pl-9 pr-4 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        />
        {workspaceName && (
          <button
            onClick={() => onWorkspaceNameChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground cursor-pointer"
          >
            <FiX size={14} />
          </button>
        )}
      </div>

      <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
        />
        <input
          type="text"
          value={ownerName}
          onChange={(e) => onOwnerNameChange(e.target.value)}
          placeholder={t("dashboard.admin.workspaces.filters.searchOwner")}
          className="w-full h-10 pl-9 pr-4 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        />
        {ownerName && (
          <button
            onClick={() => onOwnerNameChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground cursor-pointer"
          >
            <FiX size={14} />
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="h-10 px-4 text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors cursor-pointer whitespace-nowrap"
        >
          {t("dashboard.admin.workspaces.filters.reset")}
        </button>
      )}
    </div>
  );
}
