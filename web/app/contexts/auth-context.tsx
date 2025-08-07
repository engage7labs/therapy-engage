'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  username: string
  role: 'therapist' | 'patient' | 'admin'
  name: string
  email?: string
  profile?: {
    avatar?: string
    specialization?: string
    license?: string
    phone?: string
    emergencyContact?: string
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateLastActivity: () => void
  lastActivity: Date | null
}

const AuthContext = createContext<AuthContextType | null>(null)

// Mock users for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
  'dr.smith': {
    password: 'demo123',
    user: {
      id: 'user-001',
      username: 'dr.smith',
      role: 'therapist',
      name: 'Dr. Sarah Smith',
      email: 'dr.smith@therapyengage.com',
      profile: {
        specialization: 'Cognitive Behavioral Therapy',
        license: 'PSY-12345',
        phone: '+1 (555) 123-4567'
      }
    }
  },
  'rodrigo': {
    password: 'demo123',
    user: {
      id: 'user-002',
      username: 'rodrigo',
      role: 'patient',
      name: 'Rodrigo Silva',
      email: 'rodrigo@email.com',
      profile: {
        phone: '+55 11 99999-1234',
        emergencyContact: '+55 11 99999-5678'
      }
    }
  },
  'admin': {
    password: 'admin123',
    user: {
      id: 'user-admin',
      username: 'admin',
      role: 'admin',
      name: 'System Administrator',
      email: 'admin@therapyengage.com'
    }
  }
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [lastActivity, setLastActivity] = useState<Date | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('therapy-user')
      const storedActivity = localStorage.getItem('therapy-last-activity')
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Error parsing stored user:', error)
          localStorage.removeItem('therapy-user')
        }
      }
      
      if (storedActivity) {
        try {
          setLastActivity(new Date(storedActivity))
        } catch (error) {
          console.error('Error parsing stored activity:', error)
          localStorage.removeItem('therapy-last-activity')
        }
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userData = mockUsers[username.toLowerCase()]
    
    if (userData && userData.password === password) {
      const authenticatedUser = userData.user
      setUser(authenticatedUser)
      setIsAuthenticated(true)
      updateLastActivity()
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('therapy-user', JSON.stringify(authenticatedUser))
      }
      
      return true
    }
    
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setLastActivity(null)
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('therapy-user')
      localStorage.removeItem('therapy-last-activity')
    }
  }

  const updateLastActivity = () => {
    const now = new Date()
    setLastActivity(now)
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('therapy-last-activity', now.toISOString())
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    updateLastActivity,
    lastActivity
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthContext }