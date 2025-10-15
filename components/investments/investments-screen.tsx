"use client"

import { useState, useEffect } from "react"
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
  projectId: string
  projectDescription: string
  projectImage: string
}

export default function InvestmentsScreen() {
  const router = useRouter()
  const { userRole } = useUser()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("6m")

  useEffect(() => {
    fetchInvestments()
  }, [])

  const fetchInvestments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/investments')
      if (response.ok) {
        const data = await response.json()
        setInvestments(data.investments)
      } else {
        console.error('Failed to fetch investments')
        // Fallback to empty array or show error message
        setInvestments([])
      }
    } catch (error) {
      console.error('Error fetching investments:', error)
      setInvestments([])
    } finally {
      setLoading(false)
    }
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => {
    const currentValue = (inv.currentValuation * inv.equityStake) / 100
    return sum + currentValue
  }, 0)
  const totalROI = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0

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

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your investments...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
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

        {investments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <TrendingUp className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No investments yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Start exploring projects and make your first investment
            </p>
            <Button onClick={() => router.push('/browse')}>
              Browse Projects
            </Button>
          </div>
        ) : (
          <>
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
                    <p className="text-xs text-muted-foreground">Total amount invested</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(totalCurrentValue / 1000).toFixed(0)}K</div>
                    <p className="text-xs text-muted-foreground">Current portfolio value</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${totalROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Return on investment</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{investments.length}</div>
                    <p className="text-xs text-muted-foreground">Total investments made</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Investment List */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Portfolio</CardTitle>
                <CardDescription>Your active investments and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments.map((investment, index) => (
                    <motion.div
                      key={investment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={investment.founderAvatar} alt={investment.founderName} />
                          <AvatarFallback>{investment.founderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{investment.projectName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Founded by {investment.founderName} • {investment.industry}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(investment.status)}`}></div>
                            <span className="text-xs text-muted-foreground capitalize">{investment.status}</span>
                            <Badge variant="outline" className="text-xs">
                              {investment.equityStake}% equity
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="font-semibold">${(investment.investmentAmount / 1000).toFixed(0)}K</div>
                        <div className={`text-sm ${getROI(investment) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {getROI(investment) >= 0 ? '+' : ''}{getROI(investment).toFixed(1)}% ROI
                        </div>
                        <div className="text-xs text-muted-foreground">{investment.lastUpdate}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/projects/${investment.projectId}`)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/projects/${investment.projectId}`)}>
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

                      {investment.notes && (
                        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">{investment.notes}</p>
                          <p className="text-xs text-muted-foreground mt-1">Last updated: {investment.lastUpdate}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  )
}
