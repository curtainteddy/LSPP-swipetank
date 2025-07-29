"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Edit, Github, Globe, Heart, Home, MessageCircle, Plus, Settings, Star, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Logo } from "@/components/ui/logo"
import { ViewToggle, useViewMode } from "@/components/ui/view-toggle"
import { ThemeToggle } from "@/components/ui/theme-toggle"

// Sample investor data
const investorData = {
  name: "Sarah Johnson",
  title: "Angel Investor & Tech Advisor",
  avatar: "/placeholder.svg?height=100&width=100",
  bio: "Passionate about supporting innovative startups in AI, EdTech, and sustainable technologies. 10+ years of experience in venture capital and startup mentoring.",
  areasOfInterest: ["Artificial Intelligence", "EdTech", "Sustainability", "HealthTech"],
  investmentHistory: [
    {
      name: "EcoTrack",
      amount: "$150K",
      date: "Nov 2023",
      logo: "https://c02.purpledshub.com/uploads/sites/39/2024/07/best-cycling-apps.jpg?w=1200",
      gradient: "gradient-bg-1",
      shadow: "shadow-blue-glow",
    },
    {
      name: "MindMeld",
      amount: "$200K",
      date: "Sep 2023",
      logo: "/placeholder.svg?height=40&width=40",
      gradient: "gradient-bg-2",
      shadow: "shadow-teal-glow",
    },
    {
      name: "HealthHub",
      amount: "$100K",
      date: "Jul 2023",
      logo: "/placeholder.svg?height=40&width=40",
      gradient: "gradient-bg-3",
      shadow: "shadow-purple-glow",
    },
  ],
  swipePreferences: {
    domains: ["AI", "EdTech", "Sustainability"],
    techStacks: ["React", "Python", "TensorFlow", "AWS"],
    fundingRange: "$50K - $250K",
  },
  stats: {
    projectsReviewed: 324,
    connections: 47,
    investments: 12,
  },
}

// Sample innovator data
const innovatorData = {
  name: "Alex Chen",
  title: "Full Stack Developer & Entrepreneur",
  avatar: "/placeholder.svg?height=100&width=100",
  bio: "Building solutions at the intersection of technology and sustainability. Passionate about creating products that make a positive impact.",
  links: [
    { type: "github", url: "https://github.com/alexchen" },
    { type: "website", url: "https://alexchen.dev" },
  ],
  projects: [
    {
      name: "EcoTrack",
      description: "Sustainable living app that tracks carbon footprint",
      techStack: ["React Native", "Node.js", "MongoDB"],
      stats: { views: 1240, likes: 89, matches: 12 },
      image: "/placeholder.svg?height=60&width=60",
      gradient: "gradient-bg-1",
      shadow: "shadow-blue-glow",
    },
    {
      name: "SmartBudget",
      description: "AI-powered personal finance management tool",
      techStack: ["Next.js", "Python", "PostgreSQL"],
      stats: { views: 876, likes: 54, matches: 8 },
      image: "/placeholder.svg?height=60&width=60",
      gradient: "gradient-bg-2",
      shadow: "shadow-teal-glow",
    },
    {
      name: "DevMentor",
      description: "Mentorship platform for junior developers",
      techStack: ["React", "Firebase", "Express"],
      stats: { views: 632, likes: 41, matches: 5 },
      image: "/placeholder.svg?height=60&width=60",
      gradient: "gradient-bg-3",
      shadow: "shadow-purple-glow",
    },
  ],
  feedback: [
    {
      investor: "Sarah Johnson",
      project: "EcoTrack",
      comment: "Impressive solution with great market potential. Would love to discuss further.",
      date: "Dec 10, 2023",
    },
    {
      investor: "Michael Lee",
      project: "SmartBudget",
      comment: "Innovative approach to personal finance. The AI component is particularly interesting.",
      date: "Nov 28, 2023",
    },
  ],
  stats: {
    projectsSubmitted: 5,
    totalViews: 3200,
    totalMatches: 27,
  },
}

