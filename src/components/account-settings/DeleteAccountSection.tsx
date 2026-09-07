import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { FiTrash2, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import useDeleteAccountSendEmail from "../../hooks/auth/useDeleteAccountSendEmail";

type DeleteAccountState = "idle" | "confirm_dialog" | "sending_email" | "email_sent";

export default function DeleteAccountSection() {
  const { t } = useTranslation();
  const [state, setState] = useState<DeleteAccountState>("idle");

  const sendEmailMutation = useDeleteAccountSendEmail({
    onSuccess: () => {
      setState("email_sent");
      toast.success(t("dashboard.accountSettings.deleteAccount.email sent"));
    },
    onError: () => {
      setState("idle");
      toast.error(
        t("dashboard.accountSettings.deleteAccount.error sending email"),
      );
    },
  });

  const handleDeleteClick = () => {
    setState("confirm_dialog");
  };

  const handleConfirmDelete = () => {
    setState("sending_email");
    sendEmailMutation.mutateAsync();
  };

  const handleCancel = () => {
    setState("idle");
  };

  return (
    <div className="bg-card border border-destructive/30 rounded-xl">
      <div className="p-6 border-b border-destructive/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <FiAlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-destructive">
              {t("dashboard.accountSettings.deleteAccount.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.accountSettings.deleteAccount.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <button
                type="button"
                onClick={handleDeleteClick}
                className="flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                {t("dashboard.accountSettings.deleteAccount.deleteButton")}
              </button>
            </motion.div>
          )}

          {state === "confirm_dialog" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                <p className="text-sm text-foreground">
                  {t(
                    "dashboard.accountSettings.deleteAccount.confirmMessage",
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {t("dashboard.accountSettings.deleteAccount.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={sendEmailMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  {sendEmailMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                  ) : null}
                  {t("dashboard.accountSettings.deleteAccount.confirm")}
                </button>
              </div>
            </motion.div>
          )}

          {state === "sending_email" && (
            <motion.div
              key="sending"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3 p-4 bg-muted rounded-lg"
            >
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">
                {t("dashboard.accountSettings.deleteAccount.sending email")}
              </p>
            </motion.div>
          )}

          {state === "email_sent" && (
            <motion.div
              key="email-sent"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-3 p-4 bg-success/10 border border-success/20 rounded-lg"
            >
              <FiCheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("dashboard.accountSettings.deleteAccount.check your email")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t(
                    "dashboard.accountSettings.deleteAccount.check your email message",
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
