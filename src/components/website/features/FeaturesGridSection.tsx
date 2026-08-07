import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { staggerContainer, staggerItem } from "../../../animations";
import {
  FiLayout,
  FiUsers,
  FiBarChart2,
  FiCalendar,
  FiZap,
  FiBell,
  FiShield,
  FiGlobe,
} from "react-icons/fi";

const featureKeys = [
  "kanban",
  "collaboration",
  "analytics",
  "calendar",
  "automation",
  "notifications",
  "security",
  "integrations",
] as const;

const featureIcons = [
  FiLayout,
  FiUsers,
  FiBarChart2,
  FiCalendar,
  FiZap,
  FiBell,
  FiShield,
  FiGlobe,
];

const featureColors = [
  { bg: "bg-primary/10", text: "text-primary" },
  { bg: "bg-success/10", text: "text-success" },
  { bg: "bg-warning/10", text: "text-warning" },
  { bg: "bg-primary/10", text: "text-primary" },
  { bg: "bg-success/10", text: "text-success" },
  { bg: "bg-warning/10", text: "text-warning" },
  { bg: "bg-primary/10", text: "text-primary" },
  { bg: "bg-success/10", text: "text-success" },
];

export function FeaturesGridSection() {
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
              {t("features.grid.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t("features.grid.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureKeys.map((key, index) => {
              const Icon = featureIcons[index];
              const colors = featureColors[index];
              return (
                <motion.div
                  key={key}
                  variants={staggerItem}
                  className="
                    bg-card rounded-xl p-6 border border-border/50
                    flex flex-col h-full shadow-card
                    transform-gpu will-change-transform
                    transition-all duration-300 ease-out
                    hover:-translate-y-2 hover:border-primary/50
                    hover:shadow-xl hover:shadow-primary/5
                    group
                  "
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${colors.bg} ${colors.text}
                      flex items-center justify-center mb-5
                      group-hover:bg-primary group-hover:text-primary-foreground
                      transition-colors duration-300 ease-out`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(`features.grid.items.${key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`features.grid.items.${key}.description`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
