"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, X, Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AppLayout } from "@/components/layout/app-layout"
import { motion, AnimatePresence } from "framer-motion"

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-commerce",
  "Entertainment",
  "Transportation",
  "Food & Beverage",
  "Real Estate",
  "Other",
]

const investmentTypes = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+", "Bridge", "Convertible Note"]

const fundingGoals = [
  "Under $50K",
  "$50K - $100K",
  "$100K - $250K",
  "$250K - $500K",
  "$500K - $1M",
  "$1M - $5M",
  "$5M - $10M",
  "Over $10M",
]

interface ProjectFormData {
  // Basic Info
  name: string
  tagline: string
  description: string
  industry: string
  website: string

  // Problem & Solution
  problemStatement: string
  solution: string
  targetMarket: string

  // Funding
  fundingGoal: string
  investmentType: string
  useOfFunds: string
  price: string

  // Team & Assets
  teamSize: string
  keyTeamMembers: string

  // Additional
  tags: string[]
  currentTag: string
}

interface EditProjectFormProps {
  projectId: string
}

export default function EditProjectForm({ projectId }: EditProjectFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const totalSteps = 4

  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    tagline: "",
    description: "",
    industry: "",
    website: "",
    problemStatement: "",
    solution: "",
    targetMarket: "",
    fundingGoal: "",
    investmentType: "",
    useOfFunds: "",
    price: "",
    teamSize: "",
    keyTeamMembers: "",
    tags: [],
    currentTag: "",
  })

  // Fetch project data on component mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch project")
        }
        
        const data = await response.json()
        const project = data.project
        
        // Parse the description to extract structured data
        const description = project.description || ""
        const lines = description.split("\\n\\n")
        
        // Initialize all variables
        let tagline = ""
        let mainDesc = ""
        let problemStatement = ""
        let solution = ""
        let targetMarket = ""
        let useOfFunds = ""
        let teamSize = ""
        let keyTeamMembers = ""
        
        // Process each line to extract structured data
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i] || ""
          
          if (line.startsWith("Problem: ")) {
            problemStatement = line.replace("Problem: ", "")
          } else if (line.startsWith("Solution: ")) {
            solution = line.replace("Solution: ", "")
          } else if (line.startsWith("Target Market: ")) {
            targetMarket = line.replace("Target Market: ", "")
          } else if (line.startsWith("Use of Funds: ")) {
            useOfFunds = line.replace("Use of Funds: ", "")
          } else if (line.startsWith("Team Size: ")) {
            teamSize = line.replace("Team Size: ", "")
          } else if (line.startsWith("Key Team Members: ")) {
            keyTeamMembers = line.replace("Key Team Members: ", "")
          } else if (i === 0) {
            // First line is tagline (if it doesn't start with structured keywords)
            tagline = line
          } else if (i === 1 && !line.startsWith("Problem:") && !line.startsWith("Solution:") && !line.startsWith("Target Market:")) {
            // Second line is main description if it's not a structured field
            mainDesc = line
          }
        }
        
        setFormData({
          name: project.title || "",
          tagline,
          description: mainDesc,
          industry: "", // You might want to add this to your database
          website: "", // You might want to add this to your database
          problemStatement,
          solution,
          targetMarket,
          fundingGoal: "", // You might want to add this to your database
          investmentType: "", // You might want to add this to your database
          useOfFunds,
          price: project.price ? project.price.toString() : "",
          teamSize,
          keyTeamMembers,
          tags: project.tags?.map((tag: any) => tag.tag.name) || [],
          currentTag: "",
        })
      } catch (error) {
        console.error("Error fetching project:", error)
        router.push("/projects")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [projectId, router])

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: "",
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Prepare project data
      const projectData = {
        title: formData.name,
        description: `${formData.tagline}\\n\\n${formData.description}\\n\\nProblem: ${formData.problemStatement}\\n\\nSolution: ${formData.solution}\\n\\nTarget Market: ${formData.targetMarket}\\n\\nUse of Funds: ${formData.useOfFunds}\\n\\nTeam Size: ${formData.teamSize}\\n\\nKey Team Members: ${formData.keyTeamMembers}`,
        price: formData.price ? parseFloat(formData.price) : null,
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error("Failed to update project")
      }

      router.push("/projects")
    } catch (error) {
      console.error("Error updating project:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.tagline && formData.description
      case 2:
        return formData.problemStatement && formData.solution && formData.targetMarket
      case 3:
        return formData.fundingGoal && formData.investmentType && formData.useOfFunds
      case 4:
        return formData.teamSize && formData.keyTeamMembers
      default:
        return false
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Project</h1>
              <p className="text-muted-foreground">Update your project details</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <Progress value={(currentStep / totalSteps) * 100} className="flex-1 mr-4" />
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your project name"
                      className="border-primary/20 focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={formData.tagline}
                      onChange={(e) => handleInputChange("tagline", e.target.value)}
                      placeholder="A compelling one-liner about your project"
                      className="border-primary/20 focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your project in detail..."
                      className="border-primary/20 focus:border-primary/50 min-h-[120px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                        <SelectTrigger className="border-primary/20 focus:border-primary/50">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="https://yourproject.com"
                        className="border-primary/20 focus:border-primary/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Problem & Solution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="problemStatement">Problem Statement</Label>
                    <Textarea
                      id="problemStatement"
                      value={formData.problemStatement}
                      onChange={(e) => handleInputChange("problemStatement", e.target.value)}
                      placeholder="What problem does your project solve?"
                      className="border-primary/20 focus:border-primary/50 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="solution">Solution</Label>
                    <Textarea
                      id="solution"
                      value={formData.solution}
                      onChange={(e) => handleInputChange("solution", e.target.value)}
                      placeholder="How does your project solve this problem?"
                      className="border-primary/20 focus:border-primary/50 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetMarket">Target Market</Label>
                    <Textarea
                      id="targetMarket"
                      value={formData.targetMarket}
                      onChange={(e) => handleInputChange("targetMarket", e.target.value)}
                      placeholder="Who is your target audience?"
                      className="border-primary/20 focus:border-primary/50 min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Funding Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fundingGoal">Funding Goal</Label>
                      <Select value={formData.fundingGoal} onValueChange={(value) => handleInputChange("fundingGoal", value)}>
                        <SelectTrigger className="border-primary/20 focus:border-primary/50">
                          <SelectValue placeholder="Select funding goal" />
                        </SelectTrigger>
                        <SelectContent>
                          {fundingGoals.map((goal) => (
                            <SelectItem key={goal} value={goal}>
                              {goal}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="investmentType">Investment Type</Label>
                      <Select
                        value={formData.investmentType}
                        onValueChange={(value) => handleInputChange("investmentType", value)}
                      >
                        <SelectTrigger className="border-primary/20 focus:border-primary/50">
                          <SelectValue placeholder="Select investment type" />
                        </SelectTrigger>
                        <SelectContent>
                          {investmentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="useOfFunds">Use of Funds</Label>
                    <Textarea
                      id="useOfFunds"
                      value={formData.useOfFunds}
                      onChange={(e) => handleInputChange("useOfFunds", e.target.value)}
                      placeholder="How will you use the funding?"
                      className="border-primary/20 focus:border-primary/50 min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price per Share/Unit ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g., 10.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      className="border-primary/20 focus:border-primary/50"
                    />
                    <p className="text-xs text-muted-foreground">Optional: Set a price per share or unit for your project</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Team & Additional Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input
                      id="teamSize"
                      value={formData.teamSize}
                      onChange={(e) => handleInputChange("teamSize", e.target.value)}
                      placeholder="e.g., 5 members"
                      className="border-primary/20 focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="keyTeamMembers">Key Team Members</Label>
                    <Textarea
                      id="keyTeamMembers"
                      value={formData.keyTeamMembers}
                      onChange={(e) => handleInputChange("keyTeamMembers", e.target.value)}
                      placeholder="Describe your key team members and their roles..."
                      className="border-primary/20 focus:border-primary/50 min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        id="tags"
                        value={formData.currentTag}
                        onChange={(e) => handleInputChange("currentTag", e.target.value)}
                        placeholder="Add a tag"
                        className="border-primary/20 focus:border-primary/50"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !canProceed()}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Project
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  )
}