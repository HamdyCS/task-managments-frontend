import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { FiAlertTriangle } from "react-icons/fi";
import useDeleteAccountConfirm from "../../../hooks/auth/useDeleteAccountConfirm";

export default function DeleteAccountConfirmPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [confirmed, setConfirmed] = useState(false);

  const deleteAccountMutation = useDeleteAccountConfirm({
    onSuccess: () => {
      setConfirmed(true);
      toast.success(t("dashboard.accountSettings.deleteAccount.success"));
    },
    onError: () => {
      toast.error(t("dashboard.accountSettings.deleteAccount.error"));
    },
  });

  if (!token) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {t("dashboard.accountSettings.deleteAccount.invalid link")}
          </h2>
          <p className="text-muted-foreground">
            {t("dashboard.accountSettings.deleteAccount.invalid link message")}
          </p>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {t("dashboard.accountSettings.deleteAccount.success")}
          </h2>
          <p className="text-muted-foreground">
            {t("dashboard.accountSettings.deleteAccount.success message")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-destructive/10 rounded-full">
            <FiAlertTriangle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("dashboard.accountSettings.deleteAccount.confirm delete title")}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {t(
            "dashboard.accountSettings.deleteAccount.confirm delete message",
          )}
        </p>

        <button
          type="button"
          onClick={() => deleteAccountMutation.mutateAsync(token)}
          disabled={deleteAccountMutation.isPending}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleteAccountMutation.isPending ? (
            <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
          ) : null}
          {t("dashboard.accountSettings.deleteAccount.confirm delete button")}
        </button>
      </div>
    </div>
  );
}
