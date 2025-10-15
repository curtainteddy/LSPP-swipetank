"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  BarChart3,
  Briefcase,
  FolderOpen,
  MessageCircle,
  Search,
  Settings,
  TrendingUp,
  Users,
  Home,
  Eye,
  Building,
  X,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useUser } from "@/contexts/user-context"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  description?: string
}

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { userType, setUserType } = useUser()

  const toggleUserType = () => {
    setUserType(userType === "innovator" ? "investor" : "innovator")
  }

  const getNavigationItems = (): NavItem[] => {
    const commonItems: NavItem[] = [
      {
        title: "Messages",
        href: "/messages",
        icon: MessageCircle,
        badge: 3,
        description: "Direct communications",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Account preferences",
      },
    ]

    if (userType === "innovator") {
      return [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: Home,
          description: "Overview and insights",
        },
        {
          title: "Create Project",
          href: "/projects/new",
          icon: Plus,
          description: "Add a new project",
        },
        {
          title: "My Projects",
          href: "/projects",
          icon: FolderOpen,
          description: "Manage your projects",
        },
        ...commonItems,
      ]
    } else {
      return [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: Home,
          description: "Overview and insights",
        },
        {
          title: "Browse Projects",
          href: "/browse",
          icon: Search,
          description: "Discover startups",
        },
        {
          title: "My Investments",
          href: "/investments",
          icon: TrendingUp,
          description: "Portfolio tracking",
        },
        ...commonItems,
      ]
    }
  }

  const navigationItems = getNavigationItems()

  const handleNavigation = (href: string) => {
    router.push(href)
    if (isMobile) {
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card/95 backdrop-blur-md border-r border-border/50 z-50",
              isMobile ? "shadow-2xl" : "shadow-lg",
            )}
          >
            <div className="flex flex-col h-full">
              {/* Header with close button for mobile */}
              {isMobile && (
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <Badge
                    variant="outline"
                    className={cn(
                      "py-2 text-sm font-medium cursor-pointer hover:bg-opacity-80 transition-all duration-200",
                      userType === "innovator" && "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20",
                      userType === "investor" && "bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary/20",
                    )}
                    onClick={toggleUserType}
                  >
                    {userType === "innovator" ? "Innovator Mode" : "Investor Mode"}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Role Badge for desktop */}
              {!isMobile && (
                <div className="p-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "w-full justify-center py-2 text-sm font-medium cursor-pointer hover:bg-opacity-80 transition-all duration-200",
                      userType === "innovator" && "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20",
                      userType === "investor" && "bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary/20",
                    )}
                    onClick={toggleUserType}
                  >
                    {userType === "innovator" ? "Innovator Mode" : "Investor Mode"}
                  </Badge>
                </div>
              )}

              <Separator className="mx-4" />

              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigationItems.map((item, index) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <motion.div
                      key={`${userType}-${item.href}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "group w-full justify-start h-auto p-3 text-left hover:bg-primary/10 hover:text-white transition-colors duration-200",
                          isActive && "bg-primary/10 text-primary border border-primary/20",
                        )}
                        onClick={() => handleNavigation(item.href)}
                      >
                        <div className="flex items-center w-full">
                          <Icon className={cn("h-5 w-5 mr-3 flex-shrink-0 group-hover:text-white transition-colors", isActive && "text-primary")} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{item.title}</span>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 h-5 min-w-[20px] text-xs bg-secondary/30 text-secondary-foreground group-hover:bg-white/20 group-hover:text-white transition-colors"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground group-hover:text-white/80 mt-1 truncate transition-colors">{item.description}</p>
                            )}
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  )
                })}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
