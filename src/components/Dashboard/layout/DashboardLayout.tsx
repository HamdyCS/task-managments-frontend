import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../sidbars/DashboardSidebar";
import DashboardNavbar from "../navbars/DashboardNavbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="lg:rtl:mr-[260px] lg:ltr:ml-[260px] flex-1 flex flex-col h-full bg-background overflow-hidden relative">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
