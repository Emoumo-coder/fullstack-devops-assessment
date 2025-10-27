"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiClient } from "./api-client"

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken")
      if (token) {
        try {
          const response = await apiClient.getMe()
          if (response.success && response.data) {
            setUser(response.data)
          }
        } catch (err) {
          localStorage.removeItem("authToken")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)
    setIsLoading(true)
    try {
      const response = await apiClient.login(email, password)
      if (response.success && response.data) {
        localStorage.setItem("authToken", response.data.token)
        setUser(response.data.user)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setError(null)
    setIsLoading(true)
    try {
      const response = await apiClient.register(name, email, password)
      if (response.success && response.data) {
        localStorage.setItem("authToken", response.data.token)
        setUser(response.data.user)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setError(null)
    try {
      await apiClient.logout()
    } catch (err) {
      // Ignore logout errors as they're not critical
      console.error("Logout error:", err)
    }
    // Always clear local state regardless of API call success
    localStorage.removeItem("authToken")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
