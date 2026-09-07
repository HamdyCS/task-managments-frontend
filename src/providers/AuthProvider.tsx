import type { ReactNode } from "react";
import useCurrentUser from "../hooks/auth/useCurrentUser";
import AuthSpinner from "../components/ui/AuthSpinner";
import { useAppSelector } from "../store/hooks";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { isPending, data } = useCurrentUser();
  const authUser = useAppSelector((state) => state.auth.user);

  //wait until fetching data for current user
  if (isPending || (!authUser && data)) return <AuthSpinner />;
  return children;
}
