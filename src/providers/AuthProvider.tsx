import type { ReactNode } from "react";
import useCurrentUser from "../hooks/auth/useCurrentUser";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const {} = useCurrentUser();
  return <>{children}</>;
}
