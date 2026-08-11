import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import Button from "../../ui/Button";

interface SendOtpStepProps {
  onSubmit: (email: string) => void;
  isPending: boolean;
}

export function SendOtpStep({ onSubmit, isPending }: SendOtpStepProps) {
  const { t } = useTranslation();

  const isAr = document.documentElement.dir === "rtl";

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("forgotPassword.sendOtp.validation.emailInvalid"))
        .required(t("forgotPassword.sendOtp.validation.emailRequired")),
    }),
    onSubmit: (values) => {
      onSubmit(values.email);
    },
  });

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("forgotPassword.sendOtp.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("forgotPassword.sendOtp.subtitle")}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {t("forgotPassword.sendOtp.email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
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

        <Button
          text={t("forgotPassword.sendOtp.submit")}
          isLoading={isPending}
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
          {t("forgotPassword.sendOtp.backToLogin")}
        </Link>
      </div>
    </>
  );
}
