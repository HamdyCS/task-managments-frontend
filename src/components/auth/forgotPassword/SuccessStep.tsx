import { useTranslation } from "react-i18next";
import { FiArrowRight } from "react-icons/fi";
import { MdCheck } from "react-icons/md";
import Button from "../../ui/Button";

export function SuccessStep() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center">
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
    </div>
  );
}
