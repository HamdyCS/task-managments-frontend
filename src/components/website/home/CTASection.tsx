import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Container } from "../../../components/website/layout/Container";
import { fadeInUp } from "../../../animations";
import Button from "../../../components/ui/Button";

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="py-32 mb-20">
      <Container className="max-w-4xl">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="glass-panel rounded-[2rem] p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
              {t("cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button text={t("cta.button")} to="/sign-up" type="link" />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
