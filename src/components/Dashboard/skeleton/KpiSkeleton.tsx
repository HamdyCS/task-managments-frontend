import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function KpiSkeleton() {
  return (
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
  );
}
