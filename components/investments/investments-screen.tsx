"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, DollarSign, Calendar, FileText, MessageCircle, MoreVertical, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppLayout } from "@/components/layout/app-layout"
import { useUser } from "@/contexts/user-context"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Investment {
  id: string
  projectName: string
  founderName: string
  founderAvatar: string
  industry: string
  investmentAmount: number
  investmentDate: string
  currentValuation: number
  initialValuation: number
  equityStake: number
  status: "active" | "exited" | "at-risk"
  lastUpdate: string
  notes: string
  performanceData: { month: string; valuation: number }[]
}

const investments: Investment[] = [
  {
    id: "inv-1",
    projectName: "EcoTrack Mobile",
    founderName: "Sarah Chen",
    founderAvatar: "/placeholder.svg?height=40&width=40",
    industry: "Sustainability",
    investmentAmount: 100000,
    investmentDate: "2024-01-15",
    currentValuation: 2500000,
    initialValuation: 2000000,
    equityStake: 5,
    status: "active",
    lastUpdate: "2 days ago",
    notes: "Strong growth trajectory, expanding to new markets",
    performanceData: [
      { month: "Jan", valuation: 2000000 },
      { month: "Feb", valuation: 2100000 },
      { month: "Mar", valuation: 2200000 },
      { month: "Apr", valuation: 2300000 },
      { month: "May", valuation: 2400000 },
      { month: "Jun", valuation: 2500000 },
    ],
  },
  {
    id: "inv-2",
    projectName: "FinTech Dashboard",
    founderName: "Marcus Rodriguez",
    founderAvatar: "/placeholder.svg?height=40&width=40",
    industry: "Finance",
    investmentAmount: 150000,
    investmentDate: "2023-11-20",
    currentValuation: 1800000,
    initialValuation: 1500000,
    equityStake: 10,
    status: "active",
    lastUpdate: "1 week ago",
    notes: "Solid performance, preparing for Series A",
    performanceData: [
      { month: "Jan", valuation: 1500000 },
      { month: "Feb", valuation: 1550000 },
      { month: "Mar", valuation: 1600000 },
      { month: "Apr", valuation: 1650000 },
      { month: "May", valuation: 1750000 },
      { month: "Jun", valuation: 1800000 },
    ],
  },
  {
    id: "inv-3",
    projectName: "HealthCare AI",
    founderName: "Dr. Emily Watson",
    founderAvatar: "/placeholder.svg?height=40&width=40",
    industry: "Healthcare",
    investmentAmount: 200000,
    investmentDate: "2023-08-10",
    currentValuation: 5200000,
    initialValuation: 4000000,
    equityStake: 5,
    status: "active",
    lastUpdate: "3 days ago",
    notes: "Excellent clinical trial results, FDA approval pending",
    performanceData: [
      { month: "Jan", valuation: 4000000 },
      { month: "Feb", valuation: 4200000 },
      { month: "Mar", valuation: 4400000 },
      { month: "Apr", valuation: 4600000 },
      { month: "May", valuation: 4900000 },
      { month: "Jun", valuation: 5200000 },
    ],
  },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function InvestmentsScreen() {
  const router = useRouter()
  const { userRole } = useUser()
  const [selectedPeriod, setSelectedPeriod] = useState("6m")
  const [sortBy, setSortBy] = useState("performance")

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0)
  const currentPortfolioValue = investments.reduce(
    (sum, inv) => sum + (inv.currentValuation * inv.equityStake) / 100,
    0,
  )
  const totalROI = ((currentPortfolioValue - totalInvested) / totalInvested) * 100

  const industryDistribution = investments.reduce(
    (acc, inv) => {
      acc[inv.industry] = (acc[inv.industry] || 0) + inv.investmentAmount
      return acc
    },
    {} as Record<string, number>,
  )

  const pieData = Object.entries(industryDistribution).map(([industry, amount]) => ({
    name: industry,
    value: amount,
  }))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "exited":
        return "bg-blue-500"
      case "at-risk":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getROI = (investment: Investment) => {
    const currentValue = (investment.currentValuation * investment.equityStake) / 100
    return ((currentValue - investment.investmentAmount) / investment.investmentAmount) * 100
  }

  return (
    <AppLayout userRole={userRole}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Investments</h1>
            <p className="text-muted-foreground">Track and manage your investment portfolio</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32 border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(totalInvested / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground">{investments.length} active investments</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(currentPortfolioValue / 1000).toFixed(0)}K</div>
                <p className="text-xs text-green-600">+{totalROI.toFixed(1)}% total return</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">HealthCare AI</div>
                <p className="text-xs text-green-600">+{getROI(investments[2]).toFixed(1)}% ROI</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Holding Period</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.5</div>
                <p className="text-xs text-muted-foreground">months average</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Portfolio Performance Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Track your investments over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={investments[0].performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${(Number(value) / 1000000).toFixed(1)}M`, "Valuation"]} />
                      <Line type="monotone" dataKey="valuation" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Industry Distribution */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Industry Distribution</CardTitle>
                <CardDescription>Investment allocation by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, "Investment"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Investment Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Investment Details</CardTitle>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="date">Investment Date</SelectItem>
                  <SelectItem value="amount">Investment Amount</SelectItem>
                  <SelectItem value="valuation">Current Valuation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments.map((investment, index) => {
                const roi = getROI(investment)
                const currentValue = (investment.currentValuation * investment.equityStake) / 100

                return (
                  <motion.div
                    key={investment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={investment.founderAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{investment.founderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{investment.projectName}</h3>
                          <p className="text-sm text-muted-foreground">{investment.founderName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {investment.industry}
                            </Badge>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(investment.status)}`}></div>
                            <span className="text-xs text-muted-foreground capitalize">{investment.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Invested</div>
                            <div className="font-semibold">${(investment.investmentAmount / 1000).toFixed(0)}K</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Current Value</div>
                            <div className="font-semibold">${(currentValue / 1000).toFixed(0)}K</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">ROI</div>
                            <div className={`font-semibold ${roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {roi >= 0 ? "+" : ""}
                              {roi.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Equity</div>
                            <div className="font-semibold">{investment.equityStake}%</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/messages?project=${investment.id}`)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/projects/${investment.id}`)}>
                                View Project Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                View Documents
                              </DropdownMenuItem>
                              <DropdownMenuItem>Add Note</DropdownMenuItem>
                              <DropdownMenuItem>Set Reminder</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>

                    {investment.notes && (
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">{investment.notes}</p>
                        <p className="text-xs text-muted-foreground mt-1">Last updated: {investment.lastUpdate}</p>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
