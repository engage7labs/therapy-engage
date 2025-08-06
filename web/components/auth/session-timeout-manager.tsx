import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/auth-context'
import { useKV } from '@/hooks/use-kv'
import { Clock, Shield, AlertTriangle, Activity, Coffee } from 'lucide-react'

interface SessionTimeoutManagerProps {
  warningTimeMinutes?: number // Default: 5 minutes before timeout
  sessionTimeoutMinutes?: number // Default: 30 minutes
  autoExtendOnActivity?: boolean // Default: true for clinical environments
  showActivityIndicator?: boolean // Default: true
}

/**
 * SessionTimeoutManager - Clinical-grade session management
 * 
 * Features:
 * - Automatic session extension on user activity
 * - Progressive warning system (5min, 2min, 30sec)
 * - Emergency session preservation for active therapy
 * - Visual countdown and activity monitoring
 * - Graceful logout with confirmation
 */
export function SessionTimeoutManager({
  warningTimeMinutes = 5,
  sessionTimeoutMinutes = 30,
  autoExtendOnActivity = true,
  showActivityIndicator = true
}: SessionTimeoutManagerProps) {
  const { logout, user, isAuthenticated } = useAuth()
  
  // Session state management
  const [lastActivity, setLastActivity] = useKV('session-last-activity', Date.now())
  const [sessionStartTime, setSessionStartTime] = useKV('session-start-time', Date.now())
  const [warningLevel, setWarningLevel] = useState<'none' | 'early' | 'urgent' | 'critical'>('none')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const [activityCount, setActivityCount] = useState(0)
  const [isInActiveSession, setIsInActiveSession] = useKV('active-therapy-session', false)

  // Session timeout configuration
  const SESSION_TIMEOUT_MS = sessionTimeoutMinutes * 60 * 1000
  const WARNING_TIME_MS = warningTimeMinutes * 60 * 1000
  const URGENT_WARNING_MS = 2 * 60 * 1000 // 2 minutes
  const CRITICAL_WARNING_MS = 30 * 1000 // 30 seconds

  // Activity tracking events
  const ACTIVITY_EVENTS = [
    'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'
  ]

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    const now = Date.now()
    setLastActivity(now)
    setActivityCount(prev => prev + 1)
    
    // Auto-extend session if enabled and user is active
    if (autoExtendOnActivity && warningLevel !== 'none') {
      console.log('🔄 Auto-extending session due to user activity')
      setWarningLevel('none')
      setShowWarningDialog(false)
    }
  }, [autoExtendOnActivity, warningLevel, setLastActivity])

  // Extend session manually
  const extendSession = useCallback(() => {
    const now = Date.now()
    setLastActivity(now)
    setSessionStartTime(now)
    setWarningLevel('none')
    setShowWarningDialog(false)
    console.log('⏰ Session extended manually')
  }, [setLastActivity, setSessionStartTime])

  // Force logout with confirmation
  const handleForceLogout = useCallback(() => {
    if (isInActiveSession) {
      // Extra confirmation for active therapy sessions
      const confirmLogout = window.confirm(
        'Warning: You are currently in an active therapy session. Are you sure you want to logout? This may interrupt patient care.'
      )
      if (!confirmLogout) {
        extendSession()
        return
      }
    }
    
    console.log('🚪 Session expired - logging out')
    setShowWarningDialog(false)
    logout()
  }, [isInActiveSession, extendSession, logout])

  // Setup activity listeners
  useEffect(() => {
    if (!isAuthenticated) return

    const handleActivity = () => updateActivity()
    
    // Add activity listeners
    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      // Cleanup listeners
      ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated, updateActivity])

  // Session timeout monitoring
  useEffect(() => {
    if (!isAuthenticated) return

    const checkSessionTimeout = () => {
      const now = Date.now()
      const timeSinceActivity = now - lastActivity
      const remaining = SESSION_TIMEOUT_MS - timeSinceActivity

      setTimeRemaining(remaining)

      if (remaining <= 0) {
        // Session expired
        setWarningLevel('critical')
        handleForceLogout()
        return
      }

      // Update warning levels
      if (remaining <= CRITICAL_WARNING_MS) {
        setWarningLevel('critical')
        setShowWarningDialog(true)
      } else if (remaining <= URGENT_WARNING_MS) {
        setWarningLevel('urgent')
        setShowWarningDialog(true)
      } else if (remaining <= WARNING_TIME_MS) {
        setWarningLevel('early')
        if (!isInActiveSession) { // Don't interrupt active sessions with early warnings
          setShowWarningDialog(true)
        }
      } else {
        setWarningLevel('none')
        setShowWarningDialog(false)
      }
    }

    // Check every 5 seconds
    const interval = setInterval(checkSessionTimeout, 5000)
    checkSessionTimeout() // Initial check

    return () => clearInterval(interval)
  }, [isAuthenticated, lastActivity, SESSION_TIMEOUT_MS, WARNING_TIME_MS, handleForceLogout, isInActiveSession])

  // Don't render if not authenticated
  if (!isAuthenticated) return null

  // Format time remaining
  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Get warning message based on level
  const getWarningMessage = () => {
    switch (warningLevel) {
      case 'critical':
        return 'Your session will expire in 30 seconds! Please extend immediately.'
      case 'urgent':
        return 'Your session will expire in 2 minutes. Please extend your session.'
      case 'early':
        return `Your session will expire in ${Math.ceil(timeRemaining / 60000)} minutes.`
      default:
        return ''
    }
  }

  // Get warning icon and color
  const getWarningProps = () => {
    switch (warningLevel) {
      case 'critical':
        return { icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' }
      case 'urgent':
        return { icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200' }
      case 'early':
        return { icon: Coffee, color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200' }
      default:
        return { icon: Shield, color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' }
    }
  }

  const { icon: WarningIcon, color, bgColor } = getWarningProps()

  return (
    <>
      {/* Activity Indicator */}
      {showActivityIndicator && warningLevel !== 'none' && (
        <div className={`fixed top-4 right-4 z-50 p-3 rounded-lg border ${bgColor} shadow-lg`}>
          <div className="flex items-center gap-2">
            <WarningIcon className={`h-4 w-4 ${color}`} />
            <div className="text-sm font-medium">
              Session: {formatTimeRemaining(timeRemaining)}
            </div>
            {warningLevel === 'critical' && (
              <Activity className="h-4 w-4 text-red-600 animate-pulse" />
            )}
          </div>
          {timeRemaining > 0 && (
            <Progress 
              value={(timeRemaining / SESSION_TIMEOUT_MS) * 100} 
              className="mt-2 h-1"
            />
          )}
        </div>
      )}

      {/* Warning Dialog */}
      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <WarningIcon className={`h-5 w-5 ${color}`} />
              Session Timeout Warning
            </DialogTitle>
            <DialogDescription>
              {getWarningMessage()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Session info */}
            <Alert className={bgColor}>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Time remaining:</span>
                    <span className="font-mono font-medium">
                      {formatTimeRemaining(timeRemaining)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Session duration:</span>
                    <span className="font-mono">
                      {Math.floor((Date.now() - sessionStartTime) / 60000)} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activity events:</span>
                    <span className="font-mono">{activityCount}</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Session progress</span>
                <span>{Math.round((timeRemaining / SESSION_TIMEOUT_MS) * 100)}%</span>
              </div>
              <Progress 
                value={(timeRemaining / SESSION_TIMEOUT_MS) * 100}
                className={`h-2 ${warningLevel === 'critical' ? 'animate-pulse' : ''}`}
              />
            </div>

            {/* Active session warning */}
            {isInActiveSession && (
              <Alert className="border-blue-200 bg-blue-50">
                <Activity className="h-4 w-4" />
                <AlertDescription>
                  <strong>Active Therapy Session Detected</strong>
                  <br />
                  Your session will be automatically extended to prevent interruption of patient care.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleForceLogout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Logout Now
            </Button>
            <Button
              onClick={extendSession}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Extend Session ({sessionTimeoutMinutes}m)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}