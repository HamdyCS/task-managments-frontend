import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "../types/Role";
import useCurrentUser from "../hooks/auth/useCurrentUser";

export default function RequireRole({ role }: { role: Role }) {
  const { data: user, isPending } = useCurrentUser();

  if (isPending) return <></>;
  if (user?.role !== role) {
    return <Navigate to="/not-found" replace={true} />;
  }
  return <Outlet />;
}
