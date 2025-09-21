"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Target, Lightbulb, X, ArrowLeft, TrendingUp, DollarSign, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
}

export default function AnalysisPanel({
  isVisible,
  isLoading,
  analysisData,
  project,
  onClose,
  onRetry
}: AnalysisPanelProps) {
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
        className="fixed inset-0 z-50 bg-background"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Investment Analysis</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Project Info Strip */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                {project.images.length > 0 ? (
                  <img
                    src={project.images.find(img => img.isPrimary)?.url || project.images[0]?.url || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    📦
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{project.title}</h3>
                <p className="text-sm text-muted-foreground">by {project.inventor.name}</p>
              </div>
              {project.price && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Valuation</p>
                  <p className="font-semibold">${project.price.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Generating AI Analysis</h3>
              <p className="text-muted-foreground mb-1">Analyzing market conditions...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments</p>
            </div>
          ) : analysisData?.error ? (
            <div className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
              <p className="text-muted-foreground mb-4">{analysisData.error}</p>
              <Button onClick={onRetry} className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          ) : analysisData ? (
            <div className="p-6 space-y-6 pb-12">
              {/* Investment Summary */}
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Investment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-background/60 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-3xl font-bold text-primary">
                          {analysisData.summary?.overallScore}
                        </span>
                        <span className="text-lg text-muted-foreground">/10</span>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-background/60 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Recommendation</p>
                      <Badge 
                        className={`${
                          analysisData.summary?.investmentRecommendation?.includes('Strong') ? 'bg-green-500' :
                          analysisData.summary?.investmentRecommendation?.includes('Buy') ? 'bg-blue-500' :
                          analysisData.summary?.investmentRecommendation?.includes('Hold') ? 'bg-yellow-500' :
                          'bg-red-500'
                        } text-white`}
                      >
                        {analysisData.summary?.investmentRecommendation}
                      </Badge>
                    </div>
                    <div className="p-4 bg-background/60 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Key Highlights</p>
                      <div className="space-y-1">
                        {analysisData.summary?.keyHighlights?.slice(0, 2).map((highlight, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs leading-relaxed">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Market Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Market Size</p>
                      <p className="text-lg font-semibold">{analysisData.marketAnalysis?.marketSize}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Growth Rate</p>
                      <p className="text-lg font-semibold text-green-600">{analysisData.marketAnalysis?.growthRate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Target Audience</p>
                    <p className="text-sm leading-relaxed">{analysisData.marketAnalysis?.targetAudience}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Projections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial Projections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Year 1</p>
                      <p className="font-semibold">{analysisData.financialProjection?.revenueProjection?.year1}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Year 3</p>
                      <p className="font-semibold">{analysisData.financialProjection?.revenueProjection?.year3}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Year 5</p>
                      <p className="font-semibold">{analysisData.financialProjection?.revenueProjection?.year5}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Expected ROI</p>
                      <p className="text-lg font-semibold text-green-600">{analysisData.investmentMetrics?.expectedROI}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Time to Exit</p>
                      <p className="text-lg font-semibold">{analysisData.investmentMetrics?.timeToExit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Competitive Analysis */}
              {analysisData.competitorAnalysis?.directCompetitors && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Competitive Landscape
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {analysisData.competitorAnalysis.directCompetitors.slice(0, 3).map((competitor, idx) => (
                        <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{competitor.name}</h4>
                            <Badge variant="outline">{competitor.marketShare}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="font-medium text-green-600 mb-1">Strengths:</p>
                              <ul className="space-y-1">
                                {competitor.strengths?.slice(0, 2).map((strength, i) => (
                                  <li key={i} className="text-muted-foreground">• {strength}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-red-600 mb-1">Weaknesses:</p>
                              <ul className="space-y-1">
                                {competitor.weaknesses?.slice(0, 2).map((weakness, i) => (
                                  <li key={i} className="text-muted-foreground">• {weakness}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">Competitive Advantage</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">{analysisData.competitorAnalysis?.competitiveAdvantage}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Risk Assessment
                    <Badge 
                      className={`ml-2 ${
                        analysisData.riskAssessment?.riskLevel === 'Low' ? 'bg-green-500' :
                        analysisData.riskAssessment?.riskLevel === 'Medium' ? 'bg-yellow-500' :
                        'bg-red-500'
                      } text-white`}
                    >
                      {analysisData.riskAssessment?.riskLevel} Risk
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysisData.riskAssessment?.majorRisks?.slice(0, 3).map((risk, idx) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Badge 
                          variant={risk.impact === 'High' ? 'destructive' : risk.impact === 'Medium' ? 'default' : 'secondary'}
                          className="mt-0.5"
                        >
                          {risk.impact}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{risk.risk}</p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Mitigation:</span> {risk.mitigation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Recommended Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisData.nextSteps?.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm leading-relaxed flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Analysis Data</h3>
              <p className="text-muted-foreground mb-4">Unable to load analysis data</p>
              <Button onClick={onRetry} variant="outline">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}