"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TopNavigation } from "./top-navigation-airbnb"
import { Sidebar } from "./sidebar-airbnb"
import { useUser } from "@/contexts/user-context"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { userType } = useUser()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 // Use lg breakpoint for sidebar
      setIsMobile(mobile)
      // On desktop, sidebar should be visible by default
      if (!mobile) {
        setSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Auto-open sidebar on desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true)
    }
  }, [isMobile])

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <TopNavigation
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole={userType === "innovator" ? "innovator" : "investor"}
        isMobile={isMobile}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isMobile={isMobile} 
        />

        {/* Main Content */}
        <main 
          className={`
            flex-1 min-h-[calc(100vh-64px)]
            ${!isMobile && sidebarOpen ? 'lg:ml-72' : ''}
            transition-all duration-300 ease-in-out
          `}
        >
          <div className="bg-white min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}