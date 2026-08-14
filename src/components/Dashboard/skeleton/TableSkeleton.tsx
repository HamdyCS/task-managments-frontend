import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TableSkeleton() {
  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <Skeleton width={160} height={20} />
        <div className="flex gap-4">
          <Skeleton width={20} height={20} />
          <Skeleton width={80} height={16} />
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-5 gap-4 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="80%" height={14} />
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, row) => (
          <div key={row} className="grid grid-cols-5 gap-4 py-4 border-t border-border/50">
            {Array.from({ length: 5 }).map((_, col) => (
              <Skeleton key={col} width={col === 0 ? "70%" : "60%"} height={14} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
