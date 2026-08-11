import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";
import { MdLock } from "react-icons/md";
import useLogin from "../../hooks/auth/useLogin";
import { SocialLoginProviders } from "../../components/auth/SocialLoginProviders";
import Button from "../../components/ui/Button";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const loginMutation = useLogin({
    onSuccess: () => {
      toast.success(t("login.title"));
      navigate("/");
    },
    onError: () => {
      const message = t("login.error.generic");
      toast.error(message);
      setServerError(message);
    },
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("login.validation.emailInvalid"))
        .required(t("login.validation.emailRequired")),
      password: Yup.string()
        .min(8, t("login.validation.passwordMin"))
        .required(t("login.validation.passwordRequired")),
    }),
    onSubmit: (values) => {
      setServerError(null);
      loginMutation.mutateAsync(values);
    },
  });

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("login.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("login.subtitle")}
        </p>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="mb-4 p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {t("login.email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            dir="ltr"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-foreground text-left shadow-sm"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="mt-1 text-xs text-destructive">
              {formik.errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              {t("login.password")}
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              dir="ltr"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-foreground text-left shadow-sm pl-10 "
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
          {formik.touched.password && formik.errors.password && (
            <p className="mt-1 text-xs text-destructive">
              {formik.errors.password}
            </p>
          )}
          <div className="mt-2 text-left">
            <Link
              to="/forgot-password"
              className="text-xs text-primary font-medium hover:text-primary/80 transition-colors"
            >
              {t("login.forgotPassword")}
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          text={t("login.submit")}
          isLoading={loginMutation.isPending}
          ButtonType="submit"
          type="button"
          className="group w-full"
          Icon={
            <FiArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          }
        />
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-border" />
        <span className="mx-4 text-xs text-muted-foreground">
          {t("login.or")}
        </span>
        <div className="flex-grow border-t border-border" />
      </div>

      <SocialLoginProviders />

      {/* Signup Link */}
      <div className="mt-8 text-center text-sm">
        <span className="text-muted-foreground">
          {t("login.noAccount")}{" "}
        </span>
        <Link
          to="/sign-up"
          className="text-primary font-medium hover:text-primary/80 transition-colors mr-1"
        >
          {t("login.createAccount")}
        </Link>
      </div>

      {/* Trust Indicator */}
      <div className="mt-8 flex items-center justify-center text-xs text-muted-foreground gap-1.5 opacity-80">
        <MdLock className="w-4 h-4" />
        {t("login.trust")}
      </div>
    </>
  );
}
