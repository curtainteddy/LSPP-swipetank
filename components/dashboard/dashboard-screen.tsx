"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, TrendingUp, Users, DollarSign, Plus, Search, Filter, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

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
    status: "analyzing",
    progress: 75,
    lastUpdated: "2 hours ago",
    category: "Sustainability",
  },
  {
    id: 2,
    name: "FinTech Dashboard",
    status: "completed",
    progress: 100,
    lastUpdated: "1 day ago",
    category: "Finance",
  },
  {
    id: 3,
    name: "HealthCare AI",
    status: "pending",
    progress: 25,
    lastUpdated: "3 days ago",
    category: "Healthcare",
  },
]

const notifications = [
  {
    id: 1,
    title: "New investor match found",
    description: "TechVentures is interested in your EcoTrack project",
    time: "5 min ago",
    type: "match",
  },
  {
    id: 2,
    title: "Analysis completed",
    description: "Your competitor analysis for FinTech Dashboard is ready",
    time: "1 hour ago",
    type: "analysis",
  },
  {
    id: 3,
    title: "Portfolio updated",
    description: "Your business portfolio has been automatically updated",
    time: "2 hours ago",
    type: "portfolio",
  },
]

export default function DashboardScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  const StatCard = ({ stat, index }: { stat: (typeof stats)[0]; index: number }) => {
    if (isLoading) {
      return (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      )
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10 w-64 border-primary/20 focus:border-primary/50"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <ThemeToggle />
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} stat={stat} index={index} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Projects</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button size="sm" onClick={() => router.push("/analytics")}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Analysis
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading
                      ? Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <Skeleton className="h-10 w-10 rounded" />
                              <div>
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                            </div>
                            <Skeleton className="h-6 w-16" />
                          </div>
                        ))
                      : recentProjects.map((project, index) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => router.push(`/analytics/${project.id}`)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                                <BarChart3 className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium">{project.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {project.lastUpdated} • {project.category}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                project.status === "completed"
                                  ? "default"
                                  : project.status === "analyzing"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {project.status}
                            </Badge>
                          </motion.div>
                        ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Notifications */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Stay updated with your latest notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading
                      ? Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        ))
                      : notifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="space-y-1 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          >
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </motion.div>
                        ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with these common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-primary/10 bg-transparent"
                  onClick={() => router.push("/analytics")}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Analyze App</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-secondary/10 bg-transparent"
                  onClick={() => router.push("/portfolio")}
                >
                  <Users className="h-6 w-6" />
                  <span>Build Portfolio</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-accent/10 bg-transparent">
                  <TrendingUp className="h-6 w-6" />
                  <span>Find Investors</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
