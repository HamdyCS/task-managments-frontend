import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CustomSkeletonTheme from "../../../ui/CustomSkeletonTheme";

export default function ReportsSkeleton() {
  return (
    <CustomSkeletonTheme>
      <div className="space-y-6 pb-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton width={200} height={28} />
            <Skeleton width={300} height={16} className="mt-2" />
          </div>
        </div>

        {/* Filters row skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton width={280} height={42} borderRadius={12} />
          <Skeleton width={180} height={42} borderRadius={12} />
        </div>

        {/* KPI cards skeleton */}
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
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <Skeleton width={180} height={20} className="mb-6" />
            <div className="flex items-center justify-center h-[220px]">
              <Skeleton circle width={200} height={200} />
            </div>
          </div>
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <Skeleton width={160} height={20} className="mb-6" />
            <div className="flex items-end justify-around h-[220px] px-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  width={40}
                  height={60 + i * 30}
                  borderRadius={8}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Member performance skeleton */}
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 pb-4">
            <Skeleton width={200} height={20} />
          </div>
          <div className="px-6 pb-4">
            <Skeleton width={250} height={40} borderRadius={8} />
          </div>
          <div className="overflow-hidden">
            <div className="bg-muted border-b px-6 py-3">
              <div className="flex gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} width={80} height={14} />
                ))}
              </div>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-b border-border/50 px-6 py-4">
                <div className="flex gap-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} width={j === 0 ? 120 : 60} height={14} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomSkeletonTheme>
  );
}
