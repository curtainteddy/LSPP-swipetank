"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, X, Info, TrendingUp, Users, Eye, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppLayout } from "@/components/layout/app-layout"
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { AnalysisPanel } from "./analysis-panel"

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

export default function SwipeBrowseScreen() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [analysisCached, setAnalysisCached] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 300], [-45, 45])
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0])

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
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalysis = async () => {
    if (!currentProject) return

    try {
      setAnalysisLoading(true)
      const response = await fetch(`/api/analysis/${currentProject.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setAnalysisData(data.analysis)
        setAnalysisCached(data.cached || false)
      } else {
        const errorData = await response.json()
        setAnalysisData({ error: errorData.error || "Failed to generate analysis" })
      }
    } catch (error) {
      console.error("Error fetching analysis:", error)
      setAnalysisData({ error: "Network error occurred" })
    } finally {
      setAnalysisLoading(false)
    }
  }

  const currentProject = projects[currentIndex]

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction)
    
    // Handle the swipe action
    if (direction === "right" && currentProject) {
      // Like/Save project
      console.log("Liked project:", currentProject.id)
    } else if (direction === "left" && currentProject) {
      // Pass on project
      console.log("Passed project:", currentProject.id)
    }

    // Move to next project after animation
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % projects.length)
      setSwipeDirection(null)
      setAnalysisData(null) // Reset analysis data for new project
      x.set(0)
    }, 300)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 150
    if (info.offset.x > threshold) {
      handleSwipe("right")
    } else if (info.offset.x < -threshold) {
      handleSwipe("left")
    } else {
      x.set(0)
    }
  }

  const openAnalysis = () => {
    setAnalysisOpen(true)
    if (!analysisData) {
      fetchAnalysis()
    }
  }

  const retryAnalysis = async () => {
    await fetchAnalysis()
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading projects...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!currentProject) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">All caught up!</h2>
            <p className="text-gray-600">Check back later for new projects</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Swipe Card */}
        <motion.div
          className="relative w-full max-w-sm h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 0.95 }}
        >
          {/* Project Image */}
          <div className="relative h-2/3 overflow-hidden">
            {currentProject.images.length > 0 ? (
              <img
                src={currentProject.images.find(img => img.isPrimary)?.url || currentProject.images[0]?.url || "/placeholder.svg"}
                alt={currentProject.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-gray-500 text-6xl">💡</div>
              </div>
            )}

            {/* Swipe Indicators */}
            <div className="absolute inset-0 flex">
              <div 
                className={`flex-1 flex items-center justify-center transition-all duration-200 ${
                  swipeDirection === "left" ? "bg-red-500/20" : ""
                }`}
              >
                {swipeDirection === "left" && (
                  <div className="bg-red-500 text-white p-4 rounded-full">
                    <X className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div 
                className={`flex-1 flex items-center justify-center transition-all duration-200 ${
                  swipeDirection === "right" ? "bg-green-500/20" : ""
                }`}
              >
                {swipeDirection === "right" && (
                  <div className="bg-green-500 text-white p-4 rounded-full">
                    <Heart className="h-8 w-8" />
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Button */}
            <Button
              onClick={openAnalysis}
              className="absolute top-4 right-4 bg-white/90 text-primary hover:bg-white rounded-full w-12 h-12 p-0"
            >
              <TrendingUp className="h-5 w-5" />
            </Button>
          </div>

          {/* Project Info */}
          <div className="p-6 h-1/3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                  {currentProject.title}
                </h2>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Active
                </Badge>
              </div>

              <div className="flex items-center mb-3">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={currentProject.inventor.profileImage || "/placeholder-user.jpg"} />
                  <AvatarFallback className="text-xs">
                    {currentProject.inventor.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">{currentProject.inventor.name}</span>
                <span className="text-sm text-gray-400 ml-1">Creator</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {currentProject.tags.slice(0, 4).map((tagObj, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1"
                  >
                    #{tagObj.tag.name}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {currentProject._count.likes} likes
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {currentProject._count.investments} investments
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="flex justify-center">
              <ChevronDown className="h-5 w-5 text-gray-400 animate-bounce" />
              <span className="text-xs text-gray-400 ml-1">Scroll for next project</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
          <Button
            onClick={() => handleSwipe("left")}
            size="lg"
            variant="outline"
            className="w-14 h-14 rounded-full border-2 border-gray-300 hover:border-red-400 hover:bg-red-50"
          >
            <X className="h-6 w-6 text-gray-600 hover:text-red-500" />
          </Button>

          <Button
            onClick={openAnalysis}
            size="lg"
            variant="outline"
            className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          >
            <Info className="h-5 w-5 text-gray-600 hover:text-blue-500" />
          </Button>

          <Button
            onClick={() => handleSwipe("right")}
            size="lg"
            className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white"
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 bg-white/90 px-3 py-1 rounded-full">
          {currentIndex + 1} of {projects.length}
        </div>

        {/* Analysis Panel */}
        <AnalysisPanel
          isVisible={analysisOpen}
          isLoading={analysisLoading}
          analysisData={analysisData}
          project={currentProject}
          onClose={() => setAnalysisOpen(false)}
          onRetry={retryAnalysis}
          cached={analysisCached}
        />
      </div>
    </AppLayout>
  )
}