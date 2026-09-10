import { FiAlertTriangle } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useAdminDashboard from "../../hooks/admin/useAdminDashboard";
import AdminDashboardSkeleton from "../../components/Dashboard/skeleton/AdminDashboardSkeleton";
import AdminKpiCards from "../../components/Dashboard/sections/admin/AdminKpiCards";
import AdminTasksOverview from "../../components/Dashboard/sections/admin/AdminTasksOverview";
import AdminLast30DaysStats from "../../components/Dashboard/sections/admin/AdminLast30DaysStats";
import AdminRecentActivity from "../../components/Dashboard/sections/admin/AdminRecentActivity";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <FiAlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          {t("dashboard.admin.error.title")}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {t("dashboard.admin.error.description")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <AdminKpiCards data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminTasksOverview data={data.tasksOverviewDto} />
        </div>
        <AdminLast30DaysStats data={data} />
      </div>

      <AdminRecentActivity />
    </div>
  );
}
