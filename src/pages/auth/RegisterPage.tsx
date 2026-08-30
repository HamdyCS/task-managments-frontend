import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { FiEye, FiEyeOff, FiArrowLeft, FiCheck } from "react-icons/fi";
import useRegister from "../../hooks/auth/useRegister";
import { SocialLoginProviders } from "../../components/auth/SocialLoginProviders";
import Button from "../../components/ui/Button";
import { PASSWORD_REGEX } from "../../common/Regex";

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const registerMutation = useRegister({
    onSuccess: () => {
      toast.success(t("register.success.message"));
      navigate("/verify-email");
    },
    onError: () => {
      const message = t("register.error.generic");
      toast.error(message);
      setServerError(message);
    },
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(
        t("register.validation.firstNameRequired"),
      ),
      lastName: Yup.string().required(
        t("register.validation.lastNameRequired"),
      ),
      email: Yup.string()
        .email(t("register.validation.emailInvalid"))
        .required(t("register.validation.emailRequired")),
      dateOfBirth: Yup.string()
        .required(t("register.validation.dobRequired"))
        .test("age", t("register.validation.age"), (value) => {
          const today = new Date();
          const birthDate = new Date(value);

          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          return age >= 18;
        }),

      password: Yup.string()
        .min(8, t("register.validation.passwordMin"))
        .matches(PASSWORD_REGEX, t("register.validation.passwordRegex"))
        .required(t("register.validation.passwordRequired")),
      confirmPassword: Yup.string()
        .required(t("register.validation.confirmRequired"))
        .oneOf(
          [Yup.ref("password")],
          t("register.validation.passwordMismatch"),
        ),
    }),
    onSubmit: (values) => {
      setServerError(null);
      const registerData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        dateOfBirth: values.dateOfBirth,
      };
      registerMutation.mutateAsync(registerData);
    },
  });

  const password = formik.values.password;
  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: PASSWORD_REGEX.test(password),
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("register.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("register.subtitle")}
        </p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              {t("register.firstName")}
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder={t("register.firstNamePlaceholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-foreground shadow-sm"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="mt-1 text-xs text-destructive">
                {formik.errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              {t("register.lastName")}
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder={t("register.lastNamePlaceholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-foreground shadow-sm"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="mt-1 text-xs text-destructive">
                {formik.errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {t("register.email")}
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

        {/* Date of Birth */}
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {t("register.dob")}
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.dateOfBirth}
            className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-foreground shadow-sm"
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
            <p className="mt-1 text-xs text-destructive">
              {formik.errors.dateOfBirth}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {t("register.password")}
          </label>
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
              className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-foreground text-left shadow-sm pl-10"
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
          {/* Password Strength Checklist */}
          {formik.touched.password && (
            <div className="mt-2 text-xs space-y-1">
              <div
                className={`flex items-center gap-2 ${passwordChecks.length && "text-blue-500"}`}
              >
                <FiCheck
                  className={`w-3.5 h-3.5 ${passwordChecks.length ? "opacity-100" : "opacity-30"}`}
                />
                <span>{t("register.passwordChecks.length")}</span>
              </div>
              <div
                className={`flex items-center gap-2 ${passwordChecks.upper && "text-blue-500"}`}
              >
                <FiCheck
                  className={`w-3.5 h-3.5 ${passwordChecks.upper ? "opacity-100" : "opacity-30"}`}
                />
                <span>{t("register.passwordChecks.upper")}</span>
              </div>
              <div
                className={`flex items-center gap-2 ${passwordChecks.number && "text-blue-500"}`}
              >
                <FiCheck
                  className={`w-3.5 h-3.5 ${passwordChecks.number ? "opacity-100" : "opacity-30"}`}
                />
                <span>{t("register.passwordChecks.number")}</span>
              </div>
              <div
                className={`flex items-center gap-2 ${passwordChecks.special && "text-blue-500"}`}
              >
                <FiCheck
                  className={`w-3.5 h-3.5 ${passwordChecks.special ? "opacity-100" : "opacity-30"}`}
                />
                <span>{t("register.passwordChecks.special")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {t("register.confirmPassword")}
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

        {/* Submit */}
        <Button
          text={t("register.submit")}
          isLoading={registerMutation.isPending}
          ButtonType="submit"
          type="button"
          className="group w-full"
          Icon={
            <FiArrowLeft className="ml-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
          }
        />
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-border" />
        <span className="mx-4 text-xs text-muted-foreground">
          {t("register.or")}
        </span>
        <div className="flex-grow border-t border-border" />
      </div>

      <SocialLoginProviders />

      {/* Signin Link */}
      <div className="mt-8 text-center text-sm">
        <span className="text-muted-foreground">
          {t("register.hasAccount")}{" "}
        </span>
        <Link
          to="/sign-in"
          className="text-primary font-medium hover:text-primary/80 transition-colors"
        >
          {t("register.signIn")}
        </Link>
      </div>
    </>
  );
}
