"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Target, Lightbulb, X, ArrowLeft, TrendingUp, DollarSign, Users, AlertTriangle, CheckCircle, TrendingUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AnalysisData {
  summary?: {
    overallScore: number
    investmentRecommendation: string
    keyHighlights: string[]
  }
  marketAnalysis?: {
    marketSize: string
    growthRate: string
    marketTrend: string
    targetAudience: string
    barriers: string[]
  }
  competitorAnalysis?: {
    directCompetitors: Array<{
      name: string
      marketShare: string
      strengths: string[]
      weaknesses: string[]
    }>
    competitiveAdvantage: string
    threats: string[]
  }
  financialProjection?: {
    revenueProjection: {
      year1: string
      year3: string
      year5: string
    }
    profitabilityTimeline: string
    fundingNeeded: string
    useOfFunds: string[]
  }
  riskAssessment?: {
    riskLevel: 'Low' | 'Medium' | 'High'
    majorRisks: Array<{
      risk: string
      impact: string
      mitigation: string
    }>
  }
  investmentMetrics?: {
    expectedROI: string
    timeToExit: string
    valuationMultiple: string
    comparableDeals: string
  }
  nextSteps?: string[]
  error?: string
}

interface Project {
  id: string
  title: string
  description: string
  price?: number | null
  tags: Array<{ tag: { name: string } }>
  inventor: {
    name: string
    profileImage?: string | null
  }
  images: Array<{ url: string; isPrimary: boolean }>
}

interface AnalysisPanelProps {
  isVisible: boolean
  isLoading: boolean
  analysisData: AnalysisData | null
  project: Project
  onClose: () => void
  onRetry: () => void
  cached?: boolean
}

