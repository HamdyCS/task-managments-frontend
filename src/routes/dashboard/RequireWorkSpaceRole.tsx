import React from "react";
import type { WorkSpaceRole } from "../../types/WorkSpaceRole";
import { useAppSelector } from "../../store/hooks";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  role: WorkSpaceRole | WorkSpaceRole[];
}
export default function RequireWorkSpaceRole({ role }: Props) {
  const currentWorkSpaceRole = useAppSelector(
    (state) => state.selectedWorkSpace.workSpaceRole,
  );

  return currentWorkSpaceRole === role || role.includes(currentWorkSpaceRole) ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard/access-denied" replace />
  );
}
