import { Toaster } from "sonner";
import { useTheme } from "../../hooks/theme/useTheme";

export function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} position="top-center" richColors />;
}