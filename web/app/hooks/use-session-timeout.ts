import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { useAuth } from '@/contexts/auth-context'

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number
  warningMinutes?: number
  autoExtendOnActivity?: boolean
  onTimeout?: () => void
  onWarning?: (level: 'early' | 'urgent' | 'critical') => void
}

interface SessionTimeoutState {
  timeRemaining: number
  warningLevel: 'none' | 'early' | 'urgent' | 'critical'
  isActive: boolean
  lastActivity: number
  sessionDuration: number
}

/**
 * useSessionTimeout - Hook for managing session timeouts
 * 
 * Provides session state and controls for timeout management
 */
export function useSessionTimeout({
  timeoutMinutes = 30,
  warningMinutes = 5,
  autoExtendOnActivity = true,
  onTimeout,
  onWarning
}: UseSessionTimeoutOptions = {}) {
  const { logout, isAuthenticated } = useAuth()
  const [lastActivity, setLastActivity] = useKV('session-last-activity', Date.now())
  const [sessionStart, setSessionStart] = useKV('session-start-time', Date.now())
  
  const [state, setState] = useState<SessionTimeoutState>({
    timeRemaining: timeoutMinutes * 60 * 1000,
    warningLevel: 'none',
    isActive: isAuthenticated,
    lastActivity: Date.now(),
    sessionDuration: 0
  })

  const TIMEOUT_MS = timeoutMinutes * 60 * 1000
  const WARNING_MS = warningMinutes * 60 * 1000
  const URGENT_MS = 2 * 60 * 1000
  const CRITICAL_MS = 30 * 1000

  // Update activity timestamp
  const updateActivity = useCallback(() => {
    const now = Date.now()
    setLastActivity(now)
    
    setState(prev => ({
      ...prev,
      lastActivity: now
    }))
  }, [setLastActivity])

  // Extend session
  const extendSession = useCallback((minutes?: number) => {
    const now = Date.now()
    const extension = (minutes || timeoutMinutes) * 60 * 1000
    
    setLastActivity(now)
    setSessionStart(now)
    
    setState(prev => ({
      ...prev,
      timeRemaining: extension,
      warningLevel: 'none',
      lastActivity: now
    }))
    
    console.log(`🔄 Session extended by ${minutes || timeoutMinutes} minutes`)
  }, [timeoutMinutes, setLastActivity, setSessionStart])

  // Get formatted time
  const getFormattedTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return {
      minutes,
      seconds,
      formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }, [])

  // Force timeout
  const forceTimeout = useCallback(() => {
    console.log('🚪 Forcing session timeout')
    onTimeout?.()
    logout()
  }, [onTimeout, logout])

  // Monitor session timeout
  useEffect(() => {
    if (!isAuthenticated) return

    const checkTimeout = () => {
      const now = Date.now()
      const timeSinceActivity = now - lastActivity
      const remaining = TIMEOUT_MS - timeSinceActivity
      const duration = now - sessionStart

      let newWarningLevel: typeof state.warningLevel = 'none'
      
      if (remaining <= 0) {
        forceTimeout()
        return
      }

      if (remaining <= CRITICAL_MS) {
        newWarningLevel = 'critical'
      } else if (remaining <= URGENT_MS) {
        newWarningLevel = 'urgent'
      } else if (remaining <= WARNING_MS) {
        newWarningLevel = 'early'
      }

      setState(prev => ({
        ...prev,
        timeRemaining: remaining,
        warningLevel: newWarningLevel,
        sessionDuration: duration,
        isActive: true
      }))

      // Trigger warning callback if level changed
      if (newWarningLevel !== state.warningLevel && newWarningLevel !== 'none') {
        onWarning?.(newWarningLevel)
      }

      // Auto-extend on activity if enabled
      if (autoExtendOnActivity && newWarningLevel !== 'none' && timeSinceActivity < 5000) {
        console.log('🔄 Auto-extending session due to recent activity')
        extendSession()
      }
    }

    const interval = setInterval(checkTimeout, 1000)
    checkTimeout()

    return () => clearInterval(interval)
  }, [
    isAuthenticated, 
    lastActivity, 
    sessionStart, 
    TIMEOUT_MS, 
    WARNING_MS, 
    URGENT_MS, 
    CRITICAL_MS,
    autoExtendOnActivity,
    forceTimeout,
    extendSession,
    onWarning,
    state.warningLevel
  ])

  return {
    ...state,
    updateActivity,
    extendSession,
    forceTimeout,
    getFormattedTime,
    config: {
      timeoutMinutes,
      warningMinutes,
      autoExtendOnActivity
    }
  }
}

/**
 * useActivityTracker - Hook for tracking user activity
 */
export function useActivityTracker(onActivity?: () => void) {
  const [activityCount, setActivityCount] = useState(0)
  const [lastActivityType, setLastActivityType] = useState<string>('')

  const ACTIVITY_EVENTS = [
    'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'focus'
  ]

  const handleActivity = useCallback((event: Event) => {
    setActivityCount(prev => prev + 1)
    setLastActivityType(event.type)
    onActivity?.()
  }, [onActivity])

  useEffect(() => {
    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [handleActivity])

  return {
    activityCount,
    lastActivityType,
    reset: () => {
      setActivityCount(0)
      setLastActivityType('')
    }
  }
}

/**
 * useSessionSecurity - Hook for enhanced session security
 */
export function useSessionSecurity() {
  const [securityEvents, setSecurityEvents] = useKV<Array<{
    type: string
    timestamp: number
    details: any
  }>>('session-security-events', [])

  const logSecurityEvent = useCallback((type: string, details: any = {}) => {
    const event = {
      type,
      timestamp: Date.now(),
      details
    }
    
    setSecurityEvents(current => [event, ...current.slice(0, 49)]) // Keep last 50 events
    console.log(`🔒 Security event: ${type}`, details)
  }, [setSecurityEvents])

  const getRecentEvents = useCallback((minutes: number = 60) => {
    const cutoff = Date.now() - (minutes * 60 * 1000)
    return securityEvents.filter(event => event.timestamp > cutoff)
  }, [securityEvents])

  return {
    securityEvents,
    logSecurityEvent,
    getRecentEvents,
    clearEvents: () => setSecurityEvents([])
  }
}