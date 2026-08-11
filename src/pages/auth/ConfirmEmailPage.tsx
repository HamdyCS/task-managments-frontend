import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiXCircle, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Button from "../../components/ui/Button";
import useConfirmEmail from "../../hooks/auth/useConfirmEmail";
import { useLanguage } from "../../hooks/language/useLanguage";

type ConfirmStatus = "loading" | "success" | "failure";

function getInitialStatus(searchParams: URLSearchParams): ConfirmStatus {
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  if (!email || !token) return "failure";
  return "loading";
}

export function ConfirmEmailPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<ConfirmStatus>(() =>
    getInitialStatus(searchParams)
  );
  const hasCalled = useRef(false);

  const confirmMutation = useConfirmEmail({
    onSuccess: () => {
      setStatus("success");
    },
    onError: () => {
      setStatus("failure");
    },
  });

  useEffect(() => {
    if (hasCalled.current) return;
    if (status !== "loading") return;
    hasCalled.current = true;

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    confirmMutation.mutateAsync({ email: email!, token: token! });
  }, [searchParams, confirmMutation, status]);

  return (
    <div className="flex flex-col items-center">
      {status === "loading" && (
        <>
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
            <div className="size-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t("confirmEmail.loading.title")}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("confirmEmail.loading.subtitle")}
            </p>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mb-6">
            <FiCheckCircle className="w-8 h-8" />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t("confirmEmail.success.title")}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("confirmEmail.success.subtitle")}
            </p>
          </div>
          <Button
            text={t("confirmEmail.success.backToLogin")}
            type="link"
            to="/sign-in"
            className="w-full group"
            Icon={
              isAr ? (
                <FiArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              ) : (
                <FiArrowLeft className="ml-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
              )
            }
          />
        </>
      )}

      {status === "failure" && (
        <>
          <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6">
            <FiXCircle className="w-8 h-8" />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t("confirmEmail.failure.title")}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("confirmEmail.failure.subtitle")}
            </p>
          </div>
          <Button
            text={t("confirmEmail.failure.backToRegister")}
            type="link"
            to="/sign-up"
            className="w-full group"
            Icon={
              isAr ? (
                <FiArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              ) : (
                <FiArrowLeft className="ml-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
              )
            }
          />
        </>
      )}
    </div>
  );
}
