import { useTranslation } from "react-i18next";
import { FiUserPlus } from "react-icons/fi";

interface Props {
  onRegisterAdminClick: () => void;
}

export default function UsersPageHeader({ onRegisterAdminClick }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("dashboard.admin.users.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("dashboard.admin.users.subtitle")}
        </p>
      </div>
      <button
        onClick={onRegisterAdminClick}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer hover:bg-primary/90"
      >
        <FiUserPlus size={16} />
        {t("dashboard.admin.users.registerAdmin")}
      </button>
    </div>
  );
}
