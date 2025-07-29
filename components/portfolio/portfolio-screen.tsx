"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Share, Edit, Plus, Eye, TrendingUp, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { motion } from "framer-motion"

const portfolioProjects = [
  {
    id: 1,
    name: "EcoTrack Mobile",
    description: "Sustainable living app that tracks carbon footprint and suggests eco-friendly alternatives",
    category: "Sustainability",
    stage: "MVP",
    funding: "$250K",
    valuation: "$2M",
    metrics: {
      users: "10K+",
      revenue: "$15K",
      growth: "+45%",
    },
    highlights: ["Featured in TechCrunch", "Winner of Green Tech Award 2024", "Partnership with major retailers"],
  },
  {
    id: 2,
    name: "FinTech Dashboard",
    description: "AI-powered financial analytics platform for small businesses",
    category: "Finance",
    stage: "Prototype",
    funding: "$100K",
    valuation: "$1.5M",
    metrics: {
      users: "5K+",
      revenue: "$8K",
      growth: "+32%",
    },
    highlights: ["Beta testing with 50+ businesses", "AI accuracy rate of 94%", "Partnerships with 3 banks"],
  },
  {
    id: 3,
    name: "HealthCare AI",
    description: "Machine learning platform for early disease detection",
    category: "Healthcare",
    stage: "Research",
    funding: "$500K",
    valuation: "$5M",
    metrics: {
      users: "Research Phase",
      revenue: "$0",
      growth: "N/A",
    },
    highlights: ["Clinical trials approved", "Partnership with medical centers", "Patent pending technology"],
  },
]

const investorMatches = [
  {
    name: "TechVentures Capital",
    type: "VC Fund",
    focus: "Early Stage Tech",
    matchScore: 95,
    investment: "$100K - $2M",
    portfolio: "50+ startups",
  },
  {
    name: "Green Impact Fund",
    type: "Impact Investor",
    focus: "Sustainability",
    matchScore: 88,
    investment: "$250K - $5M",
    portfolio: "30+ green startups",
  },
  {
    name: "Sarah Chen",
    type: "Angel Investor",
    focus: "AI & Healthcare",
    matchScore: 82,
    investment: "$50K - $500K",
    portfolio: "15+ investments",
  },
]

export default function PortfolioScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(portfolioProjects[0])

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Logo />
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Portfolio Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Business Portfolio</h1>
              <p className="text-muted-foreground">Showcase your projects and attract the right investors</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Your Projects</CardTitle>
                    <CardDescription>Select a project to view detailed portfolio information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {portfolioProjects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedProject.id === project.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{project.name}</h3>
                            <Badge
                              variant={
                                project.stage === "MVP"
                                  ? "default"
                                  : project.stage === "Prototype"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {project.stage}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{project.category}</span>
                            <span className="font-medium">{project.valuation} valuation</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Selected Project Details */}
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="highlights">Highlights</TabsTrigger>
                    <TabsTrigger value="financials">Financials</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{selectedProject.name}</CardTitle>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                        <CardDescription>{selectedProject.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Project Details</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Category:</span>
                                <Badge variant="outline">{selectedProject.category}</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Stage:</span>
                                <Badge variant="secondary">{selectedProject.stage}</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Funding Raised:</span>
                                <span className="font-medium">{selectedProject.funding}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Valuation:</span>
                                <span className="font-medium">{selectedProject.valuation}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">Key Metrics</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Users:</span>
                                <span className="font-medium">{selectedProject.metrics.users}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Revenue:</span>
                                <span className="font-medium">{selectedProject.metrics.revenue}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Growth:</span>
                                <span className="font-medium text-green-600">{selectedProject.metrics.growth}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="metrics">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">User Growth</span>
                              </div>
                              <Badge variant="secondary">+45%</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Revenue Growth</span>
                              </div>
                              <Badge variant="secondary">+32%</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-purple-500" />
                                <span className="text-sm">Market Share</span>
                              </div>
                              <Badge variant="secondary">12%</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Traction Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Customer Acquisition</span>
                                <span>85%</span>
                              </div>
                              <Progress value={85} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Product-Market Fit</span>
                                <span>72%</span>
                              </div>
                              <Progress value={72} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Team Readiness</span>
                                <span>90%</span>
                              </div>
                              <Progress value={90} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="highlights">
                    <Card>
                      <CardHeader>
                        <CardTitle>Key Highlights</CardTitle>
                        <CardDescription>Major achievements and milestones</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedProject.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                              <p className="text-sm">{highlight}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="financials">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Financial Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Funding:</span>
                              <span className="font-medium">{selectedProject.funding}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Current Valuation:</span>
                              <span className="font-medium">{selectedProject.valuation}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Monthly Revenue:</span>
                              <span className="font-medium">{selectedProject.metrics.revenue}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Burn Rate:</span>
                              <span className="font-medium">$8K/month</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Funding History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-3 border rounded-lg">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">Seed Round</span>
                                <span className="text-sm text-muted-foreground">Mar 2024</span>
                              </div>
                              <p className="text-sm text-muted-foreground">$100K from Angel Investors</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">Pre-Seed</span>
                                <span className="text-sm text-muted-foreground">Jan 2024</span>
                              </div>
                              <p className="text-sm text-muted-foreground">$50K from Founders & Friends</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Investor Matches */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Investor Matches</CardTitle>
                    <CardDescription>Potential investors for your project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {investorMatches.map((investor, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{investor.name}</h4>
                            <Badge variant="secondary">{investor.matchScore}% match</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {investor.type} • {investor.focus}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {investor.investment} • {investor.portfolio}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Portfolio Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Projects</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Valuation</span>
                        <span className="font-medium">$8.5M</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Investor Views</span>
                        <span className="font-medium">1,247</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Match Score</span>
                        <Badge variant="secondary">88%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
