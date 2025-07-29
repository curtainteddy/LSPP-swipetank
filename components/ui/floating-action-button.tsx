"use client"

import type React from "react"

import { useState } from "react"
import { RefreshCw, User, TrendingUp, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useUser, type UserRole } from "@/contexts/user-context"
import { cn } from "@/lib/utils"

export function FloatingActionButton() {
  const { userRole, setUserRole } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const roles: { role: UserRole; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { role: "innovator", label: "Innovator", icon: User },
    { role: "investor", label: "Investor", icon: TrendingUp },
    { role: "accelerator", label: "Accelerator", icon: Building },
  ]

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 space-y-2"
          >
            {roles.map((role) => {
              const Icon = role.icon
              const isActive = userRole === role.role

              return (
                <motion.div
                  key={role.role}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: roles.indexOf(role) * 0.1 }}
                >
                  <Button
                    onClick={() => handleRoleChange(role.role)}
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "flex items-center gap-2 shadow-lg backdrop-blur-sm",
                      isActive && "bg-primary text-primary-foreground",
                      !isActive && "bg-background/80 hover:bg-primary/10",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {role.label}
                    {isActive && (
                      <Badge variant="secondary" className="ml-1 h-4 text-xs">
                        Active
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-200",
          "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90",
          "text-white hover:scale-105",
          isOpen && "rotate-45",
        )}
      >
        <RefreshCw className="h-6 w-6" />
      </Button>
    </div>
  )
}
