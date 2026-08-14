import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BAR_HEIGHTS = ["40%", "55%", "70%", "45%", "85%"];

export default function ChartSkeleton() {
  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <Skeleton width={160} height={20} />
        <Skeleton width={100} height={16} />
      </div>
      <div className="flex items-end justify-between gap-4 h-[200px] pt-4">
        {BAR_HEIGHTS.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton
              width="100%"
              height={height}
              borderRadius="4px 4px 0 0"
            />
            <Skeleton width={50} height={12} />
          </div>
        ))}
      </div>
    </div>
  );
}
