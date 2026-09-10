import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CustomSkeletonTheme from "../../../ui/CustomSkeletonTheme";

export default function AdminWorkspacesSkeleton() {
  return (
    <CustomSkeletonTheme>
      <div className="space-y-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton width={220} height={28} />
            <Skeleton width={300} height={14} className="mt-2" />
          </div>
        </div>

        <div className="flex gap-3">
          <Skeleton width={240} height={40} borderRadius="0.5rem" />
          <Skeleton width={240} height={40} borderRadius="0.5rem" />
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b text-muted-foreground text-xs uppercase tracking-wider">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <th key={i} className="p-4 font-medium">
                      <Skeleton width={i === 6 ? 30 : 80} height={10} />
                    </th>
                  ))}
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
                      <Skeleton width={100} height={14} />
                    </td>
                    <td className="p-4">
                      <Skeleton width={30} height={14} />
                    </td>
                    <td className="p-4">
                      <Skeleton width={30} height={14} />
                    </td>
                    <td className="p-4">
                      <Skeleton width={30} height={14} />
                    </td>
                    <td className="p-4">
                      <Skeleton width={80} height={14} />
                    </td>
                    <td className="p-4 flex justify-end">
                      <Skeleton width={30} height={30} borderRadius="0.5rem" />
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
