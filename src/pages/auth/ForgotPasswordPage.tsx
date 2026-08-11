import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import useSendOtp from "../../hooks/auth/useSendOtp";
import useResetPassword from "../../hooks/auth/useResetPassword";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setForgotPasswordNewPassword,
  clearForgotPasswordNewPassword,
} from "../../store/auth/authSlice";
import { ResetPasswordStep } from "../../components/auth/forgotPassword/ResetPasswordStep";
import { SendOtpStep } from "../../components/auth/forgotPassword/SendOtpStep";
import { CheckOtpStep } from "../../components/auth/forgotPassword/CheckOtpStep";
import { SuccessStep } from "../../components/auth/forgotPassword/SuccessStep";

type ForgotPasswordStep = "resetPassword" | "sendOtp" | "checkOtp" | "success";

const stepVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const reduxNewPassword = useAppSelector(
    (state) => state.auth.forgotPasswordNewPassword,
  );
  const [step, setStep] = useState<ForgotPasswordStep>("resetPassword");
  const [email, setEmail] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearForgotPasswordNewPassword());
    };
  }, [dispatch]);

  const sendOtpMutation = useSendOtp({
    onSuccess: () => {
      setStep("checkOtp");
    },
    onError: (error) => {
      const data = error.response?.data as { message?: string } | undefined;
      toast.error(data?.message || t("forgotPassword.sendOtp.error.title"));
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

  const handleResetPasswordSubmit = (newPassword: string) => {
    dispatch(setForgotPasswordNewPassword(newPassword));
    setStep("sendOtp");
  };

  const handleSendOtpSubmit = (value: string) => {
    setEmail(value);
    sendOtpMutation.mutateAsync({ email: value });
  };

  const handleOtpSubmit = (otpValue: string) => {
    resetPasswordMutation.mutateAsync({
      email,
      newPassword: reduxNewPassword,
      otp: otpValue,
    });
  };

  return (
    <AnimatePresence mode="wait">
      {step === "resetPassword" && (
        <motion.div
          key="resetPassword"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <ResetPasswordStep onSubmit={handleResetPasswordSubmit} />
        </motion.div>
      )}

      {step === "sendOtp" && (
        <motion.div
          key="sendOtp"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <SendOtpStep
            onSubmit={handleSendOtpSubmit}
            isPending={sendOtpMutation.isPending}
          />
        </motion.div>
      )}

      {step === "checkOtp" && (
        <motion.div
          key="checkOtp"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <CheckOtpStep
            email={email}
            isPending={resetPasswordMutation.isPending}
            onSubmit={handleOtpSubmit}
          />
        </motion.div>
      )}

      {step === "success" && (
        <motion.div
          key="success"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <SuccessStep />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
