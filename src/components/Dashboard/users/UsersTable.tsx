import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import type AdminUserDto from "../../../dtos/admin/AdminUserDto";
import UserRow from "./UserRow";

interface Props {
  users: AdminUserDto[];
  isLoadingMore: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export default function UsersTable({
  users,
  isLoadingMore,
  hasNextPage,
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
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
            <th className="p-4 font-medium">
              {t("dashboard.admin.users.table.name")}
            </th>
            <th className="p-4 font-medium">
              {t("dashboard.admin.users.table.email")}
            </th>
            <th className="p-4 font-medium">
              {t("dashboard.admin.users.table.role")}
            </th>
            <th className="p-4 font-medium">
              {t("dashboard.admin.users.table.dateOfBirth")}
            </th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-border/50">
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>

      <div ref={sentinelRef} className="h-4" />

      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            {t("dashboard.admin.users.loading")}
          </div>
        </div>
      )}
    </div>
  );
}
