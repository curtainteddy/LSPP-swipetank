"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, TrendingUp, Users, DollarSign, Plus, Filter, Calendar, MapPin, Clock, ChevronRight, Building, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/layout/app-layout"
import { useUser } from "@/contexts/user-context"

interface DashboardData {
  userType: "inventor" | "investor"
  stats: Array<{
    title: string
    value: string
    icon: string
    color: string
  }>
  recentProjects: Array<{
    id: string
    name: string
    description: string
    status?: string
    investments?: number
    likes?: number
    inventorName?: string
    amount?: number
    investmentDate?: string
    lastUpdated: string
  }>
  recentActivity: Array<{
    id: string
    title: string
    description: string
    time: string
    type: string
  }>
  analyses?: Array<{
    id: string
    projectTitle: string
    createdAt: string
    data: any
  }>
  investments?: Array<{
    id: string
    projectTitle: string
    inventorName: string
    amount: number
    createdAt: string
  }>
}

const iconMap = {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
}

const stats = [
  {
    title: "Total Projects",
    value: "12",
    change: "+2.5%",
    icon: BarChart3,
    color: "text-blue-500",
  },
  {
    title: "Active Analyses",
    value: "8",
    change: "+12%",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    title: "Investor Matches",
    value: "24",
    change: "+8.1%",
    icon: Users,
    color: "text-purple-500",
  },
  {
    title: "Funding Potential",
    value: "$2.4M",
    change: "+15%",
    icon: DollarSign,
    color: "text-orange-500",
  },
]

const recentProjects = [
  {
    id: 1,
    name: "EcoTrack Mobile",
    description: "Sustainable transportation tracking app with carbon footprint analysis",
    status: "analyzing",
    progress: 75,
    lastUpdated: "2 hours ago",
    category: "Sustainability",
    funding: "$150K",
    team: 4,
    stage: "MVP",
    marketSize: "$2.1B",
  },
  {
    id: 2,
    name: "FinTech Dashboard",
    description: "Real-time financial analytics platform for small businesses",
    status: "completed",
    progress: 100,
    lastUpdated: "1 day ago",
    category: "Finance",
    funding: "$500K",
    team: 8,
    stage: "Growth",
    marketSize: "$4.5B",
  },
  {
    id: 3,
    name: "HealthCare AI",
    description: "AI-powered diagnostic tool for early disease detection",
    status: "pending",
    progress: 25,
    lastUpdated: "3 days ago",
    category: "Healthcare",
    funding: "$75K",
    team: 3,
    stage: "Prototype",
    marketSize: "$12.3B",
  },
]



export default function DashboardScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const { userType } = useUser()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!dashboardData) {
    return (
      <AppLayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load dashboard data</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const StatCard = ({ stat, index }: { stat: DashboardData['stats'][0]; index: number }) => {
    const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || BarChart3

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <IconComponent className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes} min ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInHours / 24)
      return `${days} day${days !== 1 ? 's' : ''} ago`
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
        <div className="flex">

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {userType === "innovator" ? "John" : "Sarah"}!
              </h1>
              <p className="text-muted-foreground">
                {userType === "innovator" 
                  ? "Here's what's happening with your projects today." 
                  : "Here's your investment portfolio overview and deal flow updates."}
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {dashboardData.stats.map((stat, index) => (
                <StatCard key={stat.title} stat={stat} index={index} />
              ))}
            </div>

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {userType === "innovator" ? "Recent Projects" : "Deal Pipeline"}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => router.push(userType === "innovator" ? "/analytics" : "/browse")}>
                        <Plus className="h-4 w-4 mr-2" />
                        {userType === "innovator" ? "New Analysis" : "Browse Startups"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentProjects.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          {userType === "innovator" 
                            ? "No projects yet. Create your first project to get started!" 
                            : "No investments yet. Browse projects to make your first investment!"}
                        </p>
                        <Button 
                          className="mt-4" 
                          onClick={() => router.push(userType === "innovator" ? "/projects/new" : "/browse")}
                        >
                          {userType === "innovator" ? "Create Project" : "Browse Projects"}
                        </Button>
                      </div>
                    ) : (
                        dashboardData.recentProjects.map((project, index) => (
                            <motion.div
                              key={project.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => router.push(`/projects/${project.id}`)}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-4 flex-1">
                                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                                    <BarChart3 className="h-6 w-6 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <h3 className="font-semibold text-lg">{project.name}</h3>
                                      {project.status && (
                                        <Badge
                                          variant={
                                            project.status === "published"
                                              ? "default"
                                              : project.status === "draft"
                                                ? "secondary"
                                                : "outline"
                                          }
                                          className="ml-2"
                                        >
                                          {project.status}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                      {project.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                      <span>{formatTimeAgo(project.lastUpdated)}</span>
                                      {project.inventorName && <span>by {project.inventorName}</span>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Project Stats */}
                              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border/50">
                                {/* Show investment amount for investors, regular stats for inventors */}
                                {dashboardData.userType === "investor" && project.amount !== undefined ? (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-4 w-4 text-green-500" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Your Investment</p>
                                        <p className="text-sm font-medium">${Number(project.amount).toLocaleString()}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-blue-500" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Invested</p>
                                        <p className="text-sm font-medium">
                                          {project.investmentDate ? formatTimeAgo(project.investmentDate) : 'Recently'}
                                        </p>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {project.investments !== undefined && (
                                      <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-green-500" />
                                        <div>
                                          <p className="text-xs text-muted-foreground">Investments</p>
                                          <p className="text-sm font-medium">{project.investments}</p>
                                        </div>
                                      </div>
                                    )}
                                    {project.likes !== undefined && (
                                      <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-blue-500" />
                                        <div>
                                          <p className="text-xs text-muted-foreground">Likes</p>
                                          <p className="text-sm font-medium">{project.likes}</p>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </motion.div>
                          ))
                      )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
