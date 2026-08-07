import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { staggerContainer, staggerItem } from "../../../animations";

export function SolutionsHeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none" />

      <Container className="relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.h1
            variants={staggerItem}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground mb-6"
          >
            {t("solutions.hero.title")}{" "}
            <span className="text-primary">
              {t("solutions.hero.titleHighlight")}
            </span>{" "}
            {t("solutions.hero.titleEnd")}
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t("solutions.hero.description")}
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex justify-center mb-16"
          >
            <a
              href="#"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-base font-semibold hover:bg-primary/90 transition-transform hover:-translate-y-1 shadow-lg shadow-primary/25 inline-flex items-center justify-center"
            >
              {t("solutions.hero.cta1")}
            </a>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            variants={staggerItem}
            className="relative max-w-5xl mx-auto rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            {/* Title bar */}
            <div className="h-10 bg-muted/50 border-b border-border/30 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/70" />
              <div className="w-3 h-3 rounded-full bg-warning/70" />
              <div className="w-3 h-3 rounded-full bg-success/70" />
              <div className="flex-1 ml-4 bg-background/50 rounded text-xs px-2 py-1 text-muted-foreground text-center opacity-50">
                app.workpilot.com
              </div>
            </div>

            {/* Dashboard body */}
            <div className="flex bg-card/50">
              {/* Sidebar */}
              <div className="w-44 hidden md:flex flex-col gap-2 p-4 border-r border-border/20 opacity-70">
                <div className="h-6 w-20 bg-border/50 rounded mb-4" />
                <div className="h-8 w-full bg-border/30 rounded-lg" />
                <div className="h-8 w-full bg-border/30 rounded-lg" />
                <div className="h-8 w-full bg-primary/15 rounded-lg border border-primary/25" />
                <div className="h-8 w-full bg-border/30 rounded-lg" />
                <div className="h-8 w-full bg-border/30 rounded-lg" />
              </div>

              {/* Main content - Kanban board */}
              <div className="flex-1 p-4 flex gap-4 overflow-hidden">
                {/* Column 1 - To Do */}
                <div className="flex-1 min-w-0 flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" />
                    <div className="h-4 w-16 bg-border/50 rounded" />
                    <div className="h-4 w-5 bg-border/30 rounded-full text-[10px] flex items-center justify-center text-muted-foreground">
                      4
                    </div>
                  </div>
                  <div className="bg-background border border-border/40 rounded-xl p-3 shadow-sm">
                    <div className="h-3 w-3/4 bg-border/50 rounded mb-2" />
                    <div className="h-2 w-full bg-border/30 rounded mb-1" />
                    <div className="h-2 w-2/3 bg-border/30 rounded mb-3" />
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-12 bg-primary/15 rounded-full" />
                      <div className="ml-auto h-5 w-5 rounded-full bg-muted-foreground/20" />
                    </div>
                  </div>
                  <div className="bg-background border border-border/40 rounded-xl p-3 shadow-sm">
                    <div className="h-3 w-2/3 bg-border/50 rounded mb-2" />
                    <div className="h-2 w-full bg-border/30 rounded mb-1" />
                    <div className="h-2 w-3/4 bg-border/30 rounded mb-3" />
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-14 bg-success/15 rounded-full" />
                      <div className="ml-auto h-5 w-5 rounded-full bg-muted-foreground/20" />
                    </div>
                  </div>
                  <div className="bg-background border border-border/40 rounded-xl p-3 shadow-sm opacity-60">
                    <div className="h-3 w-1/2 bg-border/50 rounded mb-2" />
                    <div className="h-2 w-full bg-border/30 rounded mb-1" />
                    <div className="h-2 w-1/2 bg-border/30 rounded mb-3" />
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-10 bg-warning/15 rounded-full" />
                      <div className="ml-auto h-5 w-5 rounded-full bg-muted-foreground/20" />
                    </div>
                  </div>
                </div>

                {/* Column 2 - In Progress */}
                <div className="flex-1 min-w-0 flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary/70" />
                    <div className="h-4 w-20 bg-border/50 rounded" />
                    <div className="h-4 w-5 bg-border/30 rounded-full text-[10px] flex items-center justify-center text-muted-foreground">
                      3
                    </div>
                  </div>
                  <div className="bg-background border border-primary/20 rounded-xl p-3 shadow-sm ring-1 ring-primary/10">
                    <div className="h-3 w-2/3 bg-border/50 rounded mb-2" />
                    <div className="h-2 w-full bg-border/30 rounded mb-1" />
                    <div className="h-2 w-3/4 bg-border/30 rounded mb-3" />
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-10 bg-primary/15 rounded-full" />
                      <div className="ml-auto h-5 w-5 rounded-full bg-muted-foreground/20" />
                    </div>
                  </div>
                  <div className="bg-background border border-border/40 rounded-xl p-3 shadow-sm">
                    <div className="h-3 w-3/4 bg-border/50 rounded mb-2" />
                    <div className="h-2 w-full bg-border/30 rounded mb-1" />
                    <div className="h-2 w-1/2 bg-border/30 rounded mb-3" />
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-12 bg-success/15 rounded-full" />
                      <div className="ml-auto h-5 w-5 rounded-full bg-muted-foreground/20" />
                    </div>
                  </div>
                  <div className="bg-background border border-border/40 rounded-xl p-3 shadow-sm opacity-50">
                    <div className="h-3 w-1/2 bg-border/50 rounded mb-2" />
                    <div className="h-2 w-full bg-border/30 rounded mb-1" />
                    <div className="h-2 w-2/3 bg-border/30 rounded mb-3" />
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-10 bg-warning/15 rounded-full" />
                      <div className="ml-auto h-5 w-5 rounded-full bg-muted-foreground/20" />
                    </div>
                  </div>
                </div>

                {/* Column 3 - Done */}
                <div className="flex-1 min-w-0 hidden lg:flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
                    <div className="h-4 w-12 bg-border/50 rounded" />
                    <div className="h-4 w-5 bg-border/30 rounded-full text-[10px] flex items-center justify-center text-muted-foreground">
                      2
                    </div>
                  </div>
                  <div className="bg-background border border-border/40 rounded-xl p-3 shadow-sm opacity-70">
                    <div className="h-3 w-2/3 bg-border/50 rounded mb-2" />
                    <div className="h-2 w-full bg-border/30 rounded mb-1" />
                    <div className="h-2 w-1/2 bg-border/30 rounded mb-3" />
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-12 bg-success/15 rounded-full" />
                      <div className="ml-auto h-5 w-5 rounded-full bg-muted-foreground/20" />
                    </div>
                  </div>
                  <div className="bg-background border border-border/40 rounded-xl p-3 shadow-sm opacity-40">
                    <div className="h-3 w-1/2 bg-border/50 rounded mb-2" />
                    <div className="h-2 w-full bg-border/30 rounded mb-1" />
                    <div className="h-2 w-2/3 bg-border/30 rounded mb-3" />
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-10 bg-primary/15 rounded-full" />
                      <div className="ml-auto h-5 w-5 rounded-full bg-muted-foreground/20" />
                    </div>
                  </div>
                </div>

                {/* Column 4 - Analytics panel */}
                <div className="w-48 hidden xl:flex flex-col gap-3">
                  <div className="h-4 w-20 bg-border/50 rounded mb-1" />
                  <div className="bg-background border border-border/40 rounded-xl p-3 shadow-sm">
                    <div className="h-3 w-16 bg-border/50 rounded mb-3" />
                    <div className="flex items-end gap-1.5 h-16">
                      <div className="flex-1 bg-primary/30 rounded-t" style={{ height: "60%" }} />
                      <div className="flex-1 bg-primary/40 rounded-t" style={{ height: "80%" }} />
                      <div className="flex-1 bg-primary/50 rounded-t" style={{ height: "45%" }} />
                      <div className="flex-1 bg-primary/60 rounded-t" style={{ height: "90%" }} />
                      <div className="flex-1 bg-primary/70 rounded-t" style={{ height: "70%" }} />
                    </div>
                  </div>
                  <div className="bg-background border border-border/40 rounded-xl p-3 shadow-sm">
                    <div className="h-3 w-14 bg-border/50 rounded mb-3" />
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-border/30 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-primary/50 rounded-full" />
                      </div>
                      <div className="h-2 w-full bg-border/30 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-success/50 rounded-full" />
                      </div>
                      <div className="h-2 w-full bg-border/30 rounded-full overflow-hidden">
                        <div className="h-full w-5/6 bg-warning/50 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
