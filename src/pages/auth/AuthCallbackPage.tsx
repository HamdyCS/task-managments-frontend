import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn } from "../../animations";
import { useAppSelector } from "../../store/hooks";
import { toast } from "sonner";

export function AuthCallbackPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    //is authenticated
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        toast.success(t("callback.success"));

        //redirect to home page
        navigate("/", { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      //not authenticated
      const timer = setTimeout(() => {
        toast.error(t("callback.error"));
        //redirect to sign in page
        navigate("/sign-in", { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-6 text-center px-6"
      >
        <div className="text-2xl font-bold text-primary">WorkPilot</div>

        <div className="flex flex-col items-center gap-3">
          <span className="size-8 animate-spin rounded-full border-[3px] border-current border-t-transparent text-primary" />
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-foreground">
              {t("callback.signingIn")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("callback.pleaseWait")}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
