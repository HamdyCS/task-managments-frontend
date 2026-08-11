import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { FiArrowRight, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { MdCheck } from "react-icons/md";
import useSendOtp from "../../hooks/auth/useSendOtp";
import useResendOtp from "../../hooks/auth/useResendOtp";
import useResetPassword from "../../hooks/auth/useResetPassword";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setForgotPasswordNewPassword,
  clearForgotPasswordNewPassword,
} from "../../store/auth/authSlice";
import Button from "../../components/ui/Button";

type ForgotPasswordStep = "resetPassword" | "sendOtp" | "checkOtp" | "success";

const OTP_LENGTH = 6;
const RESEND_TIMER_SECONDS = 60;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).*$/;

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const reduxNewPassword = useAppSelector(
    (state) => state.auth.forgotPasswordNewPassword,
  );
  const [step, setStep] = useState<ForgotPasswordStep>("resetPassword");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RESEND_TIMER_SECONDS);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    return () => {
      dispatch(clearForgotPasswordNewPassword());
    };
  }, [dispatch]);

  const sendOtpMutation = useSendOtp({
    onSuccess: () => {
      setStep("checkOtp");
      setTimeLeft(RESEND_TIMER_SECONDS);
    },
    onError: (error) => {
      const data = error.response?.data as { message?: string } | undefined;
      toast.error(data?.message || t("forgotPassword.sendOtp.error.title"));
    },
  });

  const resendOtpMutation = useResendOtp({
    onSuccess: () => {
      setTimeLeft(RESEND_TIMER_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
      otpInputRefs.current[0]?.focus();
      toast.success(t("forgotPassword.checkOtp.resend"));
    },
    onError: (error) => {
      const data = error.response?.data as { message?: string } | undefined;
      toast.error(data?.message || t("login.error.generic"));
    },
  });

  const resetPasswordMutation = useResetPassword({
    onSuccess: () => {
      toast.success(t("forgotPassword.success.title"));
      setStep("success");
    },
    onError: (error) => {
      const data = error.response?.data as { message?: string } | undefined;
      toast.error(data?.message || t("forgotPassword.error.title"));
    },
  });

  useEffect(() => {
    if (step !== "checkOtp") return;
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [step, timeLeft]);

  const handleResendOtp = useCallback(() => {
    if (timeLeft > 0) return;
    resendOtpMutation.mutateAsync({ email });
  }, [timeLeft, email, resendOtpMutation]);

  const sendOtpFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("forgotPassword.sendOtp.validation.emailInvalid"))
        .required(t("forgotPassword.sendOtp.validation.emailRequired")),
    }),
    onSubmit: (values) => {
      setEmail(values.email);
      sendOtpMutation.mutateAsync({ email: values.email });
    },
  });

  const resetPasswordFormik = useFormik({
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
      dispatch(setForgotPasswordNewPassword(values.newPassword));
      setStep("sendOtp");
    },
  });

  const handleOtpSubmit = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== OTP_LENGTH) return;
    resetPasswordMutation.mutateAsync({
      email,
      newPassword: reduxNewPassword,
      otp: otpValue,
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    otpInputRefs.current[nextIndex]?.focus();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const isAr = document.documentElement.dir === "rtl";

  return (
    <AnimatePresence mode="wait">
      {/* Step 1: Reset Password */}
      {step === "resetPassword" && (
        <motion.div
          key="resetPassword"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t("forgotPassword.resetPassword.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("forgotPassword.resetPassword.subtitle")}
            </p>
          </div>

          <form
            onSubmit={resetPasswordFormik.handleSubmit}
            className="space-y-5"
          >
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
                  onChange={resetPasswordFormik.handleChange}
                  onBlur={resetPasswordFormik.handleBlur}
                  value={resetPasswordFormik.values.newPassword}
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
              {resetPasswordFormik.touched.newPassword &&
                resetPasswordFormik.errors.newPassword && (
                  <p className="mt-1 text-xs text-destructive">
                    {resetPasswordFormik.errors.newPassword}
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
                  onChange={resetPasswordFormik.handleChange}
                  onBlur={resetPasswordFormik.handleBlur}
                  value={resetPasswordFormik.values.confirmPassword}
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
              {resetPasswordFormik.touched.confirmPassword &&
                resetPasswordFormik.errors.confirmPassword && (
                  <p className="mt-1 text-xs text-destructive">
                    {resetPasswordFormik.errors.confirmPassword}
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
        </motion.div>
      )}

      {/* Step 2: Send OTP */}
      {step === "sendOtp" && (
        <motion.div
          key="sendOtp"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t("forgotPassword.sendOtp.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("forgotPassword.sendOtp.subtitle")}
            </p>
          </div>

          <form onSubmit={sendOtpFormik.handleSubmit} className="space-y-5">
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
                onChange={sendOtpFormik.handleChange}
                onBlur={sendOtpFormik.handleBlur}
                value={sendOtpFormik.values.email}
                className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-foreground text-left shadow-sm"
              />
              {sendOtpFormik.touched.email && sendOtpFormik.errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {sendOtpFormik.errors.email}
                </p>
              )}
            </div>

            <Button
              text={t("forgotPassword.sendOtp.submit")}
              isLoading={sendOtpMutation.isPending}
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
        </motion.div>
      )}

      {/* Step 3: Check OTP and reset password */}
      {step === "checkOtp" && (
        <motion.div
          key="checkOtp"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t("forgotPassword.checkOtp.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("forgotPassword.checkOtp.subtitle")}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOtpSubmit();
            }}
            className="space-y-5"
          >
            <div className="flex justify-between gap-2 sm:gap-3" dir="ltr">
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpInputRefs.current[index] = el;
                  }}
                  type="number"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className="flex-1 min-w-0 h-13 sm:w-13 sm:h-15 text-center text-xl font-bold bg-card border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              ))}
            </div>

            <Button
              text={t("forgotPassword.checkOtp.submit")}
              ButtonType="submit"
              type="button"
              className="group w-full"
              isLoading={resetPasswordMutation.isPending}
              disabled={otp.join("").length !== OTP_LENGTH}
              Icon={
                <FiArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              }
            />
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {t("forgotPassword.checkOtp.didntReceive")}{" "}
            </span>
            {timeLeft > 0 ? (
              <span className="text-primary font-medium">
                {t("forgotPassword.checkOtp.seconds", {
                  count: formatTime(timeLeft),
                })}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendOtpMutation.isPending}
                className="text-primary font-medium hover:text-primary/80 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {t("forgotPassword.checkOtp.resend")}
              </button>
            )}
          </div>

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
              {t("forgotPassword.checkOtp.backToLogin")}
            </Link>
          </div>
        </motion.div>
      )}

      {/* Step 4: Success */}
      {step === "success" && (
        <motion.div
          key="success"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-success text-success-foreground flex items-center justify-center mb-6 shadow-sm">
            <MdCheck className="w-8 h-8" />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t("forgotPassword.success.title")}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("forgotPassword.success.subtitle")}
            </p>
          </div>

          <Button
            text={t("forgotPassword.success.backToLogin")}
            type="link"
            to="/sign-in"
            className="w-full"
            Icon={
              <FiArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
