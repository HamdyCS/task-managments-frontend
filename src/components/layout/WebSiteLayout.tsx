import { Outlet } from "react-router-dom";
import { Navbar } from "../../pages/home/Navbar";
import { Footer } from "../../pages/home/Footer";
import { Container } from "./Container";

export default function WebSiteLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-y-scroll">
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern" />

      {/* Radial Gradient Overlay */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <Navbar />
      <div className="mt-30 grow">
        <Container>
          <Outlet />
        </Container>
      </div>
      <Footer />
    </div>
  );
}
