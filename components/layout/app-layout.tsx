"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { TopNavigation } from "./top-navigation";
import { Sidebar } from "./sidebar";
import { useUser } from "@/contexts/user-context";
import FabToggleRole from "@/components/ui/fab-toggle-role";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { userType } = useUser();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when user type changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [userType]);

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole={userType === "innovator" ? "innovator" : "investor"}
        isMobile={isMobile}
      />

      {/* Sidebar opens only when toggled via hamburger */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      <main className={`pt-16`}>{children}</main>

      <FabToggleRole />
    </div>
  );
}
