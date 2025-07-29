"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Heart, Home, Menu, Star, User, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ViewToggle, useViewMode } from "@/components/ui/view-toggle"
import { DesktopView } from "@/components/desktop-view"

// Sample project data
const projects = [
  {
    id: 1,
    title: "EcoTrack",
    description: "A sustainable living app that tracks your carbon footprint and suggests eco-friendly alternatives.",
    techStack: ["React Native", "Node.js", "MongoDB"],
    innovator: "Alex Chen",
    innovatorAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "https://c02.purpledshub.com/uploads/sites/39/2024/07/best-cycling-apps.jpg?w=1200",
    gradient: "gradient-bg-1",
    shadow: "shadow-blue-glow",
  },
  {
    id: 2,
    title: "MindMeld",
    description: "AI-powered collaborative brainstorming tool for remote teams.",
    techStack: ["Next.js", "TensorFlow", "Firebase"],
    innovator: "Priya Sharma",
    innovatorAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "https://www.softwaretestinghelp.com/wp-content/qa/uploads/2018/11/introduction-3.png",
    gradient: "gradient-bg-2",
    shadow: "shadow-teal-glow",
  },
  {
    id: 3,
    title: "HealthHub",
    description: "Personalized health monitoring dashboard integrating wearable data.",
    techStack: ["Flutter", "Python", "AWS"],
    innovator: "Marcus Johnson",
    innovatorAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=600&width=400",
    gradient: "gradient-bg-3",
    shadow: "shadow-purple-glow",
  },
]

export default function SwipeTankHome() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [savedProjects, setSavedProjects] = useState<number[]>([])
  const [swipeAnimation, setSwipeAnimation] = useState<"" | "swipe-left" | "swipe-right">("")
  const cardRef = useRef<HTMLDivElement>(null)
  const viewMode = useViewMode()

  const handleSwipeRight = () => {
    if (!savedProjects.includes(projects[currentIndex].id)) {
      setSavedProjects([...savedProjects, projects[currentIndex].id])
    }
    setSwipeAnimation("swipe-right")
  }

  const handleSwipeLeft = () => {
    setSwipeAnimation("swipe-left")
  }

  const handleSaveProject = (projectId: number) => {
    if (!savedProjects.includes(projectId)) {
      setSavedProjects([...savedProjects, projectId])
    }
  }

  const handleUnsaveProject = (projectId: number) => {
    setSavedProjects(savedProjects.filter(id => id !== projectId))
  }

  const nextProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
    setSwipeAnimation("")
  }

  useEffect(() => {
    if (swipeAnimation) {
      const timer = setTimeout(() => {
        nextProject()
      }, 500) // Match this to the animation duration
      return () => clearTimeout(timer)
    }
  }, [swipeAnimation])

  const currentProject = projects[currentIndex]

  // Render desktop view if desktop mode is selected
  if (viewMode === "desktop") {
    return (
      <div className="min-h-screen">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
          <Logo />
          <div className="flex items-center gap-3">
            <ViewToggle />
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <DesktopView 
          projects={projects} 
          savedProjects={savedProjects}
          onSaveProject={handleSaveProject}
          onUnsaveProject={handleUnsaveProject}
        />
      </div>
    )
  }

  // Mobile view (original layout)
  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-background">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <Logo />
        <div className="flex items-center gap-3">
          <ViewToggle />
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content - Full Screen Card */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={cardRef} className={`absolute inset-0 ${swipeAnimation}`}>
          <div className="relative h-full w-full">
            {/* Card Background with Gradient Overlay */}
            {/* <div className={`absolute inset-0 ${currentProject.gradient} opacity-10 z-1`}></div> */}

            {/* Project Image */}
            <Image
              src={currentProject.coverImage || "/placeholder.svg"}
              alt={currentProject.title}
              fill
              className="object-cover  z-0"
              priority
            />

            {/* Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 card-overlay z-10 p-6 space-y-4">
              <h2 className="text-3xl font-bold text-white">{currentProject.title}</h2>

              <p className="text-sm text-white/90">{currentProject.description}</p>

              <div className="flex flex-wrap gap-2">
                {currentProject.techStack.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-primary/20 text-white border-primary/40 hover:bg-primary/30"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center pt-2">
                <Avatar className="h-10 w-10 mr-3 ring-2 ring-primary/30">
                  <AvatarImage
                    src={currentProject.innovatorAvatar || "/placeholder.svg"}
                    alt={currentProject.innovator}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary/80 to-secondary/80 text-white">
                    {currentProject.innovator.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-white">{currentProject.innovator}</span>
              </div>

                    {/* Swipe Controls */}
      <div className="flex justify-center gap-8 p-6  z-20">
        <Button
          onClick={handleSwipeLeft}
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full border-2 border-destructive shadow-lg shadow-destructive/20 btn-pulse hover:bg-destructive/10 hover:scale-105 transition-all"
        >
          <X className="h-8 w-8 text-destructive" />
        </Button>
        <Button
          onClick={handleSwipeRight}
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full border-2 border-green-500 shadow-lg shadow-green-500/20 btn-pulse hover:bg-green-500/10 hover:scale-105 transition-all"
        >
          <Heart className="h-8 w-8 text-green-500" />
        </Button>
      </div>
            </div>
          </div>
        </div>
      </div>



      {/* Bottom Navigation */}
      <div className="flex items-center justify-around p-4 bg-background/80 backdrop-blur-sm">
        <Button variant="ghost" className="flex flex-col items-center text-primary" onClick={() => router.push("/")}>
          <Home className="h-6 w-6 fill-primary" />
          <span className="text-xs mt-1 font-medium">Home</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center hover:text-secondary"
          onClick={() => router.push("/saved-projects")}
        >
          <Star className="h-6 w-6" />
          <span className="text-xs mt-1">Saved</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center hover:text-accent"
          onClick={() => router.push("/profile")}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Button>
      </div>
    </div>
  )
}
