import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import useCurrentUser from "../../hooks/auth/useCurrentUser";

export default function EmailSection() {
  const { t, i18n } = useTranslation();
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();
  const isRtl = i18n.dir() === "rtl";

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FiMail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {t("dashboard.accountSettings.email.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.accountSettings.email.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 8 : -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-muted-foreground">
                  {user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.accountSettings.email.currentEmail")}
                </p>
                <p className="text-sm font-medium text-foreground" dir="ltr">
                  {user?.email}
                </p>
              </div>
            </div>

            <Link
              to={
                (user?.role === "Admin" ? "/admin/dashboard" : "/dashboard") +
                "/account/email/change-email"
              }
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              {t("dashboard.accountSettings.email.changeEmail")}
              {isRtl ? (
                <FiArrowLeft className="w-4 h-4" />
              ) : (
                <FiArrowRight className="w-4 h-4" />
              )}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
