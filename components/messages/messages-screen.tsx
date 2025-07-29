"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Send, Paperclip, Search, MoreVertical, Phone, Video, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppLayout } from "@/components/layout/app-layout"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: "text" | "file" | "system"
  fileName?: string
}

interface Conversation {
  id: string
  participantName: string
  participantAvatar: string
  participantRole: string
  projectName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  messages: Message[]
}

const conversations: Conversation[] = [
  {
    id: "1",
    participantName: "Sarah Chen",
    participantAvatar: "/placeholder.svg?height=40&width=40",
    participantRole: "Founder",
    projectName: "EcoTrack Mobile",
    lastMessage: "Thanks for your interest! I'd love to discuss the investment opportunity.",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: "1",
        senderId: "system",
        content: "TechVentures expressed interest in EcoTrack Mobile",
        timestamp: new Date(Date.now() - 3600000),
        type: "system",
      },
      {
        id: "2",
        senderId: "sarah",
        content: "Hi! Thanks for showing interest in EcoTrack. I'm excited to discuss how we can work together.",
        timestamp: new Date(Date.now() - 3000000),
        type: "text",
      },
      {
        id: "3",
        senderId: "user",
        content:
          "Hello Sarah! I'm impressed by your sustainability approach. Can you tell me more about your user acquisition strategy?",
        timestamp: new Date(Date.now() - 2400000),
        type: "text",
      },
      {
        id: "4",
        senderId: "sarah",
        content:
          "We've been focusing on partnerships with environmental organizations and social media campaigns. Our CAC is currently $12 with an LTV of $180.",
        timestamp: new Date(Date.now() - 1800000),
        type: "text",
      },
      {
        id: "5",
        senderId: "sarah",
        content: "I've attached our latest pitch deck with detailed metrics.",
        timestamp: new Date(Date.now() - 1800000),
        type: "file",
        fileName: "EcoTrack_Pitch_Deck_2024.pdf",
      },
      {
        id: "6",
        senderId: "sarah",
        content: "Thanks for your interest! I'd love to discuss the investment opportunity.",
        timestamp: new Date(Date.now() - 120000),
        type: "text",
      },
    ],
  },
  {
    id: "2",
    participantName: "Marcus Rodriguez",
    participantAvatar: "/placeholder.svg?height=40&width=40",
    participantRole: "CTO",
    projectName: "FinTech Dashboard",
    lastMessage: "The technical demo is ready when you are.",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: "1",
        senderId: "system",
        content: "You expressed interest in FinTech Dashboard",
        timestamp: new Date(Date.now() - 7200000),
        type: "system",
      },
      {
        id: "2",
        senderId: "user",
        content: "Hi Marcus! Your fintech solution looks promising. I'd like to learn more about your AI algorithms.",
        timestamp: new Date(Date.now() - 6600000),
        type: "text",
      },
      {
        id: "3",
        senderId: "marcus",
        content:
          "Thank you for reaching out! Our AI uses advanced machine learning models for risk assessment and portfolio optimization. The technical demo is ready when you are.",
        timestamp: new Date(Date.now() - 3600000),
        type: "text",
      },
    ],
  },
  {
    id: "3",
    participantName: "Dr. Emily Watson",
    participantAvatar: "/placeholder.svg?height=40&width=40",
    participantRole: "CMO",
    projectName: "HealthCare AI",
    lastMessage: "Looking forward to our call tomorrow.",
    lastMessageTime: "3 hours ago",
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: "1",
        senderId: "system",
        content: "You expressed interest in HealthCare AI",
        timestamp: new Date(Date.now() - 14400000),
        type: "system",
      },
      {
        id: "2",
        senderId: "user",
        content: "Dr. Watson, I'm very interested in your healthcare AI platform. The potential impact is significant.",
        timestamp: new Date(Date.now() - 12600000),
        type: "text",
      },
      {
        id: "3",
        senderId: "emily",
        content:
          "Thank you! We're passionate about improving healthcare outcomes. I'd love to schedule a call to discuss our clinical trials and FDA pathway.",
        timestamp: new Date(Date.now() - 10800000),
        type: "text",
      },
      {
        id: "4",
        senderId: "emily",
        content: "Looking forward to our call tomorrow.",
        timestamp: new Date(Date.now() - 10800000),
        type: "text",
      },
    ],
  },
]

export default function MessagesScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("project")

  const [selectedConversation, setSelectedConversation] = useState<string>(
    projectId
      ? conversations.find((c) => c.projectName.toLowerCase().includes("eco"))?.id || conversations[0].id
      : conversations[0].id,
  )
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentConversation = conversations.find((c) => c.id === selectedConversation)
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.projectName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedConversation, currentConversation?.messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: "user",
      content: newMessage,
      timestamp: new Date(),
      type: "text",
    }

    // In a real app, this would update the conversation in state/database
    currentConversation.messages.push(message)
    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageTime = (timestamp: string) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes} min ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? "s" : ""} ago`
    } else {
      return messageTime.toLocaleDateString()
    }
  }

  return (
    <AppLayout userRole="investor">
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversations List */}
        <div className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="p-4 border-b border-border/50">
            <h2 className="text-lg font-semibold mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-primary/20 focus:border-primary/50"
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-120px)]">
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-primary/5",
                    selectedConversation === conversation.id && "bg-primary/10 border border-primary/20",
                  )}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.participantAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{conversation.participantName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>

                  <div className="flex-1 ml-3 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{conversation.participantName}</h3>
                      <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-primary">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs bg-secondary/10 text-secondary">
                        {conversation.projectName}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {currentConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentConversation.participantAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{currentConversation.participantName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {currentConversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{currentConversation.participantName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{currentConversation.participantRole}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-secondary">{currentConversation.projectName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Project Details</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                    <DropdownMenuItem>Archive Conversation</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {currentConversation.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn("flex", message.senderId === "user" ? "justify-end" : "justify-start")}
                    >
                      {message.type === "system" ? (
                        <div className="flex justify-center w-full">
                          <div className="bg-muted/50 text-muted-foreground text-sm px-4 py-2 rounded-full">
                            {message.content}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "max-w-[70%] space-y-1",
                            message.senderId === "user" ? "items-end" : "items-start",
                          )}
                        >
                          <div
                            className={cn(
                              "px-4 py-2 rounded-2xl",
                              message.senderId === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted",
                            )}
                          >
                            {message.type === "file" ? (
                              <div className="flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                <span className="text-sm">{message.fileName}</span>
                              </div>
                            ) : (
                              <p className="text-sm">{message.content}</p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground px-2">{formatTime(message.timestamp)}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="border-primary/20 focus:border-primary/50"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
