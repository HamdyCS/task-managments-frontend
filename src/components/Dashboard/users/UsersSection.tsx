import { useState } from "react";
import { useTranslation } from "react-i18next";
import type AdminUserDto from "../../../dtos/admin/AdminUserDto";
import UsersTable from "./UsersTable";

type UserTabFilter = "regular" | "all";

interface Props {
  regularUsers: AdminUserDto[];
  allUsers: AdminUserDto[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export default function UsersSection({
  regularUsers,
  allUsers,
  isLoading,
  isLoadingMore,
  hasNextPage,
  onLoadMore,
}: Props) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<UserTabFilter>("regular");

  const users = activeTab === "regular" ? regularUsers : allUsers;

  const TABS: { key: UserTabFilter; labelKey: string }[] = [
    { key: "regular", labelKey: "dashboard.admin.users.tabs.regular" },
    { key: "all", labelKey: "dashboard.admin.users.tabs.all" },
  ];

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-card-foreground mb-1">
            {t(`dashboard.admin.users.empty.${activeTab}`)}
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
