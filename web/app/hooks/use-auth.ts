'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useKV } from './use-kv'

export interface User {
  id: string
  username: string
  name: string
  role: 'therapist' | 'patient' | 'admin'
  email?: string
  sessionTimeout?: number
  profile?: {
    avatar?: string
    specialization?: string
    license?: string
    phone?: string
    emergencyContact?: string
  }
  preferences?: {
    language: 'en' | 'pt' | 'es'
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  updateLastActivity: () => void
  lastActivity: Date | null
}

const AuthContext = createContext<AuthContextType | null>(null)

// Enhanced demo users with more realistic data
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'dr.smith': {
    password: 'demo123',
    user: {
      id: 'dr-smith-001',
      username: 'dr.smith',
      name: 'Dr. Sarah Smith',
      role: 'therapist',
      email: 'dr.smith@therapyengage.com',
      sessionTimeout: 30, // 30 minutes for therapists
      profile: {
        specialization: 'Cognitive Behavioral Therapy',
        license: 'PSY-12345',
        phone: '+1 (555) 123-4567'
      },
      preferences: {
        language: 'en',
        theme: 'light',
        notifications: true
      }
    }
  },
  'rodrigo': {
    password: 'demo123',
    user: {
      id: 'patient-rodrigo-001',
      username: 'rodrigo',
      name: 'Rodrigo Marques',
      role: 'patient',
      email: 'rodrigo@example.com',
      sessionTimeout: 60, // 60 minutes for patients
      preferences: {
        language: 'pt',
        theme: 'light',
        notifications: true
      }
    }
  },
  'admin': {
    password: 'admin123',
    user: {
      id: 'admin-001',
      username: 'admin',
      name: 'System Administrator',
      role: 'admin',
      email: 'admin@therapyengage.com',
      sessionTimeout: 45, // 45 minutes for admins
      preferences: {
        language: 'en',
        theme: 'light',
        notifications: true
      }
    }
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useKV<User | null>('therapy-auth-user', null)
  const [lastActivity, setLastActivity] = useKV<Date | null>('therapy-last-activity', null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const updateLastActivity = useCallback(() => {
    const now = new Date()
    setLastActivity(now)
  }, [setLastActivity])

  const logout = useCallback(() => {
    console.log(`Logout for user: ${user?.name}`)
    setUser(null)
    setLastActivity(null)
    setIsAuthenticated(false)
  }, [user?.name, setUser, setLastActivity])

  const updateUser = useCallback((updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      console.log('User profile updated:', updates)
    }
  }, [user, setUser])

  // Check authentication on mount
  useEffect(() => {
    setIsAuthenticated(user !== null)
    if (user) {
      updateLastActivity()
    }
  }, [user, updateLastActivity])

  // Session timeout check
  useEffect(() => {
    if (user && lastActivity) {
      const timeoutMs = (user.sessionTimeout || 30) * 60 * 1000 // Convert minutes to milliseconds
      const timeSinceActivity = Date.now() - new Date(lastActivity).getTime()
      
      if (timeSinceActivity > timeoutMs) {
        console.log('Session expired due to inactivity')
        logout()
      }
    }
  }, [user, lastActivity, logout])

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const userRecord = DEMO_USERS[username]
      if (userRecord && userRecord.password === password) {
        setUser(userRecord.user)
        updateLastActivity()
        console.log(`Login successful for ${username} (${userRecord.user.role})`)
        return true
      }
      
      console.log(`Login failed for ${username}`)
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }, [setUser, updateLastActivity])

  // Update activity on any user interaction
  useEffect(() => {
    if (isAuthenticated) {
      const handleActivity = () => updateLastActivity()
      
      // Track user activity
      window.addEventListener('click', handleActivity)
      window.addEventListener('keypress', handleActivity)
      window.addEventListener('scroll', handleActivity)
      
      return () => {
        window.removeEventListener('click', handleActivity)
        window.removeEventListener('keypress', handleActivity)
        window.removeEventListener('scroll', handleActivity)
      }
    }
  }, [isAuthenticated, updateLastActivity])

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
    updateLastActivity,
    lastActivity
  }

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
