import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import useResendOtp from "../../../hooks/auth/useResendOtp";
import Button from "../../ui/Button";

const OTP_LENGTH = 6;
const RESEND_TIMER_SECONDS = 60;

interface CheckOtpStepProps {
  email: string;
  isPending: boolean;
  onSubmit: (otp: string) => void;
}

export function CheckOtpStep({ email, isPending, onSubmit }: CheckOtpStepProps) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(RESEND_TIMER_SECONDS);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isAr = document.documentElement.dir === "rtl";

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

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleResendOtp = () => {
    if (timeLeft > 0) return;
    resendOtpMutation.mutateAsync({ email });
  };

  const handleOtpSubmit = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== OTP_LENGTH) return;
    onSubmit(otpValue);
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

  return (
    <>
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
          isLoading={isPending}
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
    </>
  );
}
