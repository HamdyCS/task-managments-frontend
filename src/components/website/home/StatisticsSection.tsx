import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Container } from "../../../components/website/layout/Container";
import { AnimatedCounter } from "../../../components/common/AnimatedCounter";
import { staggerContainer, staggerItem } from "../../../animations";

const stats = [
  { value: 500, suffix: "+", labelKey: "stats.activeTeams" },
  { value: 20, suffix: "K+", labelKey: "stats.tasksCompleted" },
  { value: 99.9, suffix: "%", labelKey: "stats.uptime", decimals: 1 },
  { value: 35, suffix: "%", labelKey: "stats.productivity" },
];

export function StatisticsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-32">
      <Container className="max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.labelKey}
              variants={staggerItem}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-5xl md:text-6xl font-bold mb-3 text-foreground tracking-tight">
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                {t(stat.labelKey)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
