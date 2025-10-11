"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Plus,
  Filter,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

import { AppLayout } from "@/components/layout/app-layout";
import { useUser } from "@/contexts/user-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const events = [
  {
    id: 1,
    title: "TechCrunch Disrupt 2024",
    date: "2024-09-15",
    time: "09:00 AM",
    location: "San Francisco, CA",
    type: "Conference",
    status: "upcoming",
    userType: "both",
  },
  {
    id: 2,
    title: "Startup Pitch Night",
    date: "2024-08-28",
    time: "06:00 PM",
    location: "Virtual",
    type: "Pitch Event",
    status: "upcoming",
    userType: "innovator",
  },
  {
    id: 3,
    title: "VC Networking Mixer",
    date: "2024-08-30",
    time: "07:30 PM",
    location: "New York, NY",
    type: "Networking",
    status: "upcoming",
    userType: "both",
  },
  {
    id: 4,
    title: "Angel Investor Meetup",
    date: "2024-09-05",
    time: "05:00 PM",
    location: "Austin, TX",
    type: "Investment",
    status: "upcoming",
    userType: "investor",
  },
];

const stats = [
  {
    title: "Total Projects",
    value: "12",
    change: "+2.5%",
    icon: BarChart3,
    color: "text-blue-500",
  },
  {
    title: "Active Analyses",
    value: "8",
    change: "+12%",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    title: "Investor Matches",
    value: "24",
    change: "+8.1%",
    icon: Users,
    color: "text-purple-500",
  },
  {
    title: "Funding Potential",
    value: "$2.4M",
    change: "+15%",
    icon: DollarSign,
    color: "text-orange-500",
  },
];

const recentProjects = [
  {
    id: 1,
    name: "EcoTrack Mobile",
    description: "Sustainable transportation tracking app",
    status: "analyzing",
    progress: 75,
    lastUpdated: "2 hours ago",
    category: "Sustainability",
    funding: "$150K",
    team: 4,
    stage: "MVP",
    marketSize: "$2.1B",
  },
  {
    id: 2,
    name: "FinTech Dashboard",
    description: "Real-time financial analytics platform",
    status: "completed",
    progress: 100,
    lastUpdated: "1 day ago",
    category: "Finance",
    funding: "$500K",
    team: 8,
    stage: "Growth",
    marketSize: "$4.5B",
  },
];

