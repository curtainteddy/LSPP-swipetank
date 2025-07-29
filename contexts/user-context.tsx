"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "innovator" | "investor" | "accelerator"
export type UserType = "innovator" | "investor"

interface UserContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  userId: string
  userName: string
  userEmail: string
  isAuthenticated: boolean
  setUser: (user: { id: string; name: string; email: string }) => void
  logout: () => void
  userType: UserType
  setUserType: (type: UserType) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>("innovator")
  const [userId, setUserId] = useState("user-123")
  const [userName, setUserName] = useState("John Doe")
  const [userEmail, setUserEmail] = useState("john.doe@example.com")
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [userType, setUserType] = useState<UserType>("investor")

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as UserRole
    const savedUser = localStorage.getItem("userData")
    const savedType = localStorage.getItem("userType") as UserType

    if (savedRole) {
      setUserRole(savedRole)
    }

    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUserId(userData.id)
      setUserName(userData.name)
      setUserEmail(userData.email)
    }

    if (savedType) {
      setUserType(savedType)
    }
  }, [])

  // Save user role to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("userRole", userRole)
  }, [userRole])

  // Save user type to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("userType", userType)
  }, [userType])

  const setUser = (user: { id: string; name: string; email: string }) => {
    setUserId(user.id)
    setUserName(user.name)
    setUserEmail(user.email)
    localStorage.setItem("userData", JSON.stringify(user))
    setIsAuthenticated(true)
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("userData")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userType")
  }

  const value: UserContextType = {
    userRole,
    setUserRole,
    userId,
    userName,
    userEmail,
    isAuthenticated,
    setUser,
    logout,
    userType,
    setUserType,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
