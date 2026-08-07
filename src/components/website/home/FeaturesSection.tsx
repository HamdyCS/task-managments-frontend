import { motion } from "framer-motion";
import { Container } from "../../../components/website/layout/Container";
import { fadeInUp } from "../../../animations";

export function FeaturesSection() {
  return (
    <section className="mb-40">
      <Container className="max-w-6xl">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent blur-3xl -z-10 rounded-[3rem]" />

          <div className="w-full aspect-[16/9] md:aspect-[21/9] glass-panel rounded-2xl md:rounded-3xl flex flex-col overflow-hidden">
            {/* Browser Chrome */}
            <div className="h-12 border-b border-border/20 flex items-center px-4 justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                </div>
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                workpilot.com/app
              </div>
              <div className="w-10" />
            </div>

            {/* App Content */}
            <div className="flex-1 p-6 flex gap-6 bg-card/50">
              {/* Sidebar */}
              <div className="w-48 hidden md:flex flex-col gap-2 opacity-70">
                <div className="h-6 w-24 bg-border/50 rounded mb-4" />
                <div className="h-8 w-full bg-border/30 rounded-lg" />
                <div className="h-8 w-full bg-border/30 rounded-lg" />
                <div className="h-8 w-full bg-primary/15 rounded-lg border border-primary/25" />
              </div>

              {/* Board Columns */}
              <div className="flex-1 flex gap-4">
                <div className="flex-1 flex flex-col gap-3">
                  <div className="h-6 w-32 bg-border/50 rounded mb-2" />
                  <div className="h-24 w-full bg-card border border-border/40 rounded-xl shadow-sm" />
                  <div className="h-24 w-full bg-card border border-border/40 rounded-xl shadow-sm" />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="h-6 w-32 bg-border/50 rounded mb-2" />
                  <div className="h-24 w-full bg-card border border-border/40 rounded-xl shadow-sm opacity-50" />
                </div>
                <div className="flex-1 hidden lg:flex flex-col gap-3">
                  <div className="h-6 w-32 bg-border/50 rounded mb-2" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
