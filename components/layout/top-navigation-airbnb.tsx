"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, Menu, MessageCircle, Plus, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/ui/logo"
import { motion } from "framer-motion"
import { useUser } from "@/contexts/user-context"
import { SignOutButton } from "@clerk/nextjs"

interface TopNavigationProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  userRole: "innovator" | "investor" | "accelerator"
  isMobile: boolean
}

export function TopNavigation({ sidebarOpen, setSidebarOpen, userRole, isMobile }: TopNavigationProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { userType } = useUser()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-airbnb-sm"
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-gray-50 text-gray-700 rounded-airbnb w-10 h-10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            {/* Logo - Hidden on mobile when sidebar is available */}
            {!isMobile && <Logo />}
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-airbnb-sm hover:shadow-airbnb transition-shadow duration-200">
                <div className="flex-1 px-4 sm:px-6 py-2">
                  <Input
                    placeholder="Search projects, innovations, or opportunities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 placeholder:text-gray-500 focus:ring-0 focus:outline-none px-0 py-1 text-sm font-medium h-auto"
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className="bg-primary hover:bg-primary/90 text-white rounded-full w-8 h-8 m-1 flex-shrink-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Desktop Actions */}
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-4 mr-4">
                {userType === "innovator" ? (
                  <Button
                    onClick={() => router.push("/projects/new")}
                    variant="ghost"
                    className="text-gray-700 hover:bg-gray-50 font-medium text-sm rounded-airbnb px-4 h-10"
                  >
                    Host a Project
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/browse")}
                    variant="ghost"
                    className="text-gray-700 hover:bg-gray-50 font-medium text-sm rounded-airbnb px-4 h-10"
                  >
                    Browse Projects
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:bg-gray-50 font-medium text-sm rounded-airbnb px-4 h-10"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  EN
                </Button>
              </div>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-3 border border-gray-300 rounded-full py-1 px-2 hover:shadow-airbnb-sm transition-shadow duration-200 h-10"
                >
                  <Menu className="h-4 w-4 text-gray-600" />
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback className="bg-gray-500 text-white text-xs">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 border border-gray-200 shadow-airbnb rounded-airbnb mt-2"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
                
                <div className="py-2">
                  <DropdownMenuItem 
                    onClick={() => router.push("/messages")}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4 mr-3" />
                    Messages
                    <Badge className="ml-auto h-5 w-5 p-0 text-xs bg-primary text-white flex items-center justify-center rounded-full">
                      3
                    </Badge>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => router.push("/notifications")}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                    <Badge className="ml-auto h-5 w-5 p-0 text-xs bg-primary text-white flex items-center justify-center rounded-full">
                      5
                    </Badge>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="my-2" />
                  
                  <DropdownMenuItem 
                    onClick={() => router.push("/profile")}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Account
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => router.push("/settings")}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Settings
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="my-2" />
                  
                  <SignOutButton redirectUrl="/">
                    <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                      Log out
                    </DropdownMenuItem>
                  </SignOutButton>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  )
}