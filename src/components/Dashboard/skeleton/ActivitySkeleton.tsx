import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ActivitySkeleton() {
  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <Skeleton width={140} height={20} className="mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton width={8} height={8} circle className="mt-2 shrink-0" />
            <div className="flex-1">
              <Skeleton width="80%" height={14} className="mb-1" />
              <Skeleton width={80} height={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
