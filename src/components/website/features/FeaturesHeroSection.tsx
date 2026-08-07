import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { staggerContainer, staggerItem } from "../../../animations";

export function FeaturesHeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-24 overflow-hidden min-h-[600px]">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none" />

      <Container className="relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.span
            variants={staggerItem}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground mb-8"
          >
            <svg
              className="w-4 h-4"
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
            {t("features.hero.badge")}
          </motion.span>

          <motion.h1
            variants={staggerItem}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground mb-6"
          >
            {t("features.hero.title")}{" "}
            <span className="text-primary">
              {t("features.hero.titleHighlight")}
            </span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {t("features.hero.description")}
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
