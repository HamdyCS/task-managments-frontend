import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CustomSkeletonTheme from "../../ui/CustomSkeletonTheme";

function TableSkeleton({ rows, columns }: { rows: number; columns: number[] }) {
  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <Skeleton width={140} height={16} />
        <Skeleton width={200} height={12} className="mt-1.5" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
              {columns.map((w, i) => (
                <th key={i} className="p-4 font-medium">
                  <Skeleton width={w} height={10} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-border/50">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="hover:bg-muted/50 transition-colors">
                {columns.map((w, j) => (
                  <td key={j} className="p-4">
                    <Skeleton width={w} height={14} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TeamsPageSkeleton() {
  return (
    <CustomSkeletonTheme>
      <div className="space-y-6 pb-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton width={160} height={28} />
            <Skeleton width={220} height={14} className="mt-2" />
          </div>
          <Skeleton width={140} height={36} borderRadius="0.5rem" />
        </div>

        {/* Members table skeleton */}
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <Skeleton width={100} height={16} />
            <Skeleton width={180} height={12} className="mt-1.5" />
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sent invites table skeleton */}
        <TableSkeleton rows={3} columns={[160, 100, 80, 60]} />

        {/* Received invites table skeleton */}
        <TableSkeleton rows={3} columns={[160, 100, 80, 80]} />
      </div>
    </CustomSkeletonTheme>
  );
}
