import { useState } from 'react'
import { useKV } from '@/hooks/use-kv'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Video, 
  VideoOff, 
  Activity,
  AlertCircle,
  X,
  Minimize2
} from 'lucide-react'

interface FloatingSessionMonitorProps {
  readonly onClose?: () => void
  readonly onNavigateToSession?: (sessionId: string) => void
}

export function FloatingSessionMonitor({ onClose, onNavigateToSession }: FloatingSessionMonitorProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  // Same session data as the main component
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
  const criticalSessionsCount = sessionActivities.filter(s => s.riskLevel === 'high').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Video className="w-3 h-3 text-green-600" />
      case 'paused': return <Activity className="w-3 h-3 text-amber-600" />
      case 'waiting': return <Activity className="w-3 h-3 text-blue-600" />
      case 'critical': return <AlertCircle className="w-3 h-3 text-red-600" />
      default: return <Activity className="w-3 h-3 text-gray-400" />
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

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-12 h-12 cursor-pointer hover:scale-105 transition-transform shadow-lg border-2">
          <CardContent className="p-0 h-full flex items-center justify-center relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
              className="h-full w-full p-0 relative"
            >
              <Activity className="w-5 h-5 text-primary" />
              {activeSessionsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                >
                  {activeSessionsCount}
                </Badge>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Live Sessions
              {criticalSessionsCount > 0 && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5 animate-pulse">
                  {criticalSessionsCount} Critical
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0"
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-2">
          {sessionActivities.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              <VideoOff className="w-6 h-6 mx-auto mb-2 opacity-50" />
              No active sessions
            </div>
          ) : (
            sessionActivities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between p-2 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {activity.patientName}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs px-1 py-0 h-4 capitalize"
                      >
                        {activity.status}
                      </Badge>
                      <span>{formatDuration(activity.duration)}</span>
                      {activity.riskLevel === 'high' && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateToSession?.(activity.id)}
                  className="h-6 text-xs px-2 shrink-0"
                >
                  {activity.status === 'waiting' ? 'Start' : 'Join'}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}