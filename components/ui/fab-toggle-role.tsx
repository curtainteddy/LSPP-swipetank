"use client"

import { useUser } from "@/contexts/user-context"
import { Briefcase, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function FabToggleRole({ className }: { className?: string }) {
  const { userType, setUserType } = useUser()

  const toggleUserType = () => {
    setUserType(userType === "investor" ? "innovator" : "investor")
  }

  return (
    <motion.div
      className={cn("fixed bottom-6 right-6 z-50", className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <Button
          size="lg"
          className="rounded-full shadow-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground h-14 w-14"
          onClick={toggleUserType}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={userType}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {userType === "investor" ? <Lightbulb className="h-6 w-6" /> : <Briefcase className="h-6 w-6" />}
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Switch to {userType === "investor" ? "innovator" : "investor"} view</span>
        </Button>

        <Badge
          variant="secondary"
          className="absolute -top-2 -left-2 text-xs font-medium bg-background/90 backdrop-blur-sm"
        >
          {userType === "investor" ? "→ Innovator" : "→ Investor"}
        </Badge>
      </div>
    </motion.div>
  )
}
