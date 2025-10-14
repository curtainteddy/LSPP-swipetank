"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Search, Globe, Users, TrendingUp, Shield, Star, Play, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/ui/logo"
import { motion, useScroll, useTransform } from "framer-motion"

const heroImages = [
  "/placeholder.jpg",
  "/placeholder.svg",
  "/placeholder-user.jpg"
]

const categories = [
  { name: "Technology", icon: "💻", count: "1,200+ projects" },
  { name: "Healthcare", icon: "🏥", count: "800+ projects" },
  { name: "Environment", icon: "🌱", count: "600+ projects" },
  { name: "Education", icon: "📚", count: "450+ projects" },
  { name: "Finance", icon: "💰", count: "350+ projects" },
  { name: "Entertainment", icon: "🎬", count: "280+ projects" },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, EcoTech",
    content: "SwipeTank connected me with the perfect investors. Within 3 months, I secured $2M in funding.",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    funding: "$2M raised"
  },
  {
    name: "Marcus Rodriguez", 
    role: "CEO, HealthAI",
    content: "The AI analysis helped us identify market gaps we never knew existed. Game-changing platform.",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    funding: "$5M raised"
  },
  {
    name: "Emily Watson",
    role: "Inventor, SmartHome",
    content: "From idea to investment in 6 weeks. SwipeTank made the impossible, possible.",
    avatar: "/placeholder-user.jpg", 
    rating: 5,
    funding: "$1.5M raised"
  }
]

const stats = [
  { value: "10K+", label: "Active Projects" },
  { value: "$500M+", label: "Total Funding" },
  { value: "95%", label: "Success Rate" },
  { value: "150+", label: "Countries" }
]

export default function LandingPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 300], [0, 150])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Airbnb-style Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            
            <div className="flex items-center gap-6">
              <Button variant="ghost" className="text-gray-700 hover:bg-gray-50 font-medium">
                Host a Project
              </Button>
              <Button variant="ghost" className="text-gray-700 hover:bg-gray-50 font-medium">
                <Globe className="h-4 w-4 mr-2" />
                EN
              </Button>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:bg-gray-50 font-medium"
                  onClick={() => router.push("/sign-in")}
                >
                  Log in
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white rounded-airbnb"
                  onClick={() => router.push("/sign-up")}
                >
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Airbnb Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: index === currentImageIndex ? 1 : 0,
                scale: index === currentImageIndex ? 1 : 1.1
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <img
                src={image}
                alt="Hero background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
          style={{ y: heroY }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Discover Your Next
            <br />
            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              Investment Opportunity
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl lg:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto"
          >
            Connect innovative projects with smart investors. Swipe through groundbreaking ideas and find your perfect match.
          </motion.p>

          {/* Search Bar - Airbnb Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="bg-white rounded-full shadow-airbnb-lg p-2 flex items-center">
                <div className="flex-1 px-6 py-4">
                  <Input
                    placeholder="Search for projects, technologies, or industries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent text-gray-800 placeholder:text-gray-500 focus:ring-0 focus:outline-none text-lg px-0"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-4 text-lg font-medium"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm lg:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-airbnb-4xl font-semibold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-airbnb-xl text-gray-600 max-w-2xl mx-auto">
              Find projects that match your interests and investment criteria
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="group cursor-pointer hover:shadow-airbnb transition-all duration-300 border border-gray-200 bg-white"
                  onClick={() => router.push(`/browse?category=${category.name.toLowerCase()}`)}
                >
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-airbnb-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-airbnb-sm text-gray-600">
                      {category.count}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-airbnb-4xl font-semibold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-airbnb-xl text-gray-600 max-w-2xl mx-auto">
              Real entrepreneurs, real results. See how SwipeTank has helped turn ideas into funded ventures.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border border-gray-200 hover:shadow-airbnb transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p className="text-airbnb-base text-gray-700 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback>
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {testimonial.name}
                          </div>
                          <div className="text-airbnb-sm text-gray-600">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 font-medium">
                        {testimonial.funding}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-pink-100 mb-12 max-w-2xl mx-auto">
              Join thousands of entrepreneurs and investors who are already building the future together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-50 text-lg px-8 py-4 rounded-airbnb font-semibold"
                onClick={() => router.push("/sign-up")}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-airbnb font-semibold"
                onClick={() => router.push("/browse")}
              >
                Explore Projects
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <Logo />
              <p className="text-gray-400 mt-4 max-w-md">
                The world's largest platform for connecting innovative projects with smart investors.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/browse" className="hover:text-white transition-colors">Browse Projects</a></li>
                <li><a href="/investors" className="hover:text-white transition-colors">For Investors</a></li>
                <li><a href="/entrepreneurs" className="hover:text-white transition-colors">For Entrepreneurs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SwipeTank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}