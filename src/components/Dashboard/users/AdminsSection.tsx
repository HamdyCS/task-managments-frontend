import { useTranslation } from "react-i18next";
import type AdminUserDto from "../../../dtos/admin/AdminUserDto";
import UsersTable from "./UsersTable";

interface Props {
  users: AdminUserDto[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export default function AdminsSection({
  users,
  isLoading,
  isLoadingMore,
  hasNextPage,
  onLoadMore,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-base font-semibold text-card-foreground">
          {t("dashboard.admin.users.admins.title")}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("dashboard.admin.users.admins.subtitle")}
        </p>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-card-foreground mb-1">
            {t("dashboard.admin.users.admins.empty")}
          </p>
        </div>
      ) : (
        <UsersTable
          users={users}
          isLoadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          onLoadMore={onLoadMore}
        />
      )}
    </div>
  );
}
