"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Heart, X, Filter, MessageCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { AppLayout } from "@/components/layout/app-layout"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"

const projects = [
  {
    id: 1,
    name: "EcoTrack Mobile",
    tagline: "Sustainable living app for carbon footprint tracking",
    description:
      "EcoTrack helps users monitor and reduce their environmental impact through personalized insights and actionable recommendations.",
    industry: "Sustainability",
    fundingGoal: "$250K - $500K",
    investmentType: "Seed",
    teamSize: 5,
    founder: {
      name: "Sarah Chen",
      title: "CEO & Founder",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    coverImage: "/placeholder.svg?height=400&width=600",
    tags: ["Mobile App", "AI", "Sustainability", "B2C"],
    metrics: {
      users: "10K+",
      revenue: "$50K MRR",
      growth: "+25% MoM",
    },
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: 2,
    name: "FinTech Dashboard",
    tagline: "AI-powered personal finance management",
    description:
      "Revolutionary fintech platform that uses AI to provide personalized financial insights and automated investment strategies.",
    industry: "Finance",
    fundingGoal: "$500K - $1M",
    investmentType: "Series A",
    teamSize: 8,
    founder: {
      name: "Marcus Rodriguez",
      title: "CTO & Co-founder",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    coverImage: "/placeholder.svg?height=400&width=600",
    tags: ["FinTech", "AI", "SaaS", "B2C"],
    metrics: {
      users: "25K+",
      revenue: "$120K MRR",
      growth: "+40% MoM",
    },
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    name: "HealthCare AI",
    tagline: "Medical diagnosis assistance platform",
    description:
      "Advanced AI platform that assists healthcare professionals with accurate diagnosis and treatment recommendations.",
    industry: "Healthcare",
    fundingGoal: "$1M - $5M",
    investmentType: "Series A",
    teamSize: 12,
    founder: {
      name: "Dr. Emily Watson",
      title: "Chief Medical Officer",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    coverImage: "/placeholder.svg?height=400&width=600",
    tags: ["HealthTech", "AI", "B2B", "Medical"],
    metrics: {
      users: "500+",
      revenue: "$200K MRR",
      growth: "+60% MoM",
    },
    gradient: "from-purple-500 to-pink-500",
  },
]

export default function BrowseScreen() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filters, setFilters] = useState({
    industry: "all",
    investmentType: "all",
    fundingRange: [0, 10000000],
    teamSize: [1, 50],
  })
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const currentProject = projects[currentIndex]

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100

    if (info.offset.x > threshold) {
      handleSwipeRight()
    } else if (info.offset.x < -threshold) {
      handleSwipeLeft()
    } else {
      x.set(0)
    }
  }

  const handleSwipeRight = () => {
    setSwipeDirection("right")
    x.set(300)

    // Send interest message
    setTimeout(() => {
      // Simulate sending message
      console.log(`Sent interest message to ${currentProject.founder.name}`)
      nextProject()
    }, 300)
  }

  const handleSwipeLeft = () => {
    setSwipeDirection("left")
    x.set(-300)

    setTimeout(() => {
      nextProject()
    }, 300)
  }

  const nextProject = () => {
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length)
      x.set(0)
      setSwipeDirection(null)
    }, 100)
  }

  const resetFilters = () => {
    setFilters({
      industry: "all",
      investmentType: "all",
      fundingRange: [0, 10000000],
      teamSize: [1, 50],
    })
  }

  if (!currentProject) {
    return (
      <AppLayout userRole="investor">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No more projects</h2>
            <p className="text-muted-foreground mb-6">You've reviewed all available projects</p>
            <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout userRole="investor">
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            <h1 className="text-2xl font-bold">Discover Projects</h1>
            <p className="text-muted-foreground">Swipe through innovative startups and connect with founders</p>
          </div>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Projects</SheetTitle>
                  <SheetDescription>Customize your project discovery experience</SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select
                      value={filters.industry}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="sustainability">Sustainability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Investment Type</Label>
                    <Select
                      value={filters.investmentType}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, investmentType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="series-a">Series A</SelectItem>
                        <SelectItem value="series-b">Series B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Funding Range</Label>
                    <Slider
                      value={filters.fundingRange}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, fundingRange: value }))}
                      max={10000000}
                      step={50000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${(filters.fundingRange[0] / 1000).toFixed(0)}K</span>
                      <span>${(filters.fundingRange[1] / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Team Size</Label>
                    <Slider
                      value={filters.teamSize}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, teamSize: value }))}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{filters.teamSize[0]} people</span>
                      <span>{filters.teamSize[1]} people</span>
                    </div>
                  </div>

                  <Button onClick={resetFilters} variant="outline" className="w-full bg-transparent">
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {currentIndex + 1} of {projects.length}
            </Badge>
          </div>
        </div>

        {/* Swipe Card */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="relative w-full max-w-md">
            <motion.div
              ref={cardRef}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              style={{ x, rotate, opacity }}
              className="relative"
              whileDrag={{ scale: 1.05 }}
            >
              <Card className="overflow-hidden shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentProject.gradient} opacity-20`}></div>
                  <img
                    src={currentProject.coverImage || "/placeholder.svg"}
                    alt={currentProject.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-black/50 text-white border-0">{currentProject.investmentType}</Badge>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{currentProject.name}</h2>
                    <p className="text-muted-foreground">{currentProject.tagline}</p>
                  </div>

                  <p className="text-sm leading-relaxed">{currentProject.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {currentProject.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center py-4 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-bold text-primary">{currentProject.metrics.users}</div>
                      <div className="text-xs text-muted-foreground">Users</div>
                    </div>
                    <div>
                      <div className="font-bold text-secondary">{currentProject.metrics.revenue}</div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                    <div>
                      <div className="font-bold text-accent">{currentProject.metrics.growth}</div>
                      <div className="text-xs text-muted-foreground">Growth</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentProject.founder.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{currentProject.founder.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{currentProject.founder.name}</div>
                        <div className="text-xs text-muted-foreground">{currentProject.founder.title}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{currentProject.fundingGoal}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {currentProject.teamSize} team members
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Swipe Indicators */}
            <motion.div
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold text-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: swipeDirection === "left" ? 1 : 0,
                scale: swipeDirection === "left" ? 1 : 0.8,
              }}
            >
              PASS
            </motion.div>
            <motion.div
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: swipeDirection === "right" ? 1 : 0,
                scale: swipeDirection === "right" ? 1 : 0.8,
              }}
            >
              INTERESTED
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-8 p-6">
          <Button
            onClick={handleSwipeLeft}
            size="lg"
            variant="outline"
            className="h-16 w-16 rounded-full border-2 border-destructive shadow-lg shadow-destructive/20 hover:bg-destructive/10 hover:scale-105 transition-all bg-transparent"
          >
            <X className="h-8 w-8 text-destructive" />
          </Button>

          <Button
            onClick={() => router.push(`/messages?project=${currentProject.id}`)}
            size="lg"
            variant="outline"
            className="h-16 w-16 rounded-full border-2 border-primary shadow-lg shadow-primary/20 hover:bg-primary/10 hover:scale-105 transition-all"
          >
            <MessageCircle className="h-8 w-8 text-primary" />
          </Button>

          <Button
            onClick={handleSwipeRight}
            size="lg"
            variant="outline"
            className="h-16 w-16 rounded-full border-2 border-green-500 shadow-lg shadow-green-500/20 hover:bg-green-500/10 hover:scale-105 transition-all bg-transparent"
          >
            <Heart className="h-8 w-8 text-green-500" />
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
