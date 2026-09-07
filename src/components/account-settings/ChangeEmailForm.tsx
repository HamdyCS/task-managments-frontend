import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { FiArrowLeft, FiSend } from "react-icons/fi";
import useSendChangeEmail from "../../hooks/auth/useSendChangeEmail";

interface ChangeEmailFormProps {
  onCancel: () => void;
}

export default function ChangeEmailForm({ onCancel }: ChangeEmailFormProps) {
  const { t } = useTranslation();

  const sendChangeEmailMutation = useSendChangeEmail({
    onSuccess: () => {
      toast.success(t("dashboard.accountSettings.email.checkYourEmail"));
      onCancel();
    },
    onError: () => {
      toast.error(t("dashboard.accountSettings.email.error"));
    },
  });

  const formik = useFormik({
    initialValues: {
      newEmail: "",
    },
    validationSchema: Yup.object({
      newEmail: Yup.string()
        .email(t("dashboard.accountSettings.validation.emailInvalid"))
        .required(t("dashboard.accountSettings.validation.emailRequired")),
    }),
    onSubmit: (values) => {
      sendChangeEmailMutation.mutateAsync(values.newEmail);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="newEmail"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {t("dashboard.accountSettings.email.newEmail")}
        </label>
        <input
          id="newEmail"
          name="newEmail"
          type="email"
          placeholder="new@example.com"
          dir="ltr"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.newEmail}
          className="w-full px-3.5 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-left"
        />
        {formik.touched.newEmail && formik.errors.newEmail && (
          <p className="mt-1.5 text-xs text-destructive">
            {formik.errors.newEmail}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 justify-end pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          {t("dashboard.accountSettings.email.cancel")}
        </button>
        <button
          type="submit"
          disabled={sendChangeEmailMutation.isPending}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sendChangeEmailMutation.isPending ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <FiSend className="w-4 h-4" />
          )}
          {t("dashboard.accountSettings.email.sendConfirmation")}
        </button>
      </div>
    </form>
  );
}
