import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TeamSkeleton() {
  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <Skeleton width={160} height={20} className="mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3 w-1/3">
              <Skeleton width={32} height={32} circle />
              <Skeleton width={100} height={14} />
            </div>
            <div className="w-1/2 px-4">
              <Skeleton width="100%" height={6} borderRadius={9999} />
            </div>
            <div className="w-1/6 text-right">
              <Skeleton width={80} height={12} className="ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
