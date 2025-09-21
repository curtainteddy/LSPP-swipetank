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
  const [filters, setFilters] = useState({
    industry: "all",
    investmentType: "all",
    priceRange: [0, 10000],
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  // Handle scroll to navigate between projects
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    
    const handleScroll = (e: WheelEvent) => {
      if (isScrolling || projects.length === 0) return
      
      e.preventDefault()
      setIsScrolling(true)
      
      if (e.deltaY > 0 && currentIndex < projects.length - 1) {
        // Scroll down - next project
        setCurrentIndex(prev => prev + 1)
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Scroll up - previous project
        setCurrentIndex(prev => prev - 1)
      }
      
      // Reset scrolling state after animation
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 800)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll)
      }
      clearTimeout(scrollTimeout)
    }
  }, [currentIndex, projects.length, isScrolling])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling || projects.length === 0) return
      
      if (e.key === 'ArrowDown' && currentIndex < projects.length - 1) {
        setIsScrolling(true)
        setCurrentIndex(prev => prev + 1)
        setTimeout(() => setIsScrolling(false), 800)
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        setIsScrolling(true)
        setCurrentIndex(prev => prev - 1)
        setTimeout(() => setIsScrolling(false), 800)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, projects.length, isScrolling])

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
    <AppLayout>
      <div 
        ref={containerRef}
        className="min-h-screen overflow-hidden relative"
      >
        {/* Fixed Header */}
        <div className="fixed top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">Browse Projects</h1>
              <Badge variant="outline" className="text-xs">
                {currentIndex + 1} of {projects.length}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
              />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Projects</SheetTitle>
                    <SheetDescription>
                      Narrow down your search with these filters
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div>
                      <Label>Industry</Label>
                      <Select value={filters.industry} onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Industries</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</Label>
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                        max={10000}
                        step={100}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Project Display Area */}
        <div className="pt-24 min-h-screen flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentProject && (
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full max-w-4xl mx-auto px-4"
              >
                <Card className="overflow-hidden shadow-2xl">
                  {/* Project Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    {currentProject.images.length > 0 ? (
                      <img
                        src={currentProject.images.find(img => img.isPrimary)?.url || currentProject.images[0]?.url || "/placeholder.svg"}
                        alt={currentProject.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-400 text-8xl">📦</div>
                      </div>
                    )}
                    
                    {/* Like Button */}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/90 hover:bg-white shadow-lg"
                      onClick={() => handleLike(currentProject.id)}
                    >
                      <Heart 
                        className={`h-6 w-6 ${likedProjects.has(currentProject.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                      />
                    </Button>

                    {/* Status Badge */}
                    <Badge className="absolute top-6 left-6 bg-green-500 text-white text-sm px-3 py-1">
                      Published
                    </Badge>
                  </div>

                  <CardContent className="p-8">
                    {/* Title and Inventor */}
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold mb-3">{currentProject.title}</h2>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={currentProject.inventor.profileImage || "/placeholder-user.jpg"} />
                          <AvatarFallback>
                            {currentProject.inventor.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{currentProject.inventor.name}</p>
                          <p className="text-sm text-muted-foreground">{currentProject.inventor.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {currentProject.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {currentProject.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {currentProject.tags.map((tagWrapper) => (
                          <Badge 
                            key={tagWrapper.tag.id} 
                            variant="secondary" 
                            className="px-3 py-1"
                          >
                            {tagWrapper.tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats and Price */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(currentProject.price)}
                      </div>
                      <div className="flex items-center gap-6 text-muted-foreground">
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

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button 
                        size="lg" 
                        className="flex-1"
                        onClick={() => router.push(`/projects/${currentProject.id}`)}
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        View Full Details
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        onClick={() => handleMessage(currentProject.id)}
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Contact Inventor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Indicators */}
        <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4">
          {/* Scroll Hint */}
          {!isScrolling && (
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-muted-foreground text-sm text-center"
            >
              <ChevronDown className="h-6 w-6 mx-auto mb-1" />
              <p>Scroll to browse</p>
            </motion.div>
          )}

          {/* Progress Indicator */}
          <div className="flex flex-col gap-2">
            {projects.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-8 rounded-full transition-colors duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary' 
                    : index < currentIndex 
                      ? 'bg-primary/40' 
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts Helper */}
        <div className="fixed bottom-8 left-8 text-xs text-muted-foreground">
          <p>Use ↑↓ arrow keys or scroll to navigate</p>
        </div>
      </div>
    </AppLayout>
  )
}
