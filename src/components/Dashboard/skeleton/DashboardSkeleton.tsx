import KpiSkeleton from "./KpiSkeleton";
import ChartSkeleton from "./ChartSkeleton";
import ActivitySkeleton from "./ActivitySkeleton";
import TableSkeleton from "./TableSkeleton";
import TeamSkeleton from "./TeamSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-6">
      <KpiSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <ActivitySkeleton />
      </div>
      <TableSkeleton />
      <TeamSkeleton />
    </div>
  );
}
