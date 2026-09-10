import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CustomSkeletonTheme from "../../ui/CustomSkeletonTheme";

export default function UsersSkeleton() {
  return (
    <CustomSkeletonTheme>
      <div className="space-y-6 pb-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton width={200} height={28} />
            <Skeleton width={280} height={14} className="mt-2" />
          </div>
          <Skeleton width={160} height={36} borderRadius="0.5rem" />
        </div>

        {/* Admins table skeleton */}
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <Skeleton width={120} height={16} />
            <Skeleton width={200} height={12} className="mt-1.5" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">
                    <Skeleton width={80} height={10} />
                  </th>
                  <th className="p-4 font-medium">
                    <Skeleton width={60} height={10} />
                  </th>
                  <th className="p-4 font-medium">
                    <Skeleton width={40} height={10} />
                  </th>
                  <th className="p-4 font-medium">
                    <Skeleton width={100} height={10} />
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border/50">
                {Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton width={32} height={32} circle />
                        <Skeleton width={120} height={14} />
                      </div>
                    </td>
                    <td className="p-4">
                      <Skeleton width={160} height={14} />
                    </td>
                    <td className="p-4">
                      <Skeleton width={70} height={22} borderRadius={9999} />
                    </td>
                    <td className="p-4">
                      <Skeleton width={90} height={14} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users table skeleton */}
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex gap-1 bg-muted p-1 rounded-xl">
              <Skeleton width={120} height={32} borderRadius="0.5rem" />
              <Skeleton width={100} height={32} borderRadius="0.5rem" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">
                    <Skeleton width={80} height={10} />
                  </th>
                  <th className="p-4 font-medium">
                    <Skeleton width={60} height={10} />
                  </th>
                  <th className="p-4 font-medium">
                    <Skeleton width={40} height={10} />
                  </th>
                  <th className="p-4 font-medium">
                    <Skeleton width={100} height={10} />
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border/50">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton width={32} height={32} circle />
                        <Skeleton width={120} height={14} />
                      </div>
                    </td>
                    <td className="p-4">
                      <Skeleton width={160} height={14} />
                    </td>
                    <td className="p-4">
                      <Skeleton width={70} height={22} borderRadius={9999} />
                    </td>
                    <td className="p-4">
                      <Skeleton width={90} height={14} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CustomSkeletonTheme>
  );
}
