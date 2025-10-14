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

  const getRoleSpecificActions = () => {
    if (userType === "innovator") {
      return (
        <Button
          onClick={() => router.push("/projects/new")}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      )
    } else {
      return (
        <Button
          onClick={() => router.push("/browse")}
          className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white"
        >
          Browse Projects
        </Button>
      )
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-airbnb-sm"
    >
      <div className="flex items-center justify-between px-6 lg:px-10 py-4">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-gray-50 text-gray-700 rounded-airbnb"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <Logo />
        </div>

        {/* Airbnb-style Search Bar */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-airbnb-sm hover:shadow-airbnb transition-shadow duration-200">
              <div className="flex-1 px-6 py-3">
                <div className="flex items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Search projects, innovations, or opportunities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 bg-transparent text-gray-700 placeholder:text-gray-500 focus:ring-0 focus:outline-none px-0 text-airbnb-sm font-medium"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-primary hover:bg-primary/90 text-white rounded-full w-8 h-8 ml-2"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right side navigation - Airbnb style */}
        <div className="flex items-center gap-2">
          {!isMobile && (
            <div className="hidden lg:flex items-center gap-4 mr-4">
              {userType === "innovator" ? (
                <Button
                  onClick={() => router.push("/projects/new")}
                  variant="ghost"
                  className="text-gray-700 hover:bg-gray-50 font-medium text-airbnb-sm rounded-airbnb px-4"
                >
                  Post a Project
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/browse")}
                  variant="ghost"
                  className="text-gray-700 hover:bg-gray-50 font-medium text-airbnb-sm rounded-airbnb px-4"
                >
                  Browse Projects
                </Button>
              )}
              <Button
                variant="ghost"
                className="text-gray-700 hover:bg-gray-50 font-medium text-airbnb-sm rounded-airbnb px-4"
              >
                <Globe className="h-4 w-4 mr-2" />
                EN
              </Button>
            </div>
          )}

          {/* Airbnb-style user menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-3 border border-gray-300 rounded-full py-2 px-3 hover:shadow-airbnb-sm transition-shadow duration-200"
              >
                <Menu className="h-4 w-4 text-gray-600" />
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback className="bg-gray-500 text-white">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border border-gray-200 shadow-airbnb rounded-airbnb">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-airbnb-sm font-medium text-gray-900">John Doe</p>
                <p className="text-airbnb-xs text-gray-500">john@example.com</p>
              </div>
              
              <div className="py-2">
                <DropdownMenuItem 
                  onClick={() => router.push("/messages")}
                  className="flex items-center px-4 py-2 text-airbnb-sm text-gray-700 hover:bg-gray-50"
                >
                  <MessageCircle className="h-4 w-4 mr-3" />
                  Messages
                  <Badge className="ml-auto h-5 w-5 p-0 text-xs bg-primary text-white flex items-center justify-center rounded-full">
                    3
                  </Badge>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => router.push("/notifications")}
                  className="flex items-center px-4 py-2 text-airbnb-sm text-gray-700 hover:bg-gray-50"
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
                  className="px-4 py-2 text-airbnb-sm text-gray-700 hover:bg-gray-50"
                >
                  Account
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => router.push("/settings")}
                  className="px-4 py-2 text-airbnb-sm text-gray-700 hover:bg-gray-50"
                >
                  Settings
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-2" />
                
                <SignOutButton redirectUrl="/">
                  <DropdownMenuItem className="px-4 py-2 text-airbnb-sm text-gray-700 hover:bg-gray-50">
                    Log out
                  </DropdownMenuItem>
                </SignOutButton>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}
