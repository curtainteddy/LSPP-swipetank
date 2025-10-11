"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  Grid,
  List,
  Search,
  Tag,
  MessageCircle,
  Eye,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { AppLayout } from "@/components/layout/app-layout";
import { useUser } from "@/contexts/user-context";
import { motion, AnimatePresence } from "framer-motion";

interface SavedProject {
  id: string;
  name: string;
  description: string;
  founderName: string;
  founderAvatar: string;
  industry: string;
  stage: string;
  fundingGoal: string;
  coverImage: string;
  tags: string[];
  savedDate: string;
  category: "interested" | "inspiration" | "competitor" | "collaboration";
  customTags: string[];
  notes: string;
}

const savedProjects: SavedProject[] = [
  {
    id: "saved-1",
    name: "EcoTrack Mobile",
    description:
      "Sustainable living app for carbon footprint tracking and eco-friendly recommendations",
    founderName: "Sarah Chen",
    founderAvatar: "/placeholder.svg?height=40&width=40",
    industry: "Sustainability",
    stage: "Seed",
    fundingGoal: "$250K",
    coverImage: "/placeholder.svg?height=200&width=300",
    tags: ["Mobile App", "AI", "Sustainability"],
    savedDate: "2024-01-15",
    category: "interested",
    customTags: ["High Priority", "Green Tech"],
    notes:
      "Impressive user growth and strong team. Consider for next investment round.",
  },
  {
    id: "saved-2",
    name: "FinTech Dashboard",
    description:
      "AI-powered personal finance management with automated investment strategies",
    founderName: "Marcus Rodriguez",
    founderAvatar: "/placeholder.svg?height=40&width=40",
    industry: "Finance",
    stage: "Series A",
    fundingGoal: "$500K",
    coverImage: "/placeholder.svg?height=200&width=300",
    tags: ["FinTech", "AI", "SaaS"],
    savedDate: "2024-01-10",
    category: "competitor",
    customTags: ["Market Analysis", "Competitor"],
    notes:
      "Similar to our portfolio company. Monitor for competitive intelligence.",
  },
  {
    id: "saved-3",
    name: "HealthCare AI",
    description:
      "Medical diagnosis assistance platform using advanced machine learning",
    founderName: "Dr. Emily Watson",
    founderAvatar: "/placeholder.svg?height=40&width=40",
    industry: "Healthcare",
    stage: "Series A",
    fundingGoal: "$1M",
    coverImage: "/placeholder.svg?height=200&width=300",
    tags: ["HealthTech", "AI", "Medical"],
    savedDate: "2024-01-05",
    category: "inspiration",
    customTags: ["Innovation", "Healthcare"],
    notes:
      "Innovative approach to medical AI. Could inspire our healthcare investments.",
  },
  {
    id: "saved-4",
    name: "EdTech Platform",
    description:
      "Personalized learning platform for K-12 education with adaptive curriculum",
    founderName: "Alex Johnson",
    founderAvatar: "/placeholder.svg?height=40&width=40",
    industry: "Education",
    stage: "Seed",
    fundingGoal: "$300K",
    coverImage: "/placeholder.svg?height=200&width=300",
    tags: ["EdTech", "AI", "K-12"],
    savedDate: "2024-01-01",
    category: "collaboration",
    customTags: ["Partnership", "EdTech"],
    notes:
      "Potential collaboration opportunity with our education portfolio companies.",
  },
];

