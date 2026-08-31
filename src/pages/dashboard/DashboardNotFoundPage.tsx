import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { fadeInUp } from "../../animations";
import DashboardNotFoundIllustration from "../../components/Dashboard/notFound/DashboardNotFoundIllustration";

export default function DashboardNotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
      <DashboardNotFoundIllustration />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-center max-w-md mx-auto space-y-4"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
          {t("dashboard.notFound.title")}
        </h2>
        <p className="text-base text-muted-foreground">
          {t("dashboard.notFound.description")}
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-base font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <MdArrowBack className="w-5 h-5" />
            {t("dashboard.notFound.backToDashboard")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
