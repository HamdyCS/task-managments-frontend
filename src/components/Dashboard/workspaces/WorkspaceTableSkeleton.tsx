import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonThemeProvider from "../../ui/SkeletonTheme";

export default function WorkspaceTableSkeleton() {
  return (
    <SkeletonThemeProvider>
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">
                  <Skeleton width={100} height={12} />
                </th>
                <th className="p-4 font-medium">
                  <Skeleton width={80} height={12} />
                </th>
                <th className="p-4 font-medium">
                  <Skeleton width={60} height={12} />
                </th>
                <th className="p-4 font-medium">
                  <Skeleton width={80} height={12} />
                </th>
                <th className="p-4 font-medium">
                  <Skeleton width={80} height={12} />
                </th>
                <th className="p-4 font-medium text-right">
                  <Skeleton width={40} height={12} />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="p-4">
                    <Skeleton width="70%" height={16} />
                  </td>
                  <td className="p-4">
                    <Skeleton width="50%" height={16} />
                  </td>
                  <td className="p-4">
                    <Skeleton width={60} height={20} />
                  </td>
                  <td className="p-4">
                    <Skeleton width="40%" height={16} />
                  </td>
                  <td className="p-4">
                    <Skeleton width="40%" height={16} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton width={28} height={28} />
                      <Skeleton width={28} height={28} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SkeletonThemeProvider>
  );
}
