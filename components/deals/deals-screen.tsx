"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, DollarSign, Calendar, MessageCircle, Eye, TrendingUp, Building, Users } from "lucide-react"
import { useUser } from "@/contexts/user-context"

interface Deal {
  id: string
  projectName: string
  company: string
  founder: string
  avatar: string
  stage: "new-leads" | "contact-made" | "due-diligence" | "negotiation" | "offer-extended" | "invested" | "archived"
  industry: string
  fundingAmount: string
  lastActivity: string
  description: string
  metrics: {
    users: string
    revenue: string
    growth: string
  }
}

const mockDeals: Deal[] = [
  {
    id: "1",
    projectName: "EcoTrack",
    company: "GreenTech Solutions",
    founder: "Sarah Chen",
    avatar: "/placeholder.svg",
    stage: "new-leads",
    industry: "CleanTech",
    fundingAmount: "$2M",
    lastActivity: "2 hours ago",
    description: "AI-powered carbon footprint tracking for enterprises",
    metrics: { users: "50K", revenue: "$120K", growth: "+45%" },
  },
  {
    id: "2",
    projectName: "HealthAI",
    company: "MedTech Innovations",
    founder: "Dr. James Wilson",
    avatar: "/placeholder.svg",
    stage: "contact-made",
    industry: "HealthTech",
    fundingAmount: "$5M",
    lastActivity: "1 day ago",
    description: "AI diagnostic tool for early disease detection",
    metrics: { users: "25K", revenue: "$300K", growth: "+78%" },
  },
  {
    id: "3",
    projectName: "FinanceBot",
    company: "AutoFinance",
    founder: "Michael Rodriguez",
    avatar: "/placeholder.svg",
    stage: "due-diligence",
    industry: "FinTech",
    fundingAmount: "$3M",
    lastActivity: "3 days ago",
    description: "Automated personal finance management platform",
    metrics: { users: "100K", revenue: "$500K", growth: "+92%" },
  },
  {
    id: "4",
    projectName: "EduPlatform",
    company: "LearnTech",
    founder: "Emily Johnson",
    avatar: "/placeholder.svg",
    stage: "negotiation",
    industry: "EdTech",
    fundingAmount: "$1.5M",
    lastActivity: "5 days ago",
    description: "Personalized learning platform with AI tutoring",
    metrics: { users: "75K", revenue: "$200K", growth: "+65%" },
  },
  {
    id: "5",
    projectName: "SmartLogistics",
    company: "LogiTech Pro",
    founder: "David Kim",
    avatar: "/placeholder.svg",
    stage: "offer-extended",
    industry: "Logistics",
    fundingAmount: "$4M",
    lastActivity: "1 week ago",
    description: "AI-optimized supply chain management system",
    metrics: { users: "30K", revenue: "$800K", growth: "+120%" },
  },
  {
    id: "6",
    projectName: "FoodieApp",
    company: "Culinary Connect",
    founder: "Lisa Park",
    avatar: "/placeholder.svg",
    stage: "invested",
    industry: "Food & Beverage",
    fundingAmount: "$2.5M",
    lastActivity: "2 weeks ago",
    description: "Social platform connecting food enthusiasts and chefs",
    metrics: { users: "200K", revenue: "$150K", growth: "+35%" },
  },
]

const stageConfig = {
  "new-leads": { title: "New Leads", color: "bg-blue-500", count: 0 },
  "contact-made": { title: "Contact Made", color: "bg-yellow-500", count: 0 },
  "due-diligence": { title: "Due Diligence", color: "bg-orange-500", count: 0 },
  negotiation: { title: "Negotiation", color: "bg-purple-500", count: 0 },
  "offer-extended": { title: "Offer Extended", color: "bg-pink-500", count: 0 },
  invested: { title: "Invested", color: "bg-green-500", count: 0 },
  archived: { title: "Archived", color: "bg-gray-500", count: 0 },
}

export function DealsScreen() {
  const { userType } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [deals, setDeals] = useState(mockDeals)

  // Count deals by stage
  const stageCounts = deals.reduce(
    (acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.founder.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = selectedIndustry === "all" || deal.industry === selectedIndustry
    return matchesSearch && matchesIndustry
  })

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData("text/plain", dealId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault()
    const dealId = e.dataTransfer.getData("text/plain")

    setDeals((prevDeals) =>
      prevDeals.map((deal) => (deal.id === dealId ? { ...deal, stage: newStage as Deal["stage"] } : deal)),
    )
  }

  if (userType !== "investor") {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Deal Flow - Investor Only</h3>
              <p className="text-muted-foreground">Switch to Investor mode to access deal flow management.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Deal Flow Management</h1>
          <p className="text-muted-foreground">Track and manage your investment pipeline</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search deals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="CleanTech">CleanTech</SelectItem>
                  <SelectItem value="HealthTech">HealthTech</SelectItem>
                  <SelectItem value="FinTech">FinTech</SelectItem>
                  <SelectItem value="EdTech">EdTech</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                  <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 overflow-x-auto">
          {Object.entries(stageConfig).map(([stageKey, config]) => (
            <div
              key={stageKey}
              className="min-w-80 lg:min-w-0"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stageKey)}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {stageCounts[stageKey] || 0}
                    </Badge>
                  </div>
                  <div className={`h-1 rounded-full ${config.color}`} />
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredDeals
                    .filter((deal) => deal.stage === stageKey)
                    .map((deal) => (
                      <motion.div
                        key={deal.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className="cursor-move hover:shadow-md transition-shadow"
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {deal.founder
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">{deal.projectName}</h4>
                                <p className="text-xs text-muted-foreground truncate">{deal.company}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {deal.industry}
                              </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{deal.description}</p>

                            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                              <div className="text-center">
                                <Users className="h-3 w-3 mx-auto mb-1" />
                                <span className="font-medium">{deal.metrics.users}</span>
                              </div>
                              <div className="text-center">
                                <DollarSign className="h-3 w-3 mx-auto mb-1" />
                                <span className="font-medium">{deal.metrics.revenue}</span>
                              </div>
                              <div className="text-center">
                                <TrendingUp className="h-3 w-3 mx-auto mb-1" />
                                <span className="font-medium text-green-600">{deal.metrics.growth}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-primary">{deal.fundingAmount}</span>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <MessageCircle className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{deal.lastActivity}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
