import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { toast } from "sonner";
import useRegisterAdmin from "../../../hooks/admin/useRegisterAdmin";
import { PASSWORD_REGEX } from "../../../common/Regex";
import Button from "../../ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterAdminModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerAdminMutation = useRegisterAdmin({
    onSuccess: () => {
      toast.success(t("dashboard.admin.users.registerModal.success"));
      formik.resetForm();
      onClose();
    },
    onError: () => {
      toast.error(t("dashboard.admin.users.registerModal.error"));
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
      const registerData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        dateOfBirth: values.dateOfBirth,
      };
      registerAdminMutation.mutateAsync(registerData);
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-popover text-popover-foreground border border-border rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {t("dashboard.admin.users.registerModal.title")}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="admin-firstName"
                      className="block text-xs font-medium text-muted-foreground mb-1.5"
                    >
                      {t("register.firstName")}
                    </label>
                    <input
                      id="admin-firstName"
                      name="firstName"
                      type="text"
                      placeholder={t("register.firstNamePlaceholder")}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstName}
                      className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <p className="mt-1 text-xs text-destructive">
                        {formik.errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="admin-lastName"
                      className="block text-xs font-medium text-muted-foreground mb-1.5"
                    >
                      {t("register.lastName")}
                    </label>
                    <input
                      id="admin-lastName"
                      name="lastName"
                      type="text"
                      placeholder={t("register.lastNamePlaceholder")}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastName}
                      className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <p className="mt-1 text-xs text-destructive">
                        {formik.errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="admin-email"
                    className="block text-xs font-medium text-muted-foreground mb-1.5"
                  >
                    {t("register.email")}
                  </label>
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    dir="ltr"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-left"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-xs text-destructive">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="admin-dateOfBirth"
                    className="block text-xs font-medium text-muted-foreground mb-1.5"
                  >
                    {t("register.dob")}
                  </label>
                  <input
                    id="admin-dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.dateOfBirth}
                    className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                    <p className="mt-1 text-xs text-destructive">
                      {formik.errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-medium text-muted-foreground mb-1.5"
                  >
                    {t("register.password")}
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      dir="ltr"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-left pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground transition-colors focus:outline-none"
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
                  {formik.touched.password && (
                    <div className="mt-2 text-xs space-y-1">
                      <div
                        className={`flex items-center gap-2 ${passwordChecks.length ? "text-blue-500" : ""}`}
                      >
                        <FiCheck
                          className={`w-3.5 h-3.5 ${passwordChecks.length ? "opacity-100" : "opacity-30"}`}
                        />
                        <span>{t("register.passwordChecks.length")}</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${passwordChecks.upper ? "text-blue-500" : ""}`}
                      >
                        <FiCheck
                          className={`w-3.5 h-3.5 ${passwordChecks.upper ? "opacity-100" : "opacity-30"}`}
                        />
                        <span>{t("register.passwordChecks.upper")}</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${passwordChecks.number ? "text-blue-500" : ""}`}
                      >
                        <FiCheck
                          className={`w-3.5 h-3.5 ${passwordChecks.number ? "opacity-100" : "opacity-30"}`}
                        />
                        <span>{t("register.passwordChecks.number")}</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${passwordChecks.special ? "text-blue-500" : ""}`}
                      >
                        <FiCheck
                          className={`w-3.5 h-3.5 ${passwordChecks.special ? "opacity-100" : "opacity-30"}`}
                        />
                        <span>{t("register.passwordChecks.special")}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="admin-confirmPassword"
                    className="block text-xs font-medium text-muted-foreground mb-1.5"
                  >
                    {t("register.confirmPassword")}
                  </label>
                  <div className="relative">
                    <input
                      id="admin-confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      dir="ltr"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                      className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-left pl-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <FiEye className="w-5 h-5" />
                      ) : (
                        <FiEyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="mt-1 text-xs text-destructive">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors cursor-pointer"
                  >
                    {t("dashboard.admin.users.registerModal.cancel")}
                  </button>
                  <Button
                    ButtonType="submit"
                    isLoading={registerAdminMutation.isPending}
                    text={
                      registerAdminMutation.isPending
                        ? "..."
                        : t("dashboard.admin.users.registerModal.submit")
                    }
                    type={"button"}
                  />
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
