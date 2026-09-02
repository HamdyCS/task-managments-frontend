import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CustomSkeletonTheme from "../../ui/CustomSkeletonTheme";

export default function NotificationSkeleton() {
  return (
    <div className="space-y-2">
      <CustomSkeletonTheme>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3.5 p-4 rounded-xl bg-card"
          >
            <Skeleton width={36} height={36} className="rounded-lg shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton width="45%" height={14} />
              </div>
              <Skeleton width="80%" height={12} className="mb-1" />
              <Skeleton width={80} height={10} />
            </div>
          </div>
        ))}
      </CustomSkeletonTheme>
    </div>
  );
}
