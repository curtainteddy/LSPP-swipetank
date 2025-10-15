"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TopNavigation } from "./top-navigation"
import { Sidebar } from "./sidebar"
import { useUser } from "@/contexts/user-context"
import FabToggleRole from "@/components/ui/fab-toggle-role"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { userType } = useUser()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // On desktop, don't automatically close sidebar
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close sidebar when user type changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [userType, isMobile])

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole={userType === "innovator" ? "innovator" : "investor"}
        isMobile={isMobile}
      />

      {/* Sidebar is always visible on desktop, toggleable on mobile */}
      <Sidebar isOpen={!isMobile || sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />

      <main className={`${!isMobile ? 'ml-64' : ''} pt-16`}>{children}</main>

    </div>
  )
}
