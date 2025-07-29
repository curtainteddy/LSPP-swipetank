"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowUpDown, Filter, Home, MessageCircle, Search, Star, Trash2, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/ui/logo"
import { ViewToggle, useViewMode } from "@/components/ui/view-toggle"
import { ThemeToggle } from "@/components/ui/theme-toggle"

// Sample saved projects data
const savedProjects = [
  {
    id: 1,
    title: "EcoTrack",
    tagline: "Sustainable living app for carbon footprint tracking",
    techStack: ["React Native", "Node.js", "MongoDB"],
    domain: "Sustainability",
    date: "2023-11-15",
    coverImage: "/placeholder.svg?height=200&width=300",
    gradient: "gradient-bg-1",
    shadow: "shadow-blue-glow",
  },
  {
    id: 2,
    title: "MindMeld",
    tagline: "AI-powered collaborative brainstorming tool",
    techStack: ["Next.js", "TensorFlow", "Firebase"],
    domain: "Productivity",
    date: "2023-12-02",
    coverImage: "/placeholder.svg?height=200&width=300",
    gradient: "gradient-bg-2",
    shadow: "shadow-teal-glow",
  },
  {
    id: 3,
    title: "HealthHub",
    tagline: "Personalized health monitoring dashboard",
    techStack: ["Flutter", "Python", "AWS"],
    domain: "Healthcare",
    date: "2023-12-10",
    coverImage: "/placeholder.svg?height=200&width=300",
    gradient: "gradient-bg-3",
    shadow: "shadow-purple-glow",
  },
  {
    id: 4,
    title: "CodeBuddy",
    tagline: "AI pair programming assistant for developers",
    techStack: ["TypeScript", "OpenAI", "VS Code Extension"],
    domain: "Developer Tools",
    date: "2023-12-15",
    coverImage: "/placeholder.svg?height=200&width=300",
    gradient: "gradient-bg-1",
    shadow: "shadow-blue-glow",
  },
  {
    id: 5,
    title: "FinTrack",
    tagline: "Personal finance management with AI insights",
    techStack: ["React", "Python", "PostgreSQL"],
    domain: "Finance",
    date: "2023-12-20",
    coverImage: "/placeholder.svg?height=200&width=300",
    gradient: "gradient-bg-2",
    shadow: "shadow-teal-glow",
  },
]

export default function SavedProjectsScreen() {
  const router = useRouter()
  const [projects, setProjects] = useState(savedProjects)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [techFilter, setTechFilter] = useState<string | null>(null)
  const [domainFilter, setDomainFilter] = useState<string | null>(null)

  // Get unique tech stacks and domains for filters
  const techStacks = Array.from(new Set(savedProjects.flatMap((p) => p.techStack)))
  const domains = Array.from(new Set(savedProjects.map((p) => p.domain)))

  const handleRemoveProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  // Filter projects based on search and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tagline.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTech = !techFilter || project.techStack.includes(techFilter)
    const matchesDomain = !domainFilter || project.domain === domainFilter

    return matchesSearch && matchesTech && matchesDomain
  })

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-background">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <Logo />
        <div className="flex items-center gap-3">
          <ViewToggle />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            <ArrowUpDown className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                <Filter className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border border-primary/20 bg-background/95 backdrop-blur-sm"
            >
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Tech Stack</p>
                <Select onValueChange={(value) => setTechFilter(value === "all" ? null : value)}>
                  <SelectTrigger className="border-primary/20 focus:ring-primary/30">
                    <SelectValue placeholder="All Technologies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Technologies</SelectItem>
                    {techStacks.map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Domain</p>
                <Select onValueChange={(value) => setDomainFilter(value === "all" ? null : value)}>
                  <SelectTrigger className="border-primary/20 focus:ring-primary/30">
                    <SelectValue placeholder="All Domains" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    {domains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-gradient-to-b from-background to-muted/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search saved projects..."
            className="pl-9 border-primary/20 focus-visible:ring-primary/30 bg-background/80 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Projects List/Grid */}
      <div className="flex-1 p-4 overflow-auto bg-gradient-to-b from-muted/10 to-background">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Star className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No saved projects</h3>
            <p className="text-sm text-muted-foreground mt-1">Projects you save will appear here</p>
            <Button
              variant="outline"
              className="mt-4 border-primary text-primary hover:bg-primary/10"
              onClick={() => router.push("/")}
            >
              Discover Projects
            </Button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}>
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className={`${viewMode === "list" ? "flex overflow-hidden" : ""} border-0 ${project.shadow} card-hover`}
              >
                {viewMode === "list" ? (
                  <>
                    <div className={`relative w-[100px] ${project.gradient}`}>
                      <Image
                        src={project.coverImage || "/placeholder.svg"}
                        alt={project.title}
                        width={100}
                        height={100}
                        className="h-full object-cover mix-blend-overlay"
                      />
                    </div>
                    <div className="flex flex-col flex-1 p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-sm">{project.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{project.tagline}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-secondary/10 hover:text-secondary"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleRemoveProject(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.techStack.slice(0, 2).map((tech, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-primary/5 border-primary/20 text-primary/80"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.techStack.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary/80">
                            +{project.techStack.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <CardContent className="p-0">
                      <div className={`relative ${project.gradient}`}>
                        <Image
                          src={project.coverImage || "/placeholder.svg"}
                          alt={project.title}
                          width={300}
                          height={150}
                          className="w-full h-28 object-cover mix-blend-overlay"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                          <h3 className="font-medium text-sm text-white">{project.title}</h3>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{project.tagline}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {project.techStack.slice(0, 1).map((tech, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs bg-primary/5 border-primary/20 text-primary/80"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.techStack.length > 1 && (
                            <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary/80">
                              +{project.techStack.length - 1}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 pt-0 flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full hover:bg-secondary/10 hover:text-secondary"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleRemoveProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-around p-4 bg-background/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          className="flex flex-col items-center hover:text-primary"
          onClick={() => router.push("/")}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center text-secondary"
          onClick={() => router.push("/saved-projects")}
        >
          <Star className="h-6 w-6 fill-secondary" />
          <span className="text-xs mt-1 font-medium">Saved</span>
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
