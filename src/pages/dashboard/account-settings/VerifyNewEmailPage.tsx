import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, Link } from "react-router-dom";
import useConfirmChangeEmail from "../../../hooks/auth/useConfirmChangeEmail";
import AccountActionResult from "../../../components/account-settings/AccountActionResult";

export default function VerifyNewEmailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const confirmChangeEmailMutation = useConfirmChangeEmail({
    onSuccess: () => {},
    onError: () => {},
  });

  useEffect(() => {
    if (token && email) {
      confirmChangeEmailMutation.mutateAsync({ token, newEmail: email });
    }
  }, [token, email]);

  if (!token || !email) {
    return (
      <div className="space-y-4">
        <AccountActionResult
          status="error"
          title={t("changeEmail.error")}
          message={t("changeEmail.errorMessage")}
        />
        <div className="flex justify-center">
          <Link
            to="/dashboard/account/email"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            {t("changeEmail.backToSettings")}
          </Link>
        </div>
      </div>
    );
  }

  if (confirmChangeEmailMutation.isPending) {
    return (
      <AccountActionResult
        status="loading"
        title={t("changeEmail.verifying")}
        message={t("changeEmail.verifyingMessage")}
      />
    );
  }

  if (!confirmChangeEmailMutation.isPending && !confirmChangeEmailMutation.isError) {
    return (
      <div className="space-y-4">
        <AccountActionResult
          status="success"
          title={t("changeEmail.success")}
          message={t("changeEmail.successMessage")}
        />
        <div className="flex justify-center">
          <Link
            to="/dashboard/account/email"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            {t("changeEmail.backToSettings")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AccountActionResult
        status="error"
        title={t("changeEmail.error")}
        message={t("changeEmail.errorMessage")}
      />
      <div className="flex justify-center">
        <Link
          to="/dashboard/account/email"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          {t("changeEmail.backToSettings")}
        </Link>
      </div>
    </div>
  );
}
