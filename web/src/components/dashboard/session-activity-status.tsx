import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Video, 
  VideoOff, 
  Clock, 
  Users, 
  Activity,
  AlertCircle,
  CheckCircle,
  Pause,
  MoreHorizontal
} from '@phosphor-icons/react'

interface SessionActivity {
  id: string
  patientName: string
  type: 'video-call' | 'recording' | 'consultation' | 'emergency'
  status: 'active' | 'paused' | 'waiting' | 'completed' | 'critical'
  startTime: string
  duration: number
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
  alertTriggered?: boolean
  requiresImmediate?: boolean
}

interface SessionActivityStatusProps {
  onJoinSession?: (sessionId: string) => void
  onViewDetails?: (sessionId: string) => void
  onTriggerAlert?: (sessionId: string, patientName: string, message: string) => void
}

export function SessionActivityStatus({ onJoinSession, onViewDetails, onTriggerAlert }: SessionActivityStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isExpanded, setIsExpanded] = useState(false)

  // Mock current session activities - in real app this would come from real-time data
  const [sessionActivities] = useKV("session-activities", [
    {
      id: "session-live-001",
      patientName: "Ana Silva",
      type: "video-call" as const,
      status: "active" as const,
      startTime: "2025-01-15T14:00:00Z",
      duration: 23,
      riskLevel: "low" as const,
      alertTriggered: false,
      requiresImmediate: false
    },
    {
      id: "session-rec-002", 
      patientName: "Carlos Santos",
      type: "recording" as const,
      status: "paused" as const,
      startTime: "2025-01-15T15:30:00Z",
      duration: 15,
      riskLevel: "moderate" as const,
      alertTriggered: false,
      requiresImmediate: false
    },
    {
      id: "session-wait-003",
      patientName: "Maria Oliveira", 
      type: "emergency" as const,
      status: "critical" as const,
      startTime: "2025-01-15T16:00:00Z",
      duration: 0,
      riskLevel: "critical" as const,
      alertTriggered: true,
      requiresImmediate: true
    }
  ])

  // Update current time every minute for duration calculations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const getStatusIcon = (activity: SessionActivity) => {
    switch (activity.status) {
      case 'active':
        return activity.type === 'video-call' ? 
          <Video className="w-3 h-3 text-green-600" /> : 
          <Activity className="w-3 h-3 text-green-600" />
      case 'paused':
        return <Pause className="w-3 h-3 text-amber-600" />
      case 'waiting':
        return <Clock className="w-3 h-3 text-blue-600" />
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-gray-500" />
      case 'critical':
        return <AlertCircle className="w-3 h-3 text-red-600" />
      default:
        return <Clock className="w-3 h-3 text-gray-400" />
    }
  }

  const getStatusColor = (status: SessionActivity['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300'
      case 'paused': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'waiting': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'completed': return 'bg-gray-100 text-gray-600 border-gray-300'
      case 'critical': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  const getRiskIndicator = (riskLevel: SessionActivity['riskLevel'], requiresImmediate?: boolean) => {
    if (requiresImmediate) {
      return <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
    }
    switch (riskLevel) {
      case 'critical': return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      case 'high': return <div className="w-2 h-2 bg-orange-500 rounded-full" />
      case 'moderate': return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      case 'low': return <div className="w-2 h-2 bg-green-500 rounded-full" />
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const activeSessionsCount = sessionActivities.filter(s => s.status === 'active').length
  const criticalSessionsCount = sessionActivities.filter(s => s.riskLevel === 'critical' || s.status === 'critical' || s.requiresImmediate).length
  const immediateAttentionCount = sessionActivities.filter(s => s.requiresImmediate).length

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Session Activity</span>
            {immediateAttentionCount > 0 && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0.5 animate-pulse">
                {immediateAttentionCount} URGENT
              </Badge>
            )}
            {criticalSessionsCount > 0 && immediateAttentionCount === 0 && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                {criticalSessionsCount} Critical
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {activeSessionsCount} Active
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Quick Status Indicators */}
        <div className="flex items-center gap-2 mb-3">
          {sessionActivities.slice(0, 3).map((activity) => (
            <div 
              key={activity.id}
              className={`flex items-center gap-1.5 text-xs border rounded-lg px-2 py-1 ${
                activity.requiresImmediate 
                  ? 'bg-red-50 border-red-300 animate-pulse' 
                  : 'bg-card'
              }`}
            >
              {getStatusIcon(activity)}
              <span className="font-medium truncate max-w-[60px]">
                {activity.patientName.split(' ')[0]}
              </span>
              {getRiskIndicator(activity.riskLevel, activity.requiresImmediate)}
            </div>
          ))}
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="space-y-2 pt-2 border-t">
            {sessionActivities.map((activity) => (
              <div 
                key={activity.id}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  activity.requiresImmediate 
                    ? 'bg-red-50 border border-red-200 animate-pulse' 
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2 flex-1">
                  {getStatusIcon(activity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {activity.patientName}
                      </span>
                      {getRiskIndicator(activity.riskLevel, activity.requiresImmediate)}
                      {activity.requiresImmediate && (
                        <Badge variant="destructive" className="text-xs px-1 py-0">
                          URGENT
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-1.5 py-0 ${getStatusColor(activity.status)}`}
                      >
                        {activity.status}
                      </Badge>
                      <span>{formatDuration(activity.duration)}</span>
                      <span className="capitalize">{activity.type.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {activity.requiresImmediate && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onJoinSession?.(activity.id)}
                      className="h-6 text-xs px-2 animate-pulse"
                    >
                      URGENT
                    </Button>
                  )}
                  {activity.status === 'active' && !activity.requiresImmediate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onJoinSession?.(activity.id)}
                      className="h-6 text-xs px-2"
                    >
                      Join
                    </Button>
                  )}
                  {activity.status === 'waiting' && !activity.requiresImmediate && (
                    <Button
                      variant="default"
                      size="sm" 
                      onClick={() => onJoinSession?.(activity.id)}
                      className="h-6 text-xs px-2"
                    >
                      Start
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails?.(activity.id)}
                    className="h-6 w-6 p-0"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}

            {sessionActivities.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                <VideoOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No active sessions
              </div>
            )}
          </div>
        )}

        {/* Summary Stats */}
        {!isExpanded && sessionActivities.length > 3 && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            +{sessionActivities.length - 3} more sessions
          </div>
        )}
      </CardContent>
    </Card>
  )
}