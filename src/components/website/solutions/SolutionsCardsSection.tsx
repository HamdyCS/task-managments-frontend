import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { staggerContainer, staggerItem } from "../../../animations";
import {
  FiZap,
  FiCode,
  FiBriefcase,
  FiGrid,
  FiGlobe,
  FiLayers,
} from "react-icons/fi";

const solutions = [
  { key: "growing", icon: FiZap, color: "primary" as const },
  { key: "engineering", icon: FiCode, color: "success" as const },
  { key: "clientBased", icon: FiBriefcase, color: "warning" as const },
  { key: "crossFunctional", icon: FiGrid, color: "primary" as const },
  { key: "remote", icon: FiGlobe, color: "success" as const },
  { key: "enterprise", icon: FiLayers, color: "warning" as const },
];

const colorMap = {
  primary: {
    bg: "bg-primary/10 dark:bg-primary/10",
    text: "text-primary",
    hoverBg: "group-hover:bg-primary group-hover:text-primary-foreground",
  },
  success: {
    bg: "bg-success/10 dark:bg-success/10",
    text: "text-success",
    hoverBg: "group-hover:bg-success group-hover:text-success-foreground",
  },
  warning: {
    bg: "bg-warning/10 dark:bg-warning/10",
    text: "text-warning",
    hoverBg: "group-hover:bg-warning group-hover:text-warning-foreground",
  },
};

export function SolutionsCardsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-muted/30 border-t border-border/30">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={staggerItem} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("solutions.cards.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t("solutions.cards.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map(({ key, icon: Icon, color }) => {
              const colors = colorMap[color];
              return (
                <div
                  key={key}
                  className="
    bg-card rounded-xl p-8 border border-border/50
    flex flex-col h-full text-left shadow-card
    transform-gpu will-change-transform
    transition-all
    duration-300 ease-out
    hover:-translate-y-2 hover:border-primary/50
    hover:shadow-xl hover:shadow-primary/5
    group
  "
                >
                  <div
                    className={`w-14 h-14 rounded-lg ${colors.bg} ${colors.text} ${colors.hoverBg}
      flex items-center justify-center mb-6
      transition-colors duration-300 ease-out`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {t(`solutions.cards.${key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed">
                    {t(`solutions.cards.${key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