export default function SavedProjectsScreen() {
  const router = useRouter();
  const { userRole } = useUser();
  const [projects, setProjects] = useState(savedProjects);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const categories = [
    { value: "interested", label: "Interested", color: "bg-green-500" },
    { value: "inspiration", label: "Inspiration", color: "bg-blue-500" },
    { value: "competitor", label: "Competitor", color: "bg-red-500" },
    { value: "collaboration", label: "Collaboration", color: "bg-purple-500" },
  ];

  const industries = Array.from(new Set(projects.map((p) => p.industry)));

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        searchQuery === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.founderName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || project.category === filterCategory;
      const matchesIndustry =
        filterIndustry === "all" || project.industry === filterIndustry;

      return matchesSearch && matchesCategory && matchesIndustry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "industry":
          return a.industry.localeCompare(b.industry);
        default:
          return 0;
      }
    });

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat?.color || "bg-gray-500";
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat?.label || category;
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Saved Projects</h1>
            <p className="text-muted-foreground">
              {userRole === "innovator"
                ? "Projects you've bookmarked for inspiration and collaboration"
                : "Projects you've saved for potential investment opportunities"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search saved projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-primary/20 focus:border-primary/50"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40 border-primary/20">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterIndustry} onValueChange={setFilterIndustry}>
            <SelectTrigger className="w-40 border-primary/20">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 border-primary/20">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="industry">Industry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Tabs */}
        <Tabs value={filterCategory} onValueChange={setFilterCategory}>
          <TabsList className="grid w-full grid-cols-5 bg-muted/50">
            <TabsTrigger value="all">All ({projects.length})</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${category.color}`}
                  ></div>
                  {category.label} (
                  {projects.filter((p) => p.category === category.value).length}
                  )
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={filterCategory} className="mt-6">
            {filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Bookmark className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No saved projects</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery
                    ? "No projects match your search criteria"
                    : "Start exploring and save projects that interest you"}
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-primary text-primary hover:bg-primary/10 bg-transparent"
                  onClick={() =>
                    router.push(
                      userRole === "investor" ? "/browse" : "/projects"
                    )
                  }
                >
                  {userRole === "investor"
                    ? "Browse Projects"
                    : "Explore Projects"}
                </Button>
              </div>
            ) : (
              <AnimatePresence>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {viewMode === "grid" ? (
                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border-0 bg-card/80 backdrop-blur-sm">
                          <div className="relative">
                            <img
                              src={project.coverImage || "/placeholder.svg"}
                              alt={project.name}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-3 left-3">
                              <div
                                className={`w-3 h-3 rounded-full ${getCategoryColor(
                                  project.category
                                )}`}
                              ></div>
                            </div>
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-black/50 text-white border-0">
                                {project.stage}
                              </Badge>
                            </div>
                          </div>

                          <CardContent className="p-4 space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {project.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {project.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={
                                    project.founderAvatar || "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback className="text-xs">
                                  {project.founderName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                {project.founderName}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {project.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.tags.length - 2}
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {project.customTags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs bg-primary/10 text-primary"
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {project.notes && (
                              <div className="p-2 bg-muted/50 rounded text-xs">
                                <p className="text-muted-foreground line-clamp-2">
                                  {project.notes}
                                </p>
                              </div>
                            )}
                          </CardContent>

                          <CardFooter className="p-4 pt-0 flex justify-between">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() =>
                                  router.push(`/projects/${project.id}`)
                                }
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {userRole === "investor" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2"
                                  onClick={() =>
                                    router.push(
                                      `/messages?project=${project.id}`
                                    )
                                  }
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  Contact
                                </Button>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ) : (
                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border-0 bg-card/80 backdrop-blur-sm">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={project.coverImage || "/placeholder.svg"}
                                alt={project.name}
                                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-semibold">
                                        {project.name}
                                      </h3>
                                      <div
                                        className={`w-2 h-2 rounded-full ${getCategoryColor(
                                          project.category
                                        )}`}
                                      ></div>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {getCategoryLabel(project.category)}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                      {project.description}
                                    </p>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" />
                                  </DropdownMenu>
                                </div>
                                {/* Optionally more list details could go here */}
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {project.tags.slice(0, 3).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  {project.tags.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{project.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex justify-between">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() =>
                                  router.push(`/projects/${project.id}`)
                                }
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {userRole === "investor" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2"
                                  onClick={() =>
                                    router.push(
                                      `/messages?project=${project.id}`
                                    )
                                  }
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  Contact
                                </Button>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      )}
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
