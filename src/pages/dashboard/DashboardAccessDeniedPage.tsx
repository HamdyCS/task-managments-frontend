import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { fadeInUp } from "../../animations";
import DashboardAccessDeniedIllustration from "../../components/Dashboard/accessDenied/DashboardAccessDeniedIllustration";

export default function DashboardAccessDeniedPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
      <DashboardAccessDeniedIllustration />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-center max-w-md mx-auto space-y-4"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
          {t("dashboard.accessDenied.title")}
        </h2>
        <p className="text-base text-muted-foreground">
          {t("dashboard.accessDenied.description")}
        </p>
        <div className="pt-2">
          <Link
            to={
              searchParams.get("workspaceId")
                ? `/dashboard?workspaceId=${searchParams.get("workspaceId")}`
                : "/dashboard"
            }
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-base font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <MdArrowBack className="w-5 h-5" />
            {t("dashboard.accessDenied.backToDashboard")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
