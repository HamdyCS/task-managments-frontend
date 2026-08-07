import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Footer() {
  const { t } = useTranslation();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay: 0.2, ease: "easeInOut" }}
      className="w-full py-5  bg-background z-0 "
    >
      <Container>
        <div className="flex flex-col items-center md:flex-row md:justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-5">
            <Link to="/">
              <img
                src={logo}
                alt="logo"
                className="w-20 h-20 rounded-lg object-cover"
              />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              {t("footer.description")}
            </p>
          </div>
          <div className="text-sm text-muted-foreground md:self-end">
            © 2026 WorkPilot.
          </div>
        </div>
      </Container>
    </motion.footer>
  );
}
