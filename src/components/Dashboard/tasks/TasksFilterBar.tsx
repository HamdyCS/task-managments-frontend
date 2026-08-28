import { useTranslation } from "react-i18next";
import { FiSearch, FiX } from "react-icons/fi";
import type { TaskStatus } from "../../../types/TaskStatus";
import type { TaskPriority } from "../../../types/TaskPriority";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status: TaskStatus | undefined;
  onStatusChange: (value: TaskStatus | undefined) => void;
  priority: TaskPriority | undefined;
  onPriorityChange: (value: TaskPriority | undefined) => void;
  sortBy: string | undefined;
  onSortByChange: (value: string | undefined) => void;
  sortOrder: "asc" | "desc" | undefined;
  onSortOrderChange: (value: "asc" | "desc" | undefined) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const STATUS_OPTIONS: TaskStatus[] = [
  "Backlog",
  "Todo",
  "InProgress",
  "Review",
  "Done",
];

const PRIORITY_OPTIONS: TaskPriority[] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const SORT_OPTIONS = [
  { value: "createdAt", labelKey: "dashboard.tasks.sort.createdDate" },
  { value: "deadline", labelKey: "dashboard.tasks.sort.deadline" },
  { value: "priority", labelKey: "dashboard.tasks.sort.priority" },
  { value: "name", labelKey: "dashboard.tasks.sort.name" },
];

export default function TasksFilterBar({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
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
          placeholder={t("dashboard.tasks.filters.search")}
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
        value={status ?? ""}
        onChange={(e) =>
          onStatusChange(e.target.value ? (e.target.value as TaskStatus) : undefined)
        }
        className="h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
      >
        <option value="">{t("dashboard.tasks.filters.status")}</option>
        <option value="">{t("dashboard.tasks.status.all")}</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {t(`dashboard.tasks.status.${s}`)}
          </option>
        ))}
      </select>

      <select
        value={priority ?? ""}
        onChange={(e) =>
          onPriorityChange(e.target.value ? (e.target.value as TaskPriority) : undefined)
        }
        className="h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
      >
        <option value="">{t("dashboard.tasks.filters.priority")}</option>
        <option value="">{t("dashboard.tasks.priority.all")}</option>
        {PRIORITY_OPTIONS.map((p) => (
          <option key={p} value={p}>
            {t(`dashboard.tasks.priority.${p}`)}
          </option>
        ))}
      </select>

      <select
        value={sortBy ?? ""}
        onChange={(e) => {
          const val = e.target.value || undefined;
          onSortByChange(val);
          if (val && !sortOrder) onSortOrderChange("asc");
        }}
        className="h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
      >
        <option value="">{t("dashboard.tasks.filters.sort")}</option>
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {t(opt.labelKey)}
          </option>
        ))}
      </select>

      {sortBy && (
        <button
          onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
          className="h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground hover:bg-accent transition-colors cursor-pointer"
          title={sortOrder === "asc" ? "Ascending" : "Descending"}
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      )}

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
