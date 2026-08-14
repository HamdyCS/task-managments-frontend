import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

export default function RequireGuest() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    window.history.back();
  }

  return <Outlet />;
}
