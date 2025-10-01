"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, Sparkles, TrendingUp, Users, DollarSign, AlertTriangle, CheckCircle, RefreshCw, BookOpen, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Project {
  id: string
  title: string
  description: string
  price: number | null
  status: string
  createdAt: string
  updatedAt: string
  inventor: {
    id: string
    name: string
    email: string
    profileImage: string | null
  }
  images: Array<{
    id: string
    url: string
    isPrimary: boolean
    order: number
  }>
  tags: Array<{
    tag: {
      id: string
      name: string
      color: string | null
    }
  }>
  _count: {
    likes: number
    investments: number
  }
}

interface AnalysisPanelProps {
  isVisible: boolean
  isLoading: boolean
  analysisData: any
  project: Project | null
  onClose: () => void
  onRetry: () => Promise<void>
  cached: boolean
}

export function AnalysisPanel({ 
  isVisible, 
  isLoading, 
  analysisData, 
  project, 
  onClose, 
  onRetry, 
  cached 
}: AnalysisPanelProps) {
  if (!project) return null

  const projectImage = project.images.find(img => img.isPrimary)?.url || project.images[0]?.url

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full hover:bg-gray-100 w-8 h-8"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      AI Analysis
                    </h1>
                    <p className="text-sm text-gray-600">{project.title}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {cached && (
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Cached
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    disabled={isLoading}
                    className="rounded-lg"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="h-full overflow-y-auto pb-20">
              {isLoading && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-base text-gray-600">Analyzing project...</p>
                    <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
                  </div>
                </div>
              )}

              {analysisData?.error && (
                <div className="p-6">
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-sm font-medium text-red-900">Analysis Failed</p>
                          <p className="text-xs text-red-700 mt-1">{analysisData.error}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {analysisData && !analysisData.error && (
                <div className="p-6 space-y-8">
                  {/* Project Header */}
                  <div className="flex items-start gap-6">
                    {projectImage && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={projectImage}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {project.title}
                      </h2>
                      <div className="flex items-center gap-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(analysisData.overallScore || 75)}`}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          <span className={getScoreColor(analysisData.overallScore || 75)}>
                            {analysisData.overallScore || 75}% Overall Score
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-gray-700">Market Potential</h3>
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-gray-900">
                            {analysisData.marketPotential || 82}%
                          </div>
                          <Progress value={analysisData.marketPotential || 82} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-gray-700">Technical Feasibility</h3>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-gray-900">
                            {analysisData.technicalFeasibility || 78}%
                          </div>
                          <Progress value={analysisData.technicalFeasibility || 78} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-gray-700">Competitive Edge</h3>
                          <Users className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-gray-900">
                            {analysisData.competitiveAdvantage || 71}%
                          </div>
                          <Progress value={analysisData.competitiveAdvantage || 71} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* SWOT Analysis */}
                  {(analysisData.strengths || analysisData.weaknesses || analysisData.opportunities || analysisData.threats) && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">SWOT Analysis</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {analysisData.strengths && (
                          <Card className="border-green-200 bg-green-50">
                            <CardHeader>
                              <CardTitle className="text-green-800 text-lg">Strengths</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {analysisData.strengths.map((strength: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {analysisData.weaknesses && (
                          <Card className="border-red-200 bg-red-50">
                            <CardHeader>
                              <CardTitle className="text-red-800 text-lg">Weaknesses</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {analysisData.weaknesses.map((weakness: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {analysisData.opportunities && (
                          <Card className="border-blue-200 bg-blue-50">
                            <CardHeader>
                              <CardTitle className="text-blue-800 text-lg">Opportunities</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {analysisData.opportunities.map((opportunity: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                                    <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    {opportunity}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {analysisData.threats && (
                          <Card className="border-yellow-200 bg-yellow-50">
                            <CardHeader>
                              <CardTitle className="text-yellow-800 text-lg">Threats</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {analysisData.threats.map((threat: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-yellow-700">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    {threat}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Market Analysis */}
                  {(analysisData.marketSize || analysisData.competitorAnalysis) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <DollarSign className="h-5 w-5" />
                          Market Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analysisData.marketSize && (
                            <div>
                              <h4 className="text-base font-medium text-gray-900 mb-2">Market Size</h4>
                              <p className="text-sm text-gray-700 leading-relaxed">{analysisData.marketSize}</p>
                            </div>
                          )}
                          {analysisData.competitorAnalysis && (
                            <div>
                              <h4 className="text-base font-medium text-gray-900 mb-2">Competitive Landscape</h4>
                              <p className="text-sm text-gray-700 leading-relaxed">{analysisData.competitorAnalysis}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recommendations */}
                  {(analysisData.recommendedActions || analysisData.riskAssessment || analysisData.fundingRecommendation) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <BookOpen className="h-5 w-5" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analysisData.recommendedActions && (
                            <div>
                              <h4 className="text-base font-medium text-gray-900 mb-3">Recommended Actions</h4>
                              <ul className="space-y-2">
                                {analysisData.recommendedActions.map((action: string, index: number) => (
                                  <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {analysisData.riskAssessment && (
                            <div>
                              <h4 className="text-base font-medium text-gray-900 mb-2">Risk Assessment</h4>
                              <p className="text-sm text-gray-700 leading-relaxed">{analysisData.riskAssessment}</p>
                            </div>
                          )}

                          {analysisData.fundingRecommendation && (
                            <div>
                              <h4 className="text-base font-medium text-gray-900 mb-2">Funding Recommendation</h4>
                              <p className="text-sm text-gray-700 leading-relaxed">{analysisData.fundingRecommendation}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}