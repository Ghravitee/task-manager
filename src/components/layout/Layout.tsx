import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { cn } from "../../utils/cn";
import { Suspense } from "react";

export function Layout() {
  const [sidebarExpanded] = useLocalStorage("sidebar-expanded", true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Mobile top bar */}
      <MobileHeader onMenuOpen={() => setMobileMenuOpen(true)} />

      {/* Sidebar — desktop fixed, mobile drawer */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <main
        className={cn(
          "transition-all duration-200",
          // On mobile, add top padding for the fixed mobile header
          "pt-14 lg:pt-0",
          // On desktop, offset for sidebar
          "lg:ml-16",
          sidebarExpanded ? "lg:ml-60" : "lg:ml-16",
        )}
      >
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