export default function AnalysisPanel({
  isVisible,
  isLoading,
  analysisData,
  project,
  onClose,
  onRetry,
  cached = false
}: AnalysisPanelProps) {
  const [investDialogOpen, setInvestDialogOpen] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [investmentMessage, setInvestmentMessage] = useState("")
  const [isInvesting, setIsInvesting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInvestment = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid investment amount",
        variant: "destructive",
      })
      return
    }

    setIsInvesting(true)
    try {
      const response = await fetch('/api/investments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          amount: parseFloat(investmentAmount),
          message: investmentMessage.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Investment Successful!",
          description: `Successfully pitched investment for $${parseFloat(investmentAmount).toLocaleString()} in ${project.title}`,
        })
        setInvestDialogOpen(false)
        setInvestmentAmount("")
        setInvestmentMessage("")
        // Optionally redirect to investments page
        router.push('/investments')
      } else {
        toast({
          title: "Investment Failed",
          description: data.error || "Failed to create investment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Investment error:', error)
      toast({
        title: "Investment Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsInvesting(false)
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ 
          type: "spring",
          damping: 25,
          stiffness: 200,
          duration: 0.6
        }}
        className="fixed inset-0 z-50"
      >
        {/* Background Image - Same as project */}
        <div className="absolute inset-0">
          {project.images.length > 0 ? (
            <img
              src={project.images.find(img => img.isPrimary)?.url || project.images[0]?.url || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-8xl">📦</div>
            </div>
          )}
        </div>

        {/* Dark Overlay for Content Readability */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 text-white">
                <BarChart3 className="h-6 w-6" />
                <h1 className="text-xl font-semibold">Investment Analysis</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Project Info Strip - Overlay Style */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10">
                {project.images.length > 0 ? (
                  <img
                    src={project.images.find(img => img.isPrimary)?.url || project.images[0]?.url || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/60">
                    📦
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate text-white">{project.title}</h3>
                <p className="text-sm text-white/70">by {project.inventor.name}</p>
              </div>
              {project.price && (
                <div className="text-right">
                  <p className="text-sm text-white/70">Valuation</p>
                  <p className="font-semibold text-white">${project.price.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="absolute inset-0 pt-32 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-white border-t-transparent rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-white">
                {cached ? "Loading Cached Analysis" : "Wait for SwipeTank to generate analysis"}
              </h3>
              <p className="text-white/70 mb-1">
                {cached ? "Retrieving saved analysis..." : "Analyzing market conditions..."}
              </p>
              {!cached && (
                <p className="text-sm text-white/60">This may take a few moments</p>
              )}
            </div>
          ) : analysisData?.error ? (
            <div className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Analysis Failed</h3>
              <p className="text-white/70 mb-4">{analysisData.error}</p>
              <Button onClick={onRetry} className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30">
                <BarChart3 className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          ) : analysisData ? (
            <div className="p-6 space-y-6 pb-12">
              {/* Investment Summary - Hero Style */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-white" />
                  <h3 className="text-2xl font-bold text-white">Investment Summary</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-white/10 rounded-xl border border-white/20">
                    <p className="text-sm text-white/70 mb-2">Overall Score</p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-4xl font-bold text-white">
                        {analysisData.summary?.overallScore}
                      </span>
                      <span className="text-xl text-white/60">/10</span>
                    </div>
                  </div>
                  <div className="text-center p-6 bg-white/10 rounded-xl border border-white/20">
                    <p className="text-sm text-white/70 mb-2">Recommendation</p>
                    <Badge 
                      className={`text-sm px-4 py-2 ${
                        analysisData.summary?.investmentRecommendation?.includes('Strong') ? 'bg-green-500/80 text-white border-green-400/50' :
                        analysisData.summary?.investmentRecommendation?.includes('Buy') ? 'bg-blue-500/80 text-white border-blue-400/50' :
                        analysisData.summary?.investmentRecommendation?.includes('Hold') ? 'bg-yellow-500/80 text-white border-yellow-400/50' :
                        'bg-red-500/80 text-white border-red-400/50'
                      }`}
                    >
                      {analysisData.summary?.investmentRecommendation}
                    </Badge>
                  </div>
                  <div className="p-6 bg-white/10 rounded-xl border border-white/20">
                    <p className="text-sm text-white/70 mb-3">Key Highlights</p>
                    <div className="space-y-2">
                      {analysisData.summary?.keyHighlights?.slice(0, 2).map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-white/90 leading-relaxed">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Investment Action Button */}
                <div className="flex justify-center pt-6 mt-5">
                  <Dialog open={investDialogOpen} onOpenChange={setInvestDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <TrendingUpIcon className="w-5 h-5 mr-2" />
                        Invest in This Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Invest in {project.title}</DialogTitle>
                        <DialogDescription>
                          Enter your investment amount and optional message to the founder.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Investment Amount ($)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="10000"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                            min="1"
                            step="1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message to Founder (Optional)</Label>
                          <Textarea
                            id="message"
                            placeholder="I'm interested in investing because..."
                            value={investmentMessage}
                            onChange={(e) => setInvestmentMessage(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            {project.images.length > 0 ? (
                              <img
                                src={project.images.find(img => img.isPrimary)?.url || project.images[0]?.url}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center text-xs">
                                📦
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{project.title}</p>
                            <p className="text-xs text-muted-foreground">by {project.inventor.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setInvestDialogOpen(false)}
                          disabled={isInvesting}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleInvestment}
                          disabled={isInvesting || !investmentAmount}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        >
                          {isInvesting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Investing...
                            </>
                          ) : (
                            <>
                              <TrendingUpIcon className="w-4 h-4 mr-2" />
                              Invest ${investmentAmount ? parseFloat(investmentAmount).toLocaleString() : '0'}
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Market Analysis */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Market Analysis</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm font-medium text-white/70 mb-1">Market Size</p>
                    <p className="text-lg font-semibold text-white">{analysisData.marketAnalysis?.marketSize}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm font-medium text-white/70 mb-1">Growth Rate</p>
                    <p className="text-lg font-semibold text-green-400">{analysisData.marketAnalysis?.growthRate}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-sm font-medium text-white/70 mb-2">Target Audience</p>
                  <p className="text-sm leading-relaxed text-white/90">{analysisData.marketAnalysis?.targetAudience}</p>
                </div>
              </div>

              {/* Financial Projections */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Financial Projections</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/70 mb-1">Year 1</p>
                    <p className="font-semibold text-white">{analysisData.financialProjection?.revenueProjection?.year1}</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/70 mb-1">Year 3</p>
                    <p className="font-semibold text-white">{analysisData.financialProjection?.revenueProjection?.year3}</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/70 mb-1">Year 5</p>
                    <p className="font-semibold text-white">{analysisData.financialProjection?.revenueProjection?.year5}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm font-medium text-white/70 mb-1">Expected ROI</p>
                    <p className="text-lg font-semibold text-green-400">{analysisData.investmentMetrics?.expectedROI}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm font-medium text-white/70 mb-1">Time to Exit</p>
                    <p className="text-lg font-semibold text-white">{analysisData.investmentMetrics?.timeToExit}</p>
                  </div>
                </div>
              </div>

              {/* Competitive Analysis */}
              {analysisData.competitorAnalysis?.directCompetitors && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">Competitive Landscape</h3>
                  </div>
                  
                  <div className="space-y-4 mb-4">
                    {analysisData.competitorAnalysis.directCompetitors.slice(0, 3).map((competitor, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-xl">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-white">{competitor.name}</h4>
                          <Badge variant="outline" className="border-white/30 text-white/70">
                            {competitor.marketShare}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-green-400 mb-2">Strengths:</p>
                            <ul className="space-y-1">
                              {competitor.strengths?.slice(0, 2).map((strength, i) => (
                                <li key={i} className="text-white/70">• {strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-red-400 mb-2">Weaknesses:</p>
                            <ul className="space-y-1">
                              {competitor.weaknesses?.slice(0, 2).map((weakness, i) => (
                                <li key={i} className="text-white/70">• {weakness}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
                    <p className="font-medium text-blue-200 mb-2">Competitive Advantage</p>
                    <p className="text-sm text-blue-100">{analysisData.competitorAnalysis?.competitiveAdvantage}</p>
                  </div>
                </div>
              )}

              {/* Risk Assessment */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Risk Assessment</h3>
                  <Badge 
                    className={`ml-2 ${
                      analysisData.riskAssessment?.riskLevel === 'Low' ? 'bg-green-500/80 text-white border-green-400/50' :
                      analysisData.riskAssessment?.riskLevel === 'Medium' ? 'bg-yellow-500/80 text-white border-yellow-400/50' :
                      'bg-red-500/80 text-white border-red-400/50'
                    }`}
                  >
                    {analysisData.riskAssessment?.riskLevel} Risk
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {analysisData.riskAssessment?.majorRisks?.slice(0, 3).map((risk, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Badge 
                          className={`mt-0.5 ${
                            risk.impact === 'High' ? 'bg-red-500/80 text-white' :
                            risk.impact === 'Medium' ? 'bg-yellow-500/80 text-white' :
                            'bg-gray-500/80 text-white'
                          }`}
                        >
                          {risk.impact}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium mb-2 text-white">{risk.risk}</p>
                          <p className="text-sm text-white/70">
                            <span className="font-medium text-white/90">Mitigation:</span> {risk.mitigation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Recommended Next Steps</h3>
                </div>
                
                <div className="space-y-3">
                  {analysisData.nextSteps?.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm leading-relaxed flex-1 text-white/90">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <BarChart3 className="w-16 h-16 text-white/60 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">No Analysis Data</h3>
              <p className="text-white/70 mb-4">Unable to load analysis data</p>
              <Button onClick={onRetry} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}