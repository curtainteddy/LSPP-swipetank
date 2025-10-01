"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, Filter, MessageCircle, Users, Eye, TrendingUp, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AppLayout } from "@/components/layout/app-layout"
import { motion } from "framer-motion"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    industry: "all",
    investmentType: "all",
    priceRange: [0, 10000],
  })

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

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  const formatPrice = (price: number | null) => {
    if (!price) return "Price on request"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getShortDescription = (description: string) => {
    const firstLine = description.split('\n')[0]
    return firstLine.length > 120 ? firstLine.substring(0, 120) + '...' : firstLine
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading projects...</div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-white">
        {/* Airbnb-style header */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-airbnb-3xl font-semibold text-gray-900">Discover Projects</h1>
                <p className="text-airbnb-lg text-gray-600 mt-2">Find innovative projects and connect with inventors worldwide</p>
              </div>
              
              {/* Filters */}
              <div className="flex gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-airbnb px-6"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filter Projects</SheetTitle>
                      <SheetDescription>
                        Refine your search to find the perfect projects
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="space-y-6 mt-6">
                      <div>
                        <Label className="text-airbnb-sm font-medium text-gray-900">Industry</Label>
                        <Select value={filters.industry} onValueChange={(value) => setFilters({...filters, industry: value})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Industries</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="environment">Environment</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-airbnb-sm font-medium text-gray-900">Investment Type</Label>
                        <Select value={filters.investmentType} onValueChange={(value) => setFilters({...filters, investmentType: value})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="equity">Equity</SelectItem>
                            <SelectItem value="loan">Loan</SelectItem>
                            <SelectItem value="grant">Grant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-airbnb-sm font-medium text-gray-900 mb-4 block">
                          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                        </Label>
                        <Slider
                          value={filters.priceRange}
                          onValueChange={(value) => setFilters({...filters, priceRange: value})}
                          max={100000}
                          min={0}
                          step={1000}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 bg-white">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-airbnb-2xl font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-airbnb-base text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* Airbnb-style Project Card */}
                  <div 
                    className="group cursor-pointer"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    {/* Project Image with Airbnb styling */}
                    <div className="relative aspect-square mb-3 overflow-hidden rounded-airbnb">
                      {project.images.length > 0 ? (
                        <img
                          src={project.images.find(img => img.isPrimary)?.url || project.images[0]?.url || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-gray-400 text-4xl">💡</div>
                        </div>
                      )}
                      
                      {/* Heart Button - Airbnb style */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-3 right-3 h-7 w-7 rounded-full bg-transparent hover:bg-white/10 border-0 shadow-none"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(project.id)
                        }}
                      >
                        <Heart 
                          className={`h-5 w-5 transition-colors ${
                            likedProjects.has(project.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-white fill-black/20 hover:fill-black/40'
                          }`} 
                        />
                      </Button>
                    </div>

                    {/* Airbnb-style content */}
                    <div className="space-y-1">
                      {/* Location and Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-airbnb-sm text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          {project.inventor.name}
                        </div>
                        <div className="flex items-center text-airbnb-sm text-gray-600">
                          <Eye className="h-3 w-3 mr-1" />
                          {Math.floor(Math.random() * 100)}
                        </div>
                      </div>
                      
                      {/* Project Title */}
                      <h3 className="text-airbnb-base font-medium text-gray-900 line-clamp-1 group-hover:text-gray-700">
                        {project.title}
                      </h3>
                      
                      {/* Brief description */}
                      <p className="text-airbnb-sm text-gray-600 line-clamp-1">
                        {getShortDescription(project.description)}
                      </p>
                      
                      {/* Tags */}
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.tags.slice(0, 2).map((tagObj, index) => (
                            <Badge 
                              key={index}
                              variant="secondary"
                              className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md px-2 py-1"
                            >
                              {tagObj.tag.name}
                            </Badge>
                          ))}
                          {project.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs text-gray-500">
                              +{project.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Price and Stats */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                        <div className="text-airbnb-sm">
                          <span className="font-semibold text-gray-900">{formatPrice(project.price)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-airbnb-xs text-gray-500">
                          <div className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {project._count.likes}
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {project._count.investments}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}