export default function ProfileScreen() {
  const router = useRouter()
  const [profileType, setProfileType] = useState<"investor" | "innovator">("investor")

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-background">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <Logo />
        <div className="flex items-center gap-3">
          <ViewToggle />
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
            onClick={() => setProfileType(profileType === "investor" ? "innovator" : "investor")}
          >
            Switch to {profileType === "investor" ? "Innovator" : "Investor"} View
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background to-muted/30">
        {profileType === "investor" ? (
          <InvestorProfile data={investorData} router={router} />
        ) : (
          <InnovatorProfile data={innovatorData} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-around p-4 bg-background/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          className="flex flex-col items-center hover:text-primary"
          onClick={() => router.push("/")}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center hover:text-secondary"
          onClick={() => router.push("/saved-projects")}
        >
          <Star className="h-6 w-6" />
          <span className="text-xs mt-1">Saved</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center text-accent"
          onClick={() => router.push("/profile")}
        >
          <User className="h-6 w-6 fill-accent" />
          <span className="text-xs mt-1 font-medium">Profile</span>
        </Button>
      </div>
    </div>
  )
}

function InvestorProfile({ data, router }: { data: typeof investorData; router: any }) {
  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20 border-2 border-primary/30 ring-4 ring-primary/10 shadow-blue-glow">
          <AvatarImage src={data.avatar || "/placeholder.svg"} alt={data.name} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
            {data.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{data.name}</h2>
              <p className="text-sm text-muted-foreground">{data.title}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="text-center">
              <p className="font-bold text-primary">{data.stats.projectsReviewed}</p>
              <p className="text-xs text-muted-foreground">Reviewed</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-secondary">{data.stats.connections}</p>
              <p className="text-xs text-muted-foreground">Connections</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-accent">{data.stats.investments}</p>
              <p className="text-xs text-muted-foreground">Investments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <h3 className="text-sm font-medium mb-2">About</h3>
        <p className="text-sm text-muted-foreground">{data.bio}</p>
      </div>

      {/* Areas of Interest */}
      <div>
        <h3 className="text-sm font-medium mb-2">Areas of Interest</h3>
        <div className="flex flex-wrap gap-2">
          {data.areasOfInterest.map((area, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`
                ${index % 3 === 0 ? "bg-primary/10 border-primary/20 text-primary" : ""}
                ${index % 3 === 1 ? "bg-secondary/10 border-secondary/20 text-secondary" : ""}
                ${index % 3 === 2 ? "bg-accent/10 border-accent/20 text-accent" : ""}
              `}
            >
              {area}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="investments" className="mt-6">
        <TabsList className="grid grid-cols-3 w-full bg-muted/50">
          <TabsTrigger
            value="investments"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Investments
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Saved
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="investments" className="space-y-4 mt-4">
          <h3 className="text-sm font-medium">Investment History</h3>
          {data.investmentHistory.map((investment, index) => (
            <Card key={index} className={`overflow-hidden border-0 ${investment.shadow} card-hover`}>
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div className={`w-3 self-stretch ${investment.gradient}`}></div>
                  <div className="flex items-center justify-between flex-1 p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center ${investment.gradient}`}>
                        <Image
                          src={investment.logo || "/placeholder.svg"}
                          alt={investment.name}
                          width={24}
                          height={24}
                          className="rounded-md mix-blend-overlay"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{investment.name}</p>
                        <p className="text-xs text-muted-foreground">{investment.date}</p>
                      </div>
                    </div>
                    <p className="font-medium text-primary">{investment.amount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Saved Projects</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-secondary hover:text-secondary hover:bg-secondary/10"
              onClick={() => router.push("/saved-projects")}
            >
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Card className="border-0 shadow-teal-glow bg-gradient-to-br from-secondary/20 to-secondary/5 p-6 text-center">
            <p className="text-sm">
              You have <span className="font-bold text-secondary">15</span> saved projects.
            </p>
            <p className="text-sm text-muted-foreground mt-1">View them all to continue exploring.</p>
            <Button
              className="mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              onClick={() => router.push("/saved-projects")}
            >
              View Saved Projects
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Swipe Preferences</h3>
            <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>

          <Card className="border-0 shadow-purple-glow">
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Preferred Domains</p>
                <div className="flex flex-wrap gap-2">
                  {data.swipePreferences.domains.map((domain, index) => (
                    <Badge key={index} variant="outline" className="bg-accent/10 border-accent/20 text-accent">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Preferred Tech Stacks</p>
                <div className="flex flex-wrap gap-2">
                  {data.swipePreferences.techStacks.map((tech, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Funding Range</p>
                <p className="text-sm font-medium text-secondary">{data.swipePreferences.fundingRange}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InnovatorProfile({ data }: { data: typeof innovatorData }) {
  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20 border-2 border-accent/30 ring-4 ring-accent/10 shadow-purple-glow">
          <AvatarImage src={data.avatar || "/placeholder.svg"} alt={data.name} />
          <AvatarFallback className="bg-gradient-to-br from-accent to-secondary text-white">
            {data.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{data.name}</h2>
              <p className="text-sm text-muted-foreground">{data.title}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-accent/10">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            {data.links.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                target="_blank"
                className={`
                  inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full
                  ${link.type === "github" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}
                `}
              >
                {link.type === "github" ? (
                  <>
                    <Github className="h-3 w-3" /> GitHub
                  </>
                ) : (
                  <>
                    <Globe className="h-3 w-3" /> Website
                  </>
                )}
              </Link>
            ))}
          </div>
          <div className="flex gap-4 mt-3">
            <div className="text-center">
              <p className="font-bold text-primary">{data.stats.projectsSubmitted}</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-secondary">{data.stats.totalViews}</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-accent">{data.stats.totalMatches}</p>
              <p className="text-xs text-muted-foreground">Matches</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <h3 className="text-sm font-medium mb-2">About</h3>
        <p className="text-sm text-muted-foreground">{data.bio}</p>
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">My Projects</h3>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 border-accent/20 text-accent hover:bg-accent/10 hover:text-accent"
          >
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>

        <div className="space-y-4">
          {data.projects.map((project, index) => (
            <Card key={index} className={`overflow-hidden border-0 ${project.shadow} card-hover`}>
              <CardContent className="p-0">
                <div className="flex">
                  <div className={`w-3 self-stretch ${project.gradient}`}></div>
                  <div className="flex gap-3 p-4 flex-1">
                    <div className={`rounded-md w-14 h-14 flex items-center justify-center ${project.gradient}`}>
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.name}
                        width={40}
                        height={40}
                        className="rounded-md mix-blend-overlay"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{project.name}</h4>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-accent/10">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techStack.map((tech, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs bg-primary/10 border-primary/20 text-primary"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3 text-secondary" /> {project.stats.views}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="h-3 w-3 text-destructive" /> {project.stats.likes}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageCircle className="h-3 w-3 text-accent" /> {project.stats.matches}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feedback Section */}
      <div>
        <h3 className="text-sm font-medium mb-3">Recent Feedback</h3>
        <div className="space-y-4">
          {data.feedback.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg p-4 border-l-4 ${index % 2 === 0 ? "border-l-primary bg-primary/5" : "border-l-secondary bg-secondary/5"}`}
            >
              <div className="flex justify-between">
                <p className="text-sm font-medium">{item.investor}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <p className="text-xs mt-1">
                <span className="text-muted-foreground">On </span>
                <span className="font-medium">{item.project}</span>
              </p>
              <p className="text-sm mt-2">{item.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
