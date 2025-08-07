'use client'

import { useContext } from 'react'
import { AuthContext } from '@/contexts/auth-context'
import type { AuthContextType } from '@/contexts/auth-context'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  // ###desabilitado_mvp### Handle SSR/SSG gracefully
  if (!context) {
    // During SSR/SSG, return default values instead of throwing
    if (typeof window === 'undefined') {
      return {
        user: null,
        isAuthenticated: false,
        login: async () => false,
        logout: () => {},
        sessionInfo: null,
        updateActivity: () => {},
        extendSession: () => {}
      }
    }
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
