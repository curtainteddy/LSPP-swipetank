"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, Users, DollarSign, BarChart3, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AppLayout } from "@/components/layout/app-layout-airbnb"
import { motion } from "framer-motion"

const analyticsData = {
  overview: {
    totalUsers: 125000,
    monthlyGrowth: 15.2,
    revenue: 89000,
    conversionRate: 3.4,
  },
  competitors: [
    {
      name: "EcoLife App",
      users: "200K+",
      rating: 4.2,
      marketShare: 25,
      strengths: ["Strong brand", "Large user base"],
      weaknesses: ["Limited features", "Poor UX"],
    },
    {
      name: "GreenTracker",
      users: "150K+",
      rating: 4.0,
      marketShare: 18,
      strengths: ["Good analytics", "Corporate partnerships"],
      weaknesses: ["High pricing", "Complex onboarding"],
    },
    {
      name: "CarbonWatch",
      users: "80K+",
      rating: 3.8,
      marketShare: 12,
      strengths: ["Simple interface", "Fast performance"],
      weaknesses: ["Limited data sources", "No social features"],
    },
  ],
  marketGaps: [
    {
      opportunity: "AI-Powered Recommendations",
      impact: "High",
      difficulty: "Medium",
      description: "Personalized sustainability recommendations based on user behavior",
    },
    {
      opportunity: "Corporate Integration",
      impact: "High",
      difficulty: "High",
      description: "B2B solutions for companies to track employee carbon footprints",
    },
    {
      opportunity: "Gamification Features",
      impact: "Medium",
      difficulty: "Low",
      description: "Social challenges and rewards to increase user engagement",
    },
  ],
}

export default function AnalyticsScreen() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("users")

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-500">+{change}%</span> from last month
        </p>
      </CardContent>
    </Card>
  )

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights for your app and market analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="market">Market Analysis</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value="125K" change={15.2} icon={Users} color="text-blue-500" />
                <StatCard title="Monthly Revenue" value="$89K" change={23.1} icon={DollarSign} color="text-green-500" />
                <StatCard title="Conversion Rate" value="3.4%" change={8.7} icon={TrendingUp} color="text-purple-500" />
                <StatCard title="App Rating" value="4.6" change={2.3} icon={BarChart3} color="text-orange-500" />
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>Monthly active users over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">User Growth Chart</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Revenue sources and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Revenue Chart</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>App Performance</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">User Retention (30d)</span>
                        <span className="text-sm text-muted-foreground">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Session Duration</span>
                        <span className="text-sm text-muted-foreground">12.5 min</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Feature Adoption</span>
                        <span className="text-sm text-muted-foreground">84%</span>
                      </div>
                      <Progress value={84} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="competitors">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {analyticsData.competitors.map((competitor, index) => (
                  <Card key={competitor.name} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{competitor.name}</CardTitle>
                        <Badge variant="outline">{competitor.marketShare}% market share</Badge>
                      </div>
                      <CardDescription>
                        {competitor.users} users • {competitor.rating}★ rating
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                        <ul className="text-sm space-y-1">
                          {competitor.strengths.map((strength, i) => (
                            <li key={i} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Weaknesses</h4>
                        <ul className="text-sm space-y-1">
                          {competitor.weaknesses.map((weakness, i) => (
                            <li key={i} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Competitive Positioning</CardTitle>
                  <CardDescription>How you stack up against the competition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Competitive Analysis Chart</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="market">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Market Opportunities</CardTitle>
                  <CardDescription>Identified gaps and opportunities in the market</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.marketGaps.map((gap, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{gap.opportunity}</h3>
                          <div className="flex gap-2">
                            <Badge
                              variant={
                                gap.impact === "High" ? "default" : gap.impact === "Medium" ? "secondary" : "outline"
                              }
                            >
                              {gap.impact} Impact
                            </Badge>
                            <Badge
                              variant={
                                gap.difficulty === "Low"
                                  ? "default"
                                  : gap.difficulty === "Medium"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {gap.difficulty} Difficulty
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{gap.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Size</CardTitle>
                    <CardDescription>Total addressable market analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">TAM (Total Addressable Market)</span>
                        <span className="font-bold">$12.5B</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">SAM (Serviceable Addressable Market)</span>
                        <span className="font-bold">$2.8B</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">SOM (Serviceable Obtainable Market)</span>
                        <span className="font-bold">$450M</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Growth Projections</CardTitle>
                    <CardDescription>Market growth forecasts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">2024 Growth Rate</span>
                        <span className="font-bold text-green-600">+18.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">5-Year CAGR</span>
                        <span className="font-bold text-green-600">+22.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Market Maturity</span>
                        <Badge variant="secondary">Early Growth</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="insights">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Insights</CardTitle>
                  <CardDescription>Automated analysis and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      🚀 Growth Opportunity Detected
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Your user engagement peaks on weekends. Consider launching weekend-specific features or campaigns
                      to capitalize on this trend.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">💡 Feature Recommendation</h3>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Users who engage with the carbon tracking feature have 40% higher retention. Consider making this
                      feature more prominent in your onboarding flow.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <h3 className="font-medium text-orange-900 dark:text-orange-100 mb-2">⚠️ Churn Risk Alert</h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      15% of users haven't engaged in the last 7 days. Consider implementing a re-engagement campaign
                      targeting these users.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">📊 Market Trend</h3>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      Sustainability apps are seeing increased adoption in the 25-34 age group. This demographic shows
                      60% higher lifetime value.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Predictive Analytics</CardTitle>
                  <CardDescription>AI forecasts for your app's future performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Next 30 Days Forecast</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Expected New Users</span>
                          <span className="font-medium">+12,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Projected Revenue</span>
                          <span className="font-medium">$95,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Churn Rate</span>
                          <span className="font-medium">4.2%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Confidence Levels</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">User Growth</span>
                            <span className="text-sm">87%</span>
                          </div>
                          <Progress value={87} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Revenue Forecast</span>
                            <span className="text-sm">92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Churn Prediction</span>
                            <span className="text-sm">78%</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
