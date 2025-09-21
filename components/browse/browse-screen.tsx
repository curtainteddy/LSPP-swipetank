"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Heart, Filter, MessageCircle, Users, Eye, TrendingUp, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AppLayout } from "@/components/layout/app-layout"
import { Sidebar } from "@/components/layout/sidebar"
import { TopNavigation } from "@/components/layout/top-navigation"
import { useUser } from "@/contexts/user-context"
import FabToggleRole from "@/components/ui/fab-toggle-role"
import { motion, AnimatePresence } from "framer-motion"

interface Project {
  id: string
  title: string
  description: string
  price: number | null
  status: string
  createdAt: string
  updatedAt: string
  inventor: {
    id: string
    name: string
    email: string
    profileImage: string | null
  }
  images: Array<{
    id: string
    url: string
    isPrimary: boolean
    order: number
  }>
  tags: Array<{
    tag: {
      id: string
      name: string
      color: string | null
    }
  }>
  _count: {
    likes: number
    investments: number
  }
}

export default function BrowseScreen() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set())
  const [isScrolling, setIsScrolling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { userType } = useUser()
  const [filters, setFilters] = useState({
    industry: "all",
    investmentType: "all",
    priceRange: [0, 10000],
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [])

  // Handle smooth scroll navigation like Instagram reels
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let accumulatedDelta = 0
    let lastScrollTime = 0
    const SCROLL_THRESHOLD = 50
    const SCROLL_COOLDOWN = 300 // Reduced cooldown time
    
    const handleScroll = (e: WheelEvent) => {
      if (projects.length === 0) return
      
      const currentTime = Date.now()
      
      // Check if we're still in cooldown period
      if (currentTime - lastScrollTime < SCROLL_COOLDOWN) {
        e.preventDefault()
        return
      }
      
      e.preventDefault()
      accumulatedDelta += Math.abs(e.deltaY)
      
      if (accumulatedDelta > SCROLL_THRESHOLD) {
        lastScrollTime = currentTime
        accumulatedDelta = 0
        
        if (e.deltaY > 0 && currentIndex < projects.length - 1) {
          // Scroll down - next project
          setCurrentIndex(prev => prev + 1)
        } else if (e.deltaY < 0 && currentIndex > 0) {
          // Scroll up - previous project
          setCurrentIndex(prev => prev - 1)
        }
        
        // Clear any existing timeout
        clearTimeout(scrollTimeout)
        
        // Reset the cooldown after a short delay
        scrollTimeout = setTimeout(() => {
          // This timeout is just for cleanup, not for blocking
        }, 100)
      }
    }

    // Handle touch events for mobile
    let touchStartY = 0
    let touchEndY = 0
    let lastTouchTime = 0
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (projects.length === 0) return
      
      const currentTime = Date.now()
      
      // Check if we're still in cooldown period
      if (currentTime - lastTouchTime < SCROLL_COOLDOWN) {
        return
      }
      
      touchEndY = e.changedTouches[0].clientY
      const deltaY = touchStartY - touchEndY
      const TOUCH_THRESHOLD = 50
      
      if (Math.abs(deltaY) > TOUCH_THRESHOLD) {
        lastTouchTime = currentTime
        
        if (deltaY > 0 && currentIndex < projects.length - 1) {
          // Swipe up - next project
          setCurrentIndex(prev => prev + 1)
        } else if (deltaY < 0 && currentIndex > 0) {
          // Swipe down - previous project
          setCurrentIndex(prev => prev - 1)
        }
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false })
      container.addEventListener('touchstart', handleTouchStart, { passive: true })
      container.addEventListener('touchend', handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll)
        container.removeEventListener('touchstart', handleTouchStart)
        container.removeEventListener('touchend', handleTouchEnd)
      }
      clearTimeout(scrollTimeout)
    }
  }, [currentIndex, projects.length])

  // Handle keyboard navigation
  useEffect(() => {
    let lastKeyTime = 0
    const KEY_COOLDOWN = 300
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (projects.length === 0) return
      
      const currentTime = Date.now()
      
      // Check if we're still in cooldown period
      if (currentTime - lastKeyTime < KEY_COOLDOWN) {
        return
      }
      
      if (e.key === 'ArrowDown' && currentIndex < projects.length - 1) {
        lastKeyTime = currentTime
        setCurrentIndex(prev => prev + 1)
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        lastKeyTime = currentTime
        setCurrentIndex(prev => prev - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, projects.length])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/projects?status=PUBLISHED")
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
        setCurrentIndex(0) // Reset to first project
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (projectId: string) => {
    setLikedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
    // TODO: Send API request to update likes
  }

  const handleMessage = (projectId: string) => {
    router.push(`/messages?project=${projectId}`)
  }

  const formatPrice = (price: number | null) => {
    if (!price) return "Price on request"
    return `$${price.toLocaleString()}`
  }

  const getShortDescription = (description: string) => {
    return description.length > 120 ? description.substring(0, 120) + "..." : description
  }

  const nextProject = () => {
    if (currentIndex < projects.length - 1 && !isScrolling) {
      setIsScrolling(true)
      setCurrentIndex(prev => prev + 1)
      setTimeout(() => setIsScrolling(false), 800)
    }
  }

  const prevProject = () => {
    if (currentIndex > 0 && !isScrolling) {
      setIsScrolling(true)
      setCurrentIndex(prev => prev - 1)
      setTimeout(() => setIsScrolling(false), 800)
    }
  }

  const currentProject = projects[currentIndex]

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading amazing projects...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (projects.length === 0) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground mb-2">No projects found</div>
            <p className="text-sm text-muted-foreground">Check back later for new projects</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopNavigation
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole={userType === "innovator" ? "innovator" : "investor"}
        isMobile={isMobile}
      />

      {/* Sidebar - Always visible on desktop */}
      <Sidebar isOpen={!isMobile || sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
      
      <div 
        ref={containerRef}
        className="min-h-screen overflow-hidden relative"
      >
        {/* Full Screen Project Display */}
        <div className="fixed inset-0 left-0 md:left-64 top-0"> {/* Account for sidebar on desktop */}
          <AnimatePresence mode="wait">
            {currentProject && (
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="w-full h-full relative"
              >
                {/* Background Image - Full Screen */}
                <div className="absolute inset-0">
                  {currentProject.images.length > 0 ? (
                    <img
                      src={currentProject.images.find(img => img.isPrimary)?.url || currentProject.images[0]?.url || "/placeholder.svg"}
                      alt={currentProject.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-gray-400 text-8xl">📦</div>
                    </div>
                  )}
                </div>

                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Bottom Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="max-w-2xl">
                    {/* Title */}
                    <h1 className="text-white text-2xl md:text-3xl font-bold mb-4 leading-tight">
                      {currentProject.title}
                    </h1>

                    {/* Creator Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10 border-2 border-white/50">
                        <AvatarImage src={currentProject.inventor.profileImage || "/placeholder-user.jpg"} />
                        <AvatarFallback className="bg-white/20 text-white">
                          {currentProject.inventor.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">
                          {currentProject.inventor.name}
                        </p>
                        <p className="text-white/70 text-sm">
                          Creator
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    {currentProject.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {currentProject.tags.slice(0, 4).map((tagWrapper) => (
                          <Badge 
                            key={tagWrapper.tag.id} 
                            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                          >
                            #{tagWrapper.tag.name}
                          </Badge>
                        ))}
                        {currentProject.tags.length > 4 && (
                          <Badge className="bg-white/20 text-white border-white/30">
                            +{currentProject.tags.length - 4} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Stats Row */}
                    <div className="flex items-center gap-6 text-white">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        <span className="font-medium">{currentProject._count.likes} likes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        <span className="font-medium">{currentProject._count.investments} investments</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Right Actions */}
                <div className="absolute top-6 right-6 flex gap-3">
                  {/* Like Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(currentProject.id)}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <Heart 
                      className={`h-6 w-6 ${likedProjects.has(currentProject.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                    />
                  </motion.button>

                  {/* Message Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleMessage(currentProject.id)}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <MessageCircle className="h-6 w-6 text-white" />
                  </motion.button>
                </div>

                {/* Top Left Status */}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-green-500/90 text-white border-0 px-3 py-1">
                    Published
                  </Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Indicators - Right Side */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-50">
          {projects.map((_, index) => (
            <motion.div
              key={index}
              className={`w-1 h-6 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex 
                  ? 'bg-white shadow-lg' 
                  : index < currentIndex 
                    ? 'bg-white/60 hover:bg-white/80' 
                    : 'bg-white/30 hover:bg-white/50'
              }`}
              animate={{
                scale: index === currentIndex ? 1.5 : 1,
                width: index === currentIndex ? 8 : 4
              }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                if (index !== currentIndex) {
                  setCurrentIndex(index)
                }
              }}
            />
          ))}
        </div>



        {/* Navigation Hint - Only on First Project */}
        {currentIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center z-40 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="mb-2"
            >
              <ChevronDown className="h-6 w-6 mx-auto drop-shadow-lg" />
            </motion.div>
            <p className="text-sm drop-shadow-lg font-medium">Scroll for next project</p>
          </motion.div>
        )}
      </div>
      
      {/* FAB for role switching */}
      <FabToggleRole />
    </div>
  )
}
