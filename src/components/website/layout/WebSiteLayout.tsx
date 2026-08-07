import { Outlet } from "react-router-dom";
import { Navbar } from "../navbars/Navbar";
import { Footer } from "../footers/Footer";
import { Container } from "./Container";

export default function WebSiteLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern" />

      {/* Radial Gradient Overlay */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <Navbar />
      <div className="mt-30 grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
