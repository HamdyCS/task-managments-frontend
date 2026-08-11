import { useTranslation } from "react-i18next";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import Button from "../../components/ui/Button";

export function VerifyEmailPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
        <FiMail className="w-8 h-8" />
      </div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("verifyEmail.title")}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("verifyEmail.subtitle")}
        </p>
      </div>

      <Button
        text={t("verifyEmail.backToLogin")}
        type="link"
        to="/sign-in"
        className="w-full group"
        Icon={
          <FiArrowLeft className="ml-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
        }
      />
    </div>
  );
}
