import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { Role } from "../types/Role";

export default function RequireRole({ role }: { role: Role }) {
  const user = useAppSelector((state) => state.auth.user);
  if (user?.role !== role) {
    return <Navigate to="/not-found" replace={true} />;
  }
  return <Outlet />;
}
