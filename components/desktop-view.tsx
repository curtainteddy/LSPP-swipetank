"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Heart, Home, Star, User, X, Github, ExternalLink, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Project {
  id: number
  title: string
  description: string
  techStack: string[]
  innovator: string
  innovatorAvatar: string
  coverImage: string
  gradient: string
  shadow: string
}

interface DesktopViewProps {
  projects: Project[]
  savedProjects: number[]
  onSaveProject: (projectId: number) => void
  onUnsaveProject: (projectId: number) => void
}

export function DesktopView({ projects, savedProjects, onSaveProject, onUnsaveProject }: DesktopViewProps) {
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const toggleSave = (projectId: number) => {
    if (savedProjects.includes(projectId)) {
      onUnsaveProject(projectId)
    } else {
      onSaveProject(projectId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b">
        <div className="absolute inset-0 bg-grid-pattern"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              SwipeTank Projects
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover innovative hackathon projects from talented developers around the world
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>{projects.length} Active Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="desktop-card group overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={project.coverImage || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <Button
                    size="sm"
                    variant={savedProjects.includes(project.id) ? "default" : "secondary"}
                    className="rounded-full shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSave(project.id)
                    }}
                  >
                    <Heart className={`w-4 h-4 ${savedProjects.includes(project.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                      <AvatarImage src={project.innovatorAvatar} alt={project.innovator} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-secondary text-white">
                        {project.innovator.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-muted-foreground">
                      {project.innovator}
                    </span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300">
                      View Details
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{project.title}</DialogTitle>
                      <DialogDescription className="text-base">
                        {project.description}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="relative aspect-video overflow-hidden rounded-lg">
                        <Image
                          src={project.coverImage || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Tech Stack</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech, index) => (
                              <Badge key={index} variant="outline">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Developer</h4>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={project.innovatorAvatar} alt={project.innovator} />
                              <AvatarFallback>{project.innovator.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{project.innovator}</p>
                              <p className="text-sm text-muted-foreground">Project Innovator</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <Button 
                            className="flex-1"
                            onClick={() => toggleSave(project.id)}
                            variant={savedProjects.includes(project.id) ? "default" : "outline"}
                          >
                            <Heart className={`w-4 h-4 mr-2 ${savedProjects.includes(project.id) ? "fill-current" : ""}`} />
                            {savedProjects.includes(project.id) ? "Saved" : "Save Project"}
                          </Button>
                          <Button variant="outline" size="icon">
                            <Github className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-8">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-primary" 
              onClick={() => router.push("/")}
            >
              <Home className="h-5 w-5 fill-primary" />
              <span className="font-medium">Home</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:text-secondary"
              onClick={() => router.push("/saved-projects")}
            >
              <Star className="h-5 w-5" />
              <span>Saved Projects</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:text-accent"
              onClick={() => router.push("/profile")}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
