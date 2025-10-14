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
  User,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useUser } from "@/contexts/user-context"
import { Logo } from "@/components/ui/logo"

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
  isActive?: boolean
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
      },
      {
        title: "Profile",
        href: "/profile",
        icon: User,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ]

    if (userType === "innovator") {
      return [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: Home,
        },
        {
          title: "Host Project",
          href: "/projects/new",
          icon: Plus,
        },
        {
          title: "My Projects",
          href: "/projects",
          icon: FolderOpen,
        },
        {
          title: "Analytics",
          href: "/analytics",
          icon: BarChart3,
        },
        {
          title: "Portfolio",
          href: "/portfolio",
          icon: Briefcase,
        },
        ...commonItems,
      ]
    } else {
      return [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: Home,
        },
        {
          title: "Browse Projects",
          href: "/browse",
          icon: Search,
        },
        {
          title: "Investments",
          href: "/investments",
          icon: TrendingUp,
        },
        {
          title: "Saved",
          href: "/saved",
          icon: Eye,
          badge: 12,
        },
        {
          title: "Deal Flow",
          href: "/deals",
          icon: Building,
          badge: 5,
        },
        ...commonItems,
      ]
    }
  }

  const navigationItems = getNavigationItems().map(item => ({
    ...item,
    isActive: pathname === item.href
  }))

  const handleNavigation = (href: string) => {
    router.push(href)
    if (isMobile) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
          )}

          {/* Sidebar */}
          <motion.aside
            initial={{ x: isMobile ? "-100%" : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? "-100%" : 0, opacity: isMobile ? 0 : 1 }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 300,
              duration: 0.3 
            }}
            className={cn(
              "fixed left-0 top-0 z-50 h-full w-72 bg-white border-r border-gray-200 shadow-airbnb flex flex-col",
              "lg:relative lg:shadow-none"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <Logo />
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="lg:hidden rounded-full w-8 h-8 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* User Type Toggle */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-airbnb-xs font-medium text-gray-500 uppercase tracking-wide">
                  Viewing as
                </span>
              </div>
              <Button
                onClick={toggleUserType}
                variant="outline"
                className="w-full justify-start bg-white border-gray-200 hover:bg-gray-50 rounded-airbnb"
              >
                <div className="flex items-center">
                  <div className={cn(
                    "w-2 h-2 rounded-full mr-3",
                    userType === "innovator" ? "bg-blue-500" : "bg-green-500"
                  )} />
                  <span className="text-airbnb-sm font-medium capitalize">
                    {userType}
                  </span>
                </div>
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-12 px-4 text-left rounded-airbnb transition-colors",
                      item.isActive
                        ? "bg-gray-50 text-gray-900 font-medium"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="text-airbnb-sm truncate">{item.title}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="ml-auto bg-primary text-white text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </nav>

            {/* User Profile Section */}
            <div className="border-t border-gray-100 p-6">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback className="bg-gray-200 text-gray-700">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-airbnb-sm font-medium text-gray-900 truncate">
                    John Doe
                  </p>
                  <p className="text-airbnb-xs text-gray-500 truncate">
                    john@example.com
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full hover:bg-gray-100"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}