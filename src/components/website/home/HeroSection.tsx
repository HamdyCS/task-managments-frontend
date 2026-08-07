import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Container } from "../../../components/website/layout/Container";
import { staggerContainer, staggerItem } from "../../../animations";
import Button from "../../../components/ui/Button";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="pt-60 pb-20">
      <Container className="max-w-4xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* <motion.div
            variants={staggerItem}
            className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 border border-border/50 backdrop-blur-md rounded-full mb-10"
          >
            <span className="text-primary font-bold text-sm">{t('hero.badge.smart')}</span>
            <div className="w-px h-4 bg-border" />
            <span className="text-sm font-medium text-muted-foreground">
              {t('hero.badge.text')}
            </span>
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.div> */}

          <motion.h1
            variants={staggerItem}
            className="text-5xl md:text-7xl lg:text-[80px] font-bold leading-[1.1] tracking-tight mb-8 text-foreground"
          >
            {t("hero.title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-primary/60">
              WorkPilot
            </span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl leading-relaxed"
          >
            {t("hero.description")}
          </motion.p>

          <Button text={t("hero.cta")} type="link" to="/sign-up" />
        </motion.div>
      </Container>
    </section>
  );
}
