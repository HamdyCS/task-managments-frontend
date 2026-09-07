import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { FiLock, FiCheckCircle, FiMail } from "react-icons/fi";
import useSendPasswordResetEmail from "../../hooks/auth/useSendPasswordResetEmail";

export default function PasswordSection() {
  const { t } = useTranslation();
  const [emailSent, setEmailSent] = useState(false);

  const sendPasswordResetEmailMutation = useSendPasswordResetEmail({
    onSuccess: () => {
      setEmailSent(true);
      toast.success(t("dashboard.accountSettings.password.checkYourEmail"));
    },
    onError: () => {
      toast.error(t("dashboard.accountSettings.password.error"));
    },
  });

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FiLock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {t("dashboard.accountSettings.password.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.accountSettings.password.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {emailSent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-3 p-4 bg-success/10 border border-success/20 rounded-lg"
            >
              <FiCheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("dashboard.accountSettings.password.checkYourEmail")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("dashboard.accountSettings.password.checkYourEmailMessage")}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="action"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t("dashboard.accountSettings.password.updatePassword")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.accountSettings.password.emailHint")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => sendPasswordResetEmailMutation.mutateAsync()}
                disabled={sendPasswordResetEmailMutation.isPending}
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
              >
                {sendPasswordResetEmailMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <FiMail className="w-4 h-4" />
                )}
                {t("dashboard.accountSettings.password.sendResetEmail")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
