import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiArrowRight, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import Button from "../../ui/Button";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).*$/;

interface ResetPasswordStepProps {
  onSubmit: (newPassword: string) => void;
}

export function ResetPasswordStep({ onSubmit }: ResetPasswordStepProps) {
  const { t } = useTranslation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isAr = document.documentElement.dir === "rtl";

  const formik = useFormik({
    initialValues: { newPassword: "", confirmPassword: "" },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required(t("forgotPassword.resetPassword.validation.passwordRequired"))
        .min(8, t("forgotPassword.resetPassword.validation.passwordMin"))
        .max(80, t("forgotPassword.resetPassword.validation.passwordMax"))
        .matches(
          PASSWORD_REGEX,
          t("forgotPassword.resetPassword.validation.passwordRegex"),
        ),
      confirmPassword: Yup.string()
        .required(t("forgotPassword.resetPassword.validation.confirmRequired"))
        .oneOf(
          [Yup.ref("newPassword")],
          t("forgotPassword.resetPassword.validation.passwordMismatch"),
        ),
    }),
    onSubmit: (values) => {
      onSubmit(values.newPassword);
    },
  });

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("forgotPassword.resetPassword.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("forgotPassword.resetPassword.subtitle")}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {t("forgotPassword.resetPassword.newPassword")}
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              dir="ltr"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-foreground text-left shadow-sm pl-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            >
              {showNewPassword ? (
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
            {t("forgotPassword.resetPassword.confirmPassword")}
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
              className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-foreground text-left shadow-sm pl-10"
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

        <div className="p-3 rounded bg-muted/50 border border-border text-muted-foreground text-xs text-right flex items-start gap-2">
          <span className="text-primary mt-0.5 shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM7.25 5a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zM8 10.75a.75.75 0 100 1.5.75.75 0 000-1.5z"
                fill="currentColor"
              />
            </svg>
          </span>
          {t("forgotPassword.resetPassword.hint")}
        </div>

        <Button
          text={t("forgotPassword.resetPassword.submit")}
          ButtonType="submit"
          type="button"
          className="group w-full"
          Icon={
            <FiArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          }
        />
      </form>

      <div className="mt-6 text-center text-sm">
        <Link
          to="/sign-in"
          className="text-primary font-medium hover:text-primary/80 transition-colors inline-flex items-center gap-1"
        >
          {isAr ? (
            <FiArrowRight className="w-4 h-4" />
          ) : (
            <FiArrowLeft className="w-4 h-4" />
          )}
          {t("forgotPassword.resetPassword.backToLogin")}
        </Link>
      </div>
    </>
  );
}
