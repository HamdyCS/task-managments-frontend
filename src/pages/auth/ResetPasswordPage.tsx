import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useResetPasswordWithToken from "../../hooks/auth/useResetPasswordWithToken";
import AccountActionResult from "../../components/account-settings/AccountActionResult";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    token ? "idle" : "error",
  );

  const resetPasswordMutation = useResetPasswordWithToken({
    onSuccess: () => {
      setStatus("success");
    },
    onError: () => {
      setStatus("error");
    },
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, t("dashboard.accountSettings.validation.passwordMinLength"))
        .required(t("dashboard.accountSettings.validation.passwordRequired")),
      confirmPassword: Yup.string()
        .required(t("dashboard.accountSettings.validation.repeatPasswordRequired"))
        .oneOf(
          [Yup.ref("newPassword")],
          t("dashboard.accountSettings.validation.passwordMismatch"),
        ),
    }),
    onSubmit: (values) => {
      if (!token) return;
      setStatus("loading");
      resetPasswordMutation.mutateAsync({
        token,
        newPassword: values.newPassword,
      });
    },
  });

  if (status === "loading") {
    return (
      <AccountActionResult
        status="loading"
        title={t("resetPassword.resetting")}
        message={t("resetPassword.resettingMessage")}
      />
    );
  }

  if (status === "success") {
    return (
      <div className="space-y-4">
        <AccountActionResult
          status="success"
          title={t("resetPassword.success")}
          message={t("resetPassword.successMessage")}
        />
        <div className="flex justify-center">
          <Link
            to="/sign-in"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            {t("resetPassword.goToSignIn")}
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error" && !token) {
    return (
      <div className="space-y-4">
        <AccountActionResult
          status="error"
          title={t("resetPassword.error")}
          message={t("resetPassword.invalidLink")}
        />
        <div className="flex justify-center">
          <Link
            to="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            {t("resetPassword.goHome")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("resetPassword.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("resetPassword.subtitle")}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              {t("resetPassword.newPassword")}
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                dir="ltr"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newPassword}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm text-card-foreground text-left pl-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <FiEye className="w-5 h-5" />
                ) : (
                  <FiEyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="mt-1 text-xs text-destructive">
                {formik.errors.newPassword}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              {t("resetPassword.confirmPassword")}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                dir="ltr"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm text-card-foreground text-left pl-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              >
                {showConfirmPassword ? (
                  <FiEye className="w-5 h-5" />
                ) : (
                  <FiEyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          {status === "error" && (
            <div className="p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
              {t("resetPassword.error")}
            </div>
          )}

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {resetPasswordMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : null}
            {t("resetPassword.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
