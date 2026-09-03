import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CustomSkeletonTheme from "../../ui/CustomSkeletonTheme";

export default function ReportsSkeleton() {
  return (
    <CustomSkeletonTheme>
      <div className="space-y-6 pb-6">
        <div className="flex justify-between items-center">
          <Skeleton width={200} height={28} />
          <Skeleton width={220} height={40} borderRadius={12} />
        </div>

        <div className="flex gap-2">
          <Skeleton width={100} height={36} borderRadius={8} />
          <Skeleton width={100} height={36} borderRadius={8} />
          <Skeleton width={100} height={36} borderRadius={8} />
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <Skeleton width={160} height={20} className="mb-6" />
            <div className="flex items-center justify-center h-[220px]">
              <Skeleton circle width={200} height={200} />
            </div>
          </div>
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <Skeleton width={200} height={20} className="mb-6" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} width="100%" height={40} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </CustomSkeletonTheme>
  );
}
