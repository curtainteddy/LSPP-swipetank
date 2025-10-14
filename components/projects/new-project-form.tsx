"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Plus,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AppLayout } from "@/components/layout/app-layout";
import { motion, AnimatePresence } from "framer-motion";

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
];

const investmentTypes = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
  "Bridge",
  "Convertible Note",
];

const fundingGoals = [
  "Under $50K",
  "$50K - $100K",
  "$100K - $250K",
  "$250K - $500K",
  "$500K - $1M",
  "$1M - $5M",
  "$5M - $10M",
  "Over $10M",
];

interface ProjectFormData {
  // Basic Info
  name: string;
  tagline: string;
  description: string;
  industry: string;
  website: string;

  // Problem & Solution
  problemStatement: string;
  solution: string;
  targetMarket: string;

  // Funding
  fundingGoal: string;
  investmentType: string;
  useOfFunds: string;

  // Team & Assets
  teamSize: string;
  keyTeamMembers: string;
  assets: File[];

  // Additional
  tags: string[];
  currentTag: string;
}

export default function NewProjectForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;

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
    teamSize: "",
    keyTeamMembers: "",
    assets: [],
    tags: [],
    currentTag: "",
  });

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        assets: [...prev.assets, ...newFiles],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (
      formData.currentTag.trim() &&
      !formData.tags.includes(formData.currentTag.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: "",
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const uploadAssetFiles = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of formData.assets) {
      const form = new FormData();
      form.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) throw new Error("upload failed");
        const data = await res.json();
        if (data.url) urls.push(data.url);
      } catch (e) {
        console.error("Failed to upload file", file.name, e);
      }
    }
    return urls;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Upload assets first (best-effort; continue even if some fail)
      const uploadedImageUrls = await uploadAssetFiles();
      // Prepare project data
      const projectData = {
        title: formData.name,
        description: `${formData.tagline}\n\n${formData.description}\n\nProblem: ${formData.problemStatement}\n\nSolution: ${formData.solution}\n\nTarget Market: ${formData.targetMarket}\n\nUse of Funds: ${formData.useOfFunds}\n\nTeam Size: ${formData.teamSize}\n\nKey Team Members: ${formData.keyTeamMembers}`,
        price: null, // You can add price field to the form if needed
        status: "DRAFT", // Start as draft, user can publish later
        tags: formData.tags,
        images: uploadedImageUrls.map((url, idx) => ({
          url,
          isPrimary: idx === 0,
        })),
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const result = await response.json();
      console.log("Project created:", result.project);

      // Redirect to projects page
      router.push("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return "Problem & Solution";
      case 3:
        return "Funding Details";
      case 4:
        return "Team & Assets";
      default:
        return "Project Setup";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Tell us about your project and what industry you're in";
      case 2:
        return "Describe the problem you're solving and your solution";
      case 3:
        return "Share your funding goals and investment preferences";
      case 4:
        return "Add team information and upload relevant assets";
      default:
        return "Complete your project setup";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your project name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-primary/20 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("industry", value)
                  }
                >
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline *</Label>
              <Input
                id="tagline"
                placeholder="A brief, compelling description of your project"
                value={formData.tagline}
                onChange={(e) => handleInputChange("tagline", e.target.value)}
                className="border-primary/20 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of your project, its goals, and current status"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="border-primary/20 focus:border-primary/50 min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website/Demo URL</Label>
              <Input
                id="website"
                placeholder="https://yourproject.com"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="border-primary/20 focus:border-primary/50"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="problemStatement">Problem Statement *</Label>
              <Textarea
                id="problemStatement"
                placeholder="What specific problem does your project solve? Who experiences this problem?"
                value={formData.problemStatement}
                onChange={(e) =>
                  handleInputChange("problemStatement", e.target.value)
                }
                className="border-primary/20 focus:border-primary/50 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">Your Solution *</Label>
              <Textarea
                id="solution"
                placeholder="How does your project solve this problem? What makes your solution unique?"
                value={formData.solution}
                onChange={(e) => handleInputChange("solution", e.target.value)}
                className="border-primary/20 focus:border-primary/50 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetMarket">Target Market *</Label>
              <Textarea
                id="targetMarket"
                placeholder="Who is your target audience? What's the market size and opportunity?"
                value={formData.targetMarket}
                onChange={(e) =>
                  handleInputChange("targetMarket", e.target.value)
                }
                className="border-primary/20 focus:border-primary/50 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Project Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add relevant tags (e.g., AI, Mobile, SaaS)"
                  value={formData.currentTag}
                  onChange={(e) =>
                    handleInputChange("currentTag", e.target.value)
                  }
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="border-primary/20 focus:border-primary/50"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fundingGoal">Funding Goal *</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("fundingGoal", value)
                  }
                >
                  <SelectTrigger className="border-primary/20 focus:border-primary/50">
                    <SelectValue placeholder="Select funding range" />
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

              <div className="space-y-2">
                <Label htmlFor="investmentType">Investment Type *</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("investmentType", value)
                  }
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

            <div className="space-y-2">
              <Label htmlFor="useOfFunds">Use of Funds *</Label>
              <Textarea
                id="useOfFunds"
                placeholder="How will you use the investment? Break down the allocation (e.g., 40% development, 30% marketing, 20% team, 10% operations)"
                value={formData.useOfFunds}
                onChange={(e) =>
                  handleInputChange("useOfFunds", e.target.value)
                }
                className="border-primary/20 focus:border-primary/50 min-h-[120px]"
              />
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Funding Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Be specific about how funds will be used</p>
                <p>• Include milestones and timeline</p>
                <p>• Show potential return on investment</p>
                <p>• Consider different funding scenarios</p>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  placeholder="e.g., 3 full-time, 2 part-time"
                  value={formData.teamSize}
                  onChange={(e) =>
                    handleInputChange("teamSize", e.target.value)
                  }
                  className="border-primary/20 focus:border-primary/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyTeamMembers">Key Team Members</Label>
              <Textarea
                id="keyTeamMembers"
                placeholder="Introduce your key team members, their roles, and relevant experience"
                value={formData.keyTeamMembers}
                onChange={(e) =>
                  handleInputChange("keyTeamMembers", e.target.value)
                }
                className="border-primary/20 focus:border-primary/50 min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <Label>Project Assets</Label>
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload pitch deck, mockups, videos, or other relevant files
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supported formats: PDF, PNG, JPG, MP4, PPTX (Max 10MB each)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.mp4,.pptx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  Choose Files
                </Button>
              </div>

              {formData.assets.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files</Label>
                  {formData.assets.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/projects")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Project</h1>
            <p className="text-muted-foreground">
              Set up your project to connect with investors and build your
              portfolio
            </p>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{getStepTitle()}</h2>
                <p className="text-muted-foreground">{getStepDescription()}</p>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>
            <Progress
              value={(currentStep / totalSteps) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card>
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="hover:bg-primary/10 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Project...
                </>
              ) : (
                <>
                  Create Project
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
