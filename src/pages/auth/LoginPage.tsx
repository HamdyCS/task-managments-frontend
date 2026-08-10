import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { FiEye, FiEyeOff, FiArrowRight, FiSun, FiMoon, FiGlobe } from "react-icons/fi";
import { MdLock, MdCheck } from "react-icons/md";
import { slideInLeft, slideInRight } from "../../animations";
import useLogin from "../../hooks/auth/useLogin";
import { useTheme } from "../../hooks/theme/useTheme";
import { useLanguage } from "../../hooks/language/useLanguage";
import { SocialLoginProviders } from "../../components/auth/SocialLoginProviders";
import Button from "../../components/ui/Button";

const featureGridItemTitle: string[] = [
  "login.features.projects",
  "login.features.collaboration",
  "login.features.analytics",
];

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const isAr = language === "ar";
  const toggleLanguage = () => changeLanguage(isAr ? "en" : "ar");

  const loginMutation = useLogin({
    onSuccess: () => {
      toast.success(t("login.title"));
      navigate("/");
    },
    onError: (error) => {
      const data = error.response?.data as { message?: string } | undefined;
      const message = data?.message || t("login.error.generic");
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
    <div className="min-h-screen flex text-foreground overflow-hidden relative bg-background">
      {/* Ambient Background Glow for Mobile */}
      <div className="ambient-glow top-0 left-0 -translate-x-1/2 -translate-y-1/2 md:hidden" />

      {/* Right Side: Login Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 relative z-10 bg-transparent">
        {/* Mobile Logo */}
        <div className="md:hidden mb-8 flex items-center justify-center w-full">
          <div className="h-10 text-2xl font-bold text-primary">WorkPilot</div>
        </div>

        <motion.div
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[420px] rounded-lg p-8 relative z-10 glass-panel"
        >
          {/* Theme & Language Toggles */}
          <div className="flex items-center justify-end gap-1 mb-4">
            <button
              type="button"
              onClick={toggleLanguage}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors h-9 px-2.5 rounded-lg hover:bg-accent inline-flex items-center gap-1.5"
              aria-label="Toggle language"
            >
              <FiGlobe className="w-4 h-4" />
              {isAr ? "EN" : "عربي"}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground transition-colors h-9 w-9 rounded-lg hover:bg-accent inline-flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <FiSun className="w-4 h-4" />
              ) : (
                <FiMoon className="w-4 h-4" />
              )}
            </button>
          </div>

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
        </motion.div>
      </div>

      {/* Left Side: Marketing Panel (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 relative bg-background border-l border-border overflow-hidden flex-col">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50 z-0" />

        {/* Large Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />

        <motion.div
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
          className="relative z-10 p-12 lg:p-16 flex flex-col h-full"
        >
          {/* Logo */}
          <div className="mb-12">
            <div className="h-10 text-2xl font-bold text-primary">
              WorkPilot
            </div>
          </div>

          {/* Copy */}
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight drop-shadow-sm">
              {t("login.title")}
              <br />
              <span className="text-primary">{t("login.subtitle")}</span>
            </h2>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              {t("login.subtitle")}
            </p>

            {/* Benefits List */}
            <ul className="space-y-3 mb-12">
              {featureGridItemTitle.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center text-foreground font-medium text-sm gap-1"
                >
                  <span className="w-5 h-5 rounded-full bg-success text-success-foreground flex items-center justify-center ml-3 shadow-sm">
                    <MdCheck className="w-3 h-3" />
                  </span>
                  {t(item)}
                </li>
              ))}
            </ul>
          </div>

          {/* UI Preview (Bento Grid Style) */}
          <div className="mt-auto relative w-full pt-8">
            <div className="bg-card rounded-t-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] border border-border border-b-0 p-6 flex flex-col gap-4 relative overflow-hidden transform translate-y-4 hover:translate-y-2 transition-transform duration-500">
              {/* Header Mock */}
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 w-32 bg-muted rounded-sm" />
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted" />
                  <div className="h-6 w-6 rounded-full bg-muted" />
                  <div className="h-6 w-6 rounded-full bg-primary/20" />
                </div>
              </div>

              {/* Layout Mock */}
              <div className="grid grid-cols-3 gap-4">
                {/* Kanban Column 1 */}
                <div className="space-y-3">
                  <div className="h-3 w-20 bg-muted rounded-sm mb-4" />
                  <div className="h-24 bg-background border border-border rounded-lg p-3 flex flex-col gap-2">
                    <div className="h-2 w-3/4 bg-border rounded-sm" />
                    <div className="h-2 w-1/2 bg-muted rounded-sm" />
                    <div className="mt-auto flex justify-between">
                      <div className="h-4 w-12 bg-success/20 rounded-sm" />
                      <div className="h-4 w-4 rounded-full bg-border" />
                    </div>
                  </div>
                  <div className="h-20 bg-background border border-border rounded-lg p-3 flex flex-col gap-2 opacity-70">
                    <div className="h-2 w-full bg-border rounded-sm" />
                    <div className="h-2 w-2/3 bg-muted rounded-sm" />
                  </div>
                </div>

                {/* Kanban Column 2 */}
                <div className="space-y-3">
                  <div className="h-3 w-24 bg-muted rounded-sm mb-4" />
                  <div className="h-28 bg-background border border-primary/30 rounded-lg p-3 flex flex-col gap-2 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    <div className="h-2 w-4/5 bg-border rounded-sm" />
                    <div className="h-2 w-full bg-muted rounded-sm" />
                    <div className="mt-auto flex justify-between">
                      <div className="h-4 w-16 bg-primary/10 rounded-sm" />
                      <div className="flex -space-x-1 space-x-reverse">
                        <div className="h-4 w-4 rounded-full bg-border border border-background" />
                        <div className="h-4 w-4 rounded-full bg-muted border border-background" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Side */}
                <div className="space-y-4">
                  <div className="h-3 w-16 bg-muted rounded-sm mb-4" />
                  <div className="h-24 bg-background border border-border rounded-lg p-3 flex items-end gap-1">
                    <div className="w-1/4 bg-primary/20 rounded-t-sm h-1/3" />
                    <div className="w-1/4 bg-primary/40 rounded-t-sm h-2/3" />
                    <div className="w-1/4 bg-primary/60 rounded-t-sm h-1/2" />
                    <div className="w-1/4 bg-primary rounded-t-sm h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
