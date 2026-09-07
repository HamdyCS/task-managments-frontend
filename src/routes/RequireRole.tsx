import { Navigate } from "react-router-dom";
import type { Role } from "../types/Role";
import { useAppSelector } from "../store/hooks";

interface RequireRoleProps {
  role: Role;
  children: React.ReactNode;
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const authUser = useAppSelector((state) => state.auth.user);
  if (authUser?.role !== role) {
    return <Navigate to="/not-found" replace={true} />;
  }
  return children;
}
