import { Toaster } from "sonner";
import { useAppSelector } from "../../store/hooks";

export function ThemedToaster() {
  const theme = useAppSelector((state) => state.theme);
  return <Toaster theme={theme} position="top-center" richColors />;
}