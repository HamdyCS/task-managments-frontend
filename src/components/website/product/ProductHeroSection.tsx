import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { staggerContainer, staggerItem } from "../../../animations";
import Button from "../../ui/Button";

export function ProductHeroSection() {
  const { t } = useTranslation();

  return (
    <section className="pt-40 pb-20">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="flex flex-col items-start space-y-6">
            <motion.span
              variants={staggerItem}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground"
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
              {t("product.hero.badge")}
            </motion.span>

            <motion.h1
              variants={staggerItem}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground"
            >
              {t("product.hero.title")}
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              {t("product.hero.description")}
            </motion.p>

            <motion.div variants={staggerItem} className="pt-2">
              <Button
                text={t("product.hero.cta")}
                type="link"
                to="/sign-up"
              />
            </motion.div>
          </div>

          <motion.div
            variants={staggerItem}
            initial="hidden"
            animate="visible"
            className="relative w-full h-[400px] md:h-[500px] rounded-2xl border border-border/50 shadow-xl overflow-hidden bg-card flex flex-col"
          >
            <div className="h-10 bg-muted/50 border-b border-border/30 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/70" />
              <div className="w-3 h-3 rounded-full bg-warning/70" />
              <div className="w-3 h-3 rounded-full bg-success/70" />
              <div className="flex-1 ml-4 bg-background/50 rounded text-xs px-2 py-1 text-muted-foreground text-center opacity-50">
                app.workpilot.com
              </div>
            </div>

            <div className="flex-1 flex bg-card/50">
              <div className="w-48 hidden md:flex flex-col gap-2 p-4 border-r border-border/20 opacity-70">
                <div className="h-6 w-24 bg-border/50 rounded mb-4" />
                <div className="h-8 w-full bg-border/30 rounded-lg" />
                <div className="h-8 w-full bg-border/30 rounded-lg" />
                <div className="h-8 w-full bg-primary/15 rounded-lg border border-primary/25" />
                <div className="h-8 w-full bg-border/30 rounded-lg" />
              </div>

              <div className="flex-1 p-6 flex gap-4">
                <div className="flex-1 flex flex-col gap-3">
                  <div className="h-6 w-32 bg-border/50 rounded mb-2" />
                  <div className="h-24 w-full bg-background border border-border/40 rounded-xl shadow-sm" />
                  <div className="h-24 w-full bg-background border border-border/40 rounded-xl shadow-sm" />
                  <div className="h-24 w-full bg-background border border-border/40 rounded-xl shadow-sm" />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="h-6 w-32 bg-border/50 rounded mb-2" />
                  <div className="h-24 w-full bg-background border border-border/40 rounded-xl shadow-sm" />
                  <div className="h-24 w-full bg-background border border-border/40 rounded-xl shadow-sm opacity-50" />
                </div>
                <div className="flex-1 hidden lg:flex flex-col gap-3">
                  <div className="h-6 w-32 bg-border/50 rounded mb-2" />
                  <div className="h-24 w-full bg-background border border-border/40 rounded-xl shadow-sm opacity-30" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