const notifications = [
  {
    id: 1,
    title: "New startup application",
    description: "HealthTech AI has submitted their funding proposal",
    time: "10 min ago",
    type: "application",
    userType: "investor",
  },
  {
    id: 2,
    title: "Deal flow update",
    description: "3 new startups added to your deal pipeline",
    time: "30 min ago",
    type: "deal",
    userType: "investor",
  },
  {
    id: 3,
    title: "Investment opportunity",
    description: "EcoSmart matches your investment criteria",
    time: "1 hour ago",
    type: "opportunity",
    userType: "investor",
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { userType } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filteredEvents = events.filter(
    (e) => e.userType === "both" || e.userType === userType
  );
  const filteredNotifications = notifications.filter(
    (n) => n.userType === userType
  );

  const StatCard = ({
    stat,
    index,
  }: {
    stat: (typeof stats)[0];
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          <stat.icon className={`h-4 w-4 ${stat.color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stat.value}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">{stat.change}</span> from last
            month
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
        <div className="px-4 pt-4">
          <div className="mx-auto  w-full lg:w-[70%]">
            <Tabs defaultValue="home" className="space-y-6">
              <TabsList className="sticky top-4 z-10 bg-muted/70 backdrop-blur supports-[backdrop-filter]:bg-muted/50 rounded-full p-1 w-full justify-center">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="activity">Investment Activity</TabsTrigger>
                <TabsTrigger value="events">Events & Conference</TabsTrigger>
              </TabsList>

              <TabsContent value="home" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {userType === "innovator" ? "John" : "Sarah"}!
                  </h1>
                  <p className="text-muted-foreground">
                    {userType === "innovator"
                      ? "Here's what's happening with your projects today."
                      : "Here's your investment portfolio overview and deal flow updates."}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <StatCard key={stat.title} stat={stat} index={index} />
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>
                          {userType === "innovator"
                            ? "Recent Projects"
                            : "Deal Pipeline"}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              router.push(
                                userType === "innovator"
                                  ? "/analytics"
                                  : "/browse"
                              )
                            }
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {userType === "innovator"
                              ? "New Analysis"
                              : "Browse Startups"}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {isLoading
                          ? Array.from({ length: 3 }).map((_, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div className="flex items-center space-x-4">
                                  <Skeleton className="h-10 w-10 rounded" />
                                  <div>
                                    <Skeleton className="h-4 w-32 mb-2" />
                                    <Skeleton className="h-3 w-24" />
                                  </div>
                                </div>
                                <Skeleton className="h-6 w-16" />
                              </div>
                            ))
                          : recentProjects.map((project, index) => (
                              <motion.div
                                key={project.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.5,
                                  delay: index * 0.1,
                                }}
                                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() =>
                                  router.push(`/analytics/${project.id}`)
                                }
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-4 flex-1">
                                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                                      <BarChart3 className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-lg">
                                          {project.name}
                                        </h3>
                                        <Badge
                                          variant={
                                            project.status === "completed"
                                              ? "default"
                                              : project.status === "analyzing"
                                              ? "secondary"
                                              : "outline"
                                          }
                                          className="ml-2"
                                        >
                                          {project.status}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                        {project.description}
                                      </p>
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                        <span>
                                          {project.lastUpdated} •{" "}
                                          {project.category}
                                        </span>
                                        <span>Stage: {project.stage}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pt-3 border-t border-border/50">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-500" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Funding
                                      </p>
                                      <p className="text-sm font-medium">
                                        {project.funding}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-blue-500" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Team Size
                                      </p>
                                      <p className="text-sm font-medium">
                                        {project.team} members
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-orange-500" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Market Size
                                      </p>
                                      <p className="text-sm font-medium">
                                        {project.marketSize}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4 text-purple-500" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Progress
                                      </p>
                                      <div className="flex items-center gap-1">
                                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-primary transition-all duration-300"
                                            style={{
                                              width: `${project.progress}%`,
                                            }}
                                          />
                                        </div>
                                        <span className="text-sm font-medium">
                                          {project.progress}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>
                          {userType === "innovator"
                            ? "Development Activity"
                            : "Investment Activity"}
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        {userType === "innovator"
                          ? "Track your project progress and investor interest"
                          : "Monitor deal flow and portfolio updates"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-5">
                        {isLoading
                          ? Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className="space-y-3 p-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            ))
                          : filteredNotifications.map((notification, index) => (
                              <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.5,
                                  delay: index * 0.1,
                                }}
                                className="space-y-2 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-border/30"
                              >
                                <div className="flex items-start justify-between">
                                  <h4 className="text-sm font-medium leading-relaxed">
                                    {notification.title}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ml-2 ${
                                      notification.type === "match" ||
                                      notification.type === "opportunity"
                                        ? "bg-green-500/10 border-green-500/20 text-green-600"
                                        : notification.type === "analysis" ||
                                          notification.type === "report"
                                        ? "bg-blue-500/10 border-blue-500/20 text-blue-600"
                                        : notification.type === "portfolio" ||
                                          notification.type === "deal"
                                        ? "bg-purple-500/10 border-purple-500/20 text-purple-600"
                                        : "bg-orange-500/10 border-orange-500/20 text-orange-600"
                                    }`}
                                  >
                                    {notification.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {notification.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {notification.time}
                                </p>
                              </motion.div>
                            ))}
                      </div>
                      <Separator className="my-4" />
                      <Button
                        variant="ghost"
                        className="w-full text-sm text-primary"
                      >
                        View all activity
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          {userType === "innovator"
                            ? "Pitch Events & Conferences"
                            : "Investment Events & Meetings"}
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        {userType === "innovator"
                          ? "Discover opportunities to showcase your innovations"
                          : "Stay updated with investment and networking events"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-5">
                        {isLoading
                          ? Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="space-y-3 p-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            ))
                          : filteredEvents.map((event, index) => (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.5,
                                  delay: index * 0.1,
                                }}
                                className="p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-medium text-sm leading-relaxed">
                                    {event.title}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ml-2 ${
                                      event.type === "Investment" ||
                                      event.type === "Review"
                                        ? "bg-blue-500/10 border-blue-500/20 text-blue-600"
                                        : event.type === "Pitch Event" ||
                                          event.type === "Showcase"
                                        ? "bg-green-500/10 border-green-500/20 text-green-600"
                                        : "bg-purple-500/10 border-purple-500/20 text-purple-600"
                                    }`}
                                  >
                                    {event.type}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-2" />
                                    {event.date}
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-2" />
                                    {event.time}
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3 mr-2" />
                                    {event.location}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
