import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../../services/adminDashboardService";
import type { AdminDashboardDto } from "../../dtos/admin/AdminDashboardDto";
import type { AxiosError } from "axios";

const STALE_TIME = 10 * 60 * 1000; // 10 minutes

export default function useAdminDashboard() {
  return useQuery<AdminDashboardDto, AxiosError>({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
    staleTime: STALE_TIME, 
    // اعتبر البيانات Fresh لمدة 10 دقائق،
    // وبعدها تصبح Stale ويمكن إعادة جلبها عند أول فرصة مناسبة.

    
    refetchInterval: STALE_TIME, //كل 10 دقائق اعمل api request
  });
}
