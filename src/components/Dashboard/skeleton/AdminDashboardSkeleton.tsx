import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CustomSkeletonTheme from "../../ui/CustomSkeletonTheme";

export default function AdminDashboardSkeleton() {
  return (
    <CustomSkeletonTheme>
      <div className="space-y-6 pb-6">
        {/* KPI Cards Skeleton - 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border rounded-xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <Skeleton width={100} height={16} />
                <Skeleton width={36} height={36} borderRadius={8} />
              </div>
              <Skeleton width={60} height={32} className="mb-2" />
              <Skeleton width={120} height={14} />
            </div>
          ))}
        </div>

        {/* Tasks Overview & Last 30 Days Stats Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <Skeleton width={160} height={20} />
                <Skeleton width={100} height={16} />
              </div>
              <div className="flex items-center gap-6 min-h-[200px]">
                <Skeleton width={180} height={180} circle />
                <div className="flex-1 grid grid-cols-1 gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton width={10} height={10} circle className="shrink-0" />
                      <Skeleton width={70} height={14} className="flex-1" />
                      <Skeleton width={24} height={14} />
                      <Skeleton width={36} height={14} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <Skeleton width={140} height={20} className="mb-1" />
            <Skeleton width={180} height={14} className="mb-6" />
            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton width={40} height={40} borderRadius={8} className="shrink-0" />
                  <div className="flex-1">
                    <Skeleton width={100} height={14} className="mb-1" />
                    <Skeleton width={50} height={24} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <Skeleton width={140} height={20} className="mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton width={32} height={32} borderRadius={8} className="shrink-0" />
                <div className="flex-1">
                  <Skeleton width="80%" height={14} className="mb-1" />
                  <Skeleton width={80} height={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomSkeletonTheme>
  );
}
