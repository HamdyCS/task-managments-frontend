import { useTranslation } from "react-i18next";
import { FiSearch, FiX } from "react-icons/fi";

type WorkspaceRoleFilter = "all" | "owned" | "member";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: WorkspaceRoleFilter;
  onRoleFilterChange: (value: WorkspaceRoleFilter) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export default function WorkspaceFilters({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  onReset,
  hasActiveFilters,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("dashboard.workspaces.filters.search")}
          className="w-full h-10 pl-9 pr-4 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground cursor-pointer"
          >
            <FiX size={14} />
          </button>
        )}
      </div>

      <select
        value={roleFilter}
        onChange={(e) =>
          onRoleFilterChange(e.target.value as WorkspaceRoleFilter)
        }
        className="h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
      >
        <option value="all">{t("dashboard.workspaces.filters.all")}</option>
        <option value="owned">{t("dashboard.workspaces.filters.owned")}</option>
        <option value="member">{t("dashboard.workspaces.filters.member")}</option>
      </select>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="h-10 px-4 text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors cursor-pointer"
        >
          {t("dashboard.tasks.filters.reset")}
        </button>
      )}
    </div>
  );
}
