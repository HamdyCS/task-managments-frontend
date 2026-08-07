import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { fadeInUp } from "../../../animations";
import Button from "../../ui/Button";

export function ProductCTASection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 my-24">
      <Container>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-card border border-border/30 rounded-2xl shadow-sm text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6 py-24 px-8">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("product.cta.title")}
            </h2>

            <p className="text-lg text-muted-foreground">
              {t("product.cta.description")}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Button
                text={t("product.cta.button")}
                type="link"
                to="/sign-up"
              />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
