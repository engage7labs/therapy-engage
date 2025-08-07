import { useState, useEffect } from 'react'
import { useKV } from '@/hooks/use-kv'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  BellRing, 
  AlertTriangle,
  CheckCircle,
  Volume2,
  VolumeX
} from 'lucide-react'

interface CompactSessionStatusProps {
  onOpenAlerts?: () => void
}

export function CompactSessionStatus({ onOpenAlerts }: CompactSessionStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Get critical alerts
  const [criticalAlerts] = useKV<any[]>('critical-alerts', [])
  const [sessionActivities] = useKV('session-activities', [])
  const [alertSettings] = useKV<any>('audio-alert-settings', { enabled: true })

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const unacknowledgedAlerts = criticalAlerts.filter(alert => !alert.acknowledged)
  const activeSessionsCount = sessionActivities.filter((s: any) => s.status === 'active').length
  const criticalSessionsCount = sessionActivities.filter((s: any) => 
    s.riskLevel === 'critical' || s.status === 'critical' || s.requiresImmediate
  ).length

  const hasActiveCriticalSituations = unacknowledgedAlerts.length > 0 || criticalSessionsCount > 0

  const getStatusIcon = () => {
    if (unacknowledgedAlerts.length > 0) {
      return alertSettings.enabled ? 
        <BellRing className="w-4 h-4 text-red-600 animate-pulse" /> :
        <BellRing className="w-4 h-4 text-red-400" />
    }
    
    if (criticalSessionsCount > 0) {
      return <AlertTriangle className="w-4 h-4 text-orange-600" />
    }
    
    if (activeSessionsCount > 0) {
      return <CheckCircle className="w-4 h-4 text-green-600" />
    }
    
    return <Bell className="w-4 h-4 text-muted-foreground" />
  }

  const getStatusText = () => {
    if (unacknowledgedAlerts.length > 0) {
      return `${unacknowledgedAlerts.length} Critical Alert${unacknowledgedAlerts.length > 1 ? 's' : ''}`
    }
    
    if (criticalSessionsCount > 0) {
      return `${criticalSessionsCount} High Risk Session${criticalSessionsCount > 1 ? 's' : ''}`
    }
    
    if (activeSessionsCount > 0) {
      return `${activeSessionsCount} Active Session${activeSessionsCount > 1 ? 's' : ''}`
    }
    
    return 'All Clear'
  }

  const getStatusVariant = () => {
    if (unacknowledgedAlerts.length > 0) return 'destructive'
    if (criticalSessionsCount > 0) return 'secondary'
    if (activeSessionsCount > 0) return 'default'
    return 'outline'
  }

  return (
    <div className="flex items-center gap-3">
      {/* Audio Status Indicator */}
      <div className="flex items-center gap-1">
        {alertSettings.enabled ? (
          <Volume2 className="w-3 h-3 text-green-600" />
        ) : (
          <VolumeX className="w-3 h-3 text-muted-foreground" />
        )}
      </div>

      {/* Current Time */}
      <div className="text-xs text-muted-foreground font-mono">
        {currentTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })}
      </div>

      {/* Status Indicator */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onOpenAlerts}
        className={`h-8 px-3 gap-2 ${
          hasActiveCriticalSituations ? 'hover:bg-red-50' : ''
        }`}
      >
        {getStatusIcon()}
        <Badge 
          variant={getStatusVariant()}
          className={`text-xs px-2 py-0 ${
            unacknowledgedAlerts.length > 0 ? 'animate-pulse' : ''
          }`}
        >
          {getStatusText()}
        </Badge>
      </Button>
    </div>
  )
}