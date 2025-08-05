import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Video, 
  Activity,
  AlertCircle,
  Clock,
  Users
} from '@phosphor-icons/react'

interface MiniSessionStatusProps {
  onExpand?: () => void
}

export function MiniSessionStatus({ onExpand }: MiniSessionStatusProps) {
  // Same session data as the full component
  const [sessionActivities] = useKV("session-activities", [
    {
      id: "session-live-001",
      patientName: "Ana Silva",
      type: "video-call" as const,
      status: "active" as const,
      startTime: "2025-01-15T14:00:00Z",
      duration: 23,
      riskLevel: "low" as const
    },
    {
      id: "session-rec-002", 
      patientName: "Carlos Santos",
      type: "recording" as const,
      status: "paused" as const,
      startTime: "2025-01-15T15:30:00Z",
      duration: 15,
      riskLevel: "moderate" as const
    },
    {
      id: "session-wait-003",
      patientName: "Maria Oliveira", 
      type: "consultation" as const,
      status: "waiting" as const,
      startTime: "2025-01-15T16:00:00Z",
      duration: 0,
      riskLevel: "high" as const
    }
  ])

  const activeSessionsCount = sessionActivities.filter(s => s.status === 'active').length
  const criticalSessionsCount = sessionActivities.filter(s => s.riskLevel === 'critical' || s.status === 'critical').length
  const waitingSessionsCount = sessionActivities.filter(s => s.status === 'waiting').length

  // Show pulsing indicator if there are critical sessions
  const hasCritical = criticalSessionsCount > 0
  const hasActive = activeSessionsCount > 0
  const hasWaiting = waitingSessionsCount > 0

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onExpand}
      className="flex items-center gap-2 px-2 py-1 h-8 relative"
    >
      {/* Main icon with activity indicator */}
      <div className="relative">
        {hasActive ? (
          <Video className="w-4 h-4 text-green-600" />
        ) : (
          <Activity className="w-4 h-4 text-muted-foreground" />
        )}
        
        {/* Pulsing dot for critical sessions */}
        {hasCritical && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
        
        {/* Active indicator */}
        {hasActive && !hasCritical && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
        )}
      </div>

      {/* Compact status text */}
      <div className="flex items-center gap-1 text-xs">
        {activeSessionsCount > 0 && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
            {activeSessionsCount}
          </Badge>
        )}
        
        {criticalSessionsCount > 0 && (
          <Badge variant="destructive" className="text-xs px-1.5 py-0 h-4">
            {criticalSessionsCount}!
          </Badge>
        )}
        
        {waitingSessionsCount > 0 && !criticalSessionsCount && (
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-4">
            {waitingSessionsCount} waiting
          </Badge>
        )}

        {/* Show total if no active or critical */}
        {!hasActive && !hasCritical && !hasWaiting && (
          <span className="text-muted-foreground">
            {sessionActivities.length || 'No'} sessions
          </span>
        )}
      </div>
    </Button>
  )
}