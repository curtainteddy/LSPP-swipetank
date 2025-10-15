"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, Menu, MessageCircle, Plus } from "lucide-react"
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
import { ThemeToggle } from "@/components/ui/theme-toggle"
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
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          {!isMobile && <Logo />}
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={userType === "investor" ? "Search projects..." : "Search analytics..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-primary/20 focus:border-primary/50 bg-background/50"
            />
          </form>
        </div>

        <div className="flex items-center gap-3">
          {!isMobile && getRoleSpecificActions()}

          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <SignOutButton redirectUrl="/">
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}
