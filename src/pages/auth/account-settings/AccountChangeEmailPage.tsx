import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import ChangeEmailForm from "../../../components/account-settings/ChangeEmailForm";
import useCurrentUser from "../../../hooks/auth/useCurrentUser";

export default function AccountChangeEmailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const basePath = user?.role === "Admin" ? "/admin/dashboard" : "/dashboard";

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FiMail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {t("dashboard.accountSettings.email.changeEmail")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.accountSettings.email.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChangeEmailForm onCancel={() => navigate(`${basePath}/account/email`)} />
        </motion.div>
      </div>
    </div>
  );
}
