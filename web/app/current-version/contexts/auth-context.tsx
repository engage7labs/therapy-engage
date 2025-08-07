import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useKV } from '@/hooks/use-kv'

export interface User {
  id: string
  username: string
  name: string
  role: 'therapist' | 'patient'
  email?: string
  lastLogin?: number
  sessionTimeout?: number
}

interface SessionInfo {
  startTime: number
  lastActivity: number
  loginCount: number
  securityEvents: Array<{
    type: string
    timestamp: number
    details: any
  }>
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: (reason?: string) => void
  isAuthenticated: boolean
  sessionInfo: SessionInfo | null
  updateActivity: () => void
  extendSession: (minutes?: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'dr.smith': {
    password: 'demo123',
    user: {
      id: 'dr-smith',
      username: 'dr.smith',
      name: 'Dr. Smith',
      role: 'therapist',
      email: 'dr.smith@therapyengage.com',
      sessionTimeout: 30 // 30 minutes for therapists
    }
  },
  'rodrigo': {
    password: 'demo123',
    user: {
      id: 'patient-rodrigo',
      username: 'rodrigo',
      name: 'Rodrigo Marques',
      role: 'patient',
      email: 'rodrigo@patient-demo.com',
      sessionTimeout: 60 // 60 minutes for patients
    }
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [persistedSession, setPersistedSession] = useKV<User | null>('auth-session', null)
  const [sessionInfo, setSessionInfo] = useKV<SessionInfo | null>('session-info', null)
  const [lastActivity, setLastActivity] = useKV('session-last-activity', Date.now())

  // Restore session on mount
  useEffect(() => {
    if (persistedSession && !user) {
      setUser(persistedSession)
      
      // Update session info on restore
      if (sessionInfo) {
        setSessionInfo({
          ...sessionInfo,
          lastActivity: Date.now()
        })
      }
    }
  }, [persistedSession, user, sessionInfo, setSessionInfo])

  // Update activity timestamp
  const updateActivity = () => {
    const now = Date.now()
    setLastActivity(now)
    
    if (sessionInfo) {
      setSessionInfo({
        ...sessionInfo,
        lastActivity: now
      })
    }
  }

  // Extend session duration
  const extendSession = (minutes: number = 30) => {
    const now = Date.now()
    setLastActivity(now)
    
    if (sessionInfo) {
      setSessionInfo({
        ...sessionInfo,
        lastActivity: now
      })
    }
    
    console.log(`🔄 Session extended by ${minutes} minutes`)
  }

  // Log security events
  const logSecurityEvent = (type: string, details: any = {}) => {
    if (sessionInfo) {
      const event = {
        type,
        timestamp: Date.now(),
        details
      }
      
      setSessionInfo({
        ...sessionInfo,
        securityEvents: [event, ...sessionInfo.securityEvents.slice(0, 49)]
      })
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockUser = MOCK_USERS[username]
    if (mockUser && mockUser.password === password) {
      const now = Date.now()
      const userWithLoginTime = {
        ...mockUser.user,
        lastLogin: now
      }
      
      setUser(userWithLoginTime)
      setPersistedSession(userWithLoginTime)
      
      // Initialize session info
      const newSessionInfo: SessionInfo = {
        startTime: now,
        lastActivity: now,
        loginCount: (sessionInfo?.loginCount || 0) + 1,
        securityEvents: []
      }
      setSessionInfo(newSessionInfo)
      setLastActivity(now)
      
      // Log successful login
      logSecurityEvent('login_success', {
        username,
        userAgent: navigator.userAgent,
        timestamp: now
      })
      
      return true
    }
    
    // Log failed login attempt
    if (sessionInfo) {
      logSecurityEvent('login_failed', {
        username,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })
    }
    
    return false
  }

  const logout = (reason: string = 'manual') => {
    // Log logout event
    if (sessionInfo && user) {
      logSecurityEvent('logout', {
        reason,
        sessionDuration: Date.now() - sessionInfo.startTime,
        userId: user.id,
        timestamp: Date.now()
      })
    }
    
    console.log(`🚪 User logged out: ${reason}`)
    
    setUser(null)
    setPersistedSession(null)
    setSessionInfo(null)
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    sessionInfo,
    updateActivity,
    extendSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}