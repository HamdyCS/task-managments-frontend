import { useTranslation } from "react-i18next";
import { Container } from "../../components/layout/Container";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full py-24 bg-card border-t border-border/20">
      <Container>
        <div className="flex justify-between gap-8">
          <div className="flex flex-col gap-5">
            <Link to="/">
              <img src={logo} alt="logo" className="w-20 h-20 rounded-lg object-cover" />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              {t("footer.description")}
            </p>
          </div>
          <div className="text-sm text-muted-foreground self-end">© 2026 WorkPilot.</div>
        </div>
      </Container>
    </footer>
  );
}
