'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useKV } from './use-kv'

export interface User {
  id: string
  username: string
  name: string
  role: 'therapist' | 'patient'
  sessionTimeout?: number
  preferences?: {
    language: 'en' | 'pt' | 'es'
    theme: 'light' | 'dark'
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Demo users for testing
const DEMO_USERS: { [key: string]: User } = {
  'dr.smith': {
    id: 'dr-smith',
    username: 'dr.smith',
    name: 'Dr. Smith',
    role: 'therapist',
    sessionTimeout: 30,
    preferences: {
      language: 'en',
      theme: 'light'
    }
  },
  'rodrigo': {
    id: 'rodrigo',
    username: 'rodrigo',
    name: 'Rodrigo',
    role: 'patient',
    sessionTimeout: 60,
    preferences: {
      language: 'pt',
      theme: 'light'
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useKV<User | null>('auth-user', null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    setIsAuthenticated(user !== null)
  }, [user])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Demo login - check credentials
    if (password === 'demo123' && DEMO_USERS[username]) {
      setUser(DEMO_USERS[username])
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}