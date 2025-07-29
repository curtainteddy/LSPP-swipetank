"use client"

import { useState, useEffect } from "react"
import { Monitor, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ViewToggle() {
  const [view, setView] = useState<"mobile" | "desktop">("mobile")
  const [mounted, setMounted] = useState(false)

  // Only render the toggle on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    // Check for saved preference
    const savedView = localStorage.getItem("view-preference") as "mobile" | "desktop" | null
    if (savedView) {
      setView(savedView)
    }
  }, [])

  const toggleView = () => {
    const newView = view === "mobile" ? "desktop" : "mobile"
    setView(newView)
    localStorage.setItem("view-preference", newView)
    
    // Dispatch custom event to notify components about view change
    window.dispatchEvent(new CustomEvent("viewchange", { detail: { view: newView } }))
  }

  if (!mounted) {
    return <Button variant="outline" size="icon" className="rounded-full w-9 h-9" />
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full w-9 h-9 border-primary/20 bg-background hover:bg-primary/10 transition-all duration-300 ${
        view === "desktop" ? "view-toggle-desktop" : ""
      }`}
      onClick={toggleView}
      aria-label="Toggle view layout"
    >
      <Smartphone 
        className="h-[1.2rem] w-[1.2rem] transition-all duration-300" 
        data-smartphone=""
        style={{
          transform: view === "desktop" ? "rotate(-90deg)" : "rotate(0deg)",
          opacity: view === "desktop" ? 0 : 1
        }}
      />
      <Monitor 
        className="absolute h-[1.2rem] w-[1.2rem] transition-all duration-300" 
        data-monitor=""
        style={{
          transform: view === "desktop" ? "rotate(0deg)" : "rotate(90deg)",
          opacity: view === "desktop" ? 1 : 0
        }}
      />
      <span className="sr-only">Toggle view layout</span>
    </Button>
  )
}

export function useViewMode() {
  const [view, setView] = useState<"mobile" | "desktop">("mobile")

  useEffect(() => {
    // Get initial value from localStorage
    const savedView = localStorage.getItem("view-preference") as "mobile" | "desktop" | null
    if (savedView) {
      setView(savedView)
    }

    // Listen for view changes
    const handleViewChange = (event: CustomEvent) => {
      setView(event.detail.view)
    }

    window.addEventListener("viewchange", handleViewChange as EventListener)
    
    return () => {
      window.removeEventListener("viewchange", handleViewChange as EventListener)
    }
  }, [])

  return view
}
