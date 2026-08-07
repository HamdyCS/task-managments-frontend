import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { NotFoundIllustration } from "./not-found/NotFoundIllustration";
import { fadeInUp } from "../animations";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div>
      <NotFoundIllustration />

      {/* Text Content */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-center max-w-md mx-auto space-y-4 z-10"
      >
        <h2 className="text-3xl font-semibold text-foreground">
          {t("notFound.title")}
        </h2>
        <p className="text-base text-muted-foreground">
          {t("notFound.description")}
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-base font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <MdArrowBack className="w-5 h-5" />
            {t("notFound.backToHome")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
