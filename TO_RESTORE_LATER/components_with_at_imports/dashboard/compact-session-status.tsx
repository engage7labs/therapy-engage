import { useState, useEffect } from 'react'
import { useKV } from '@/hooks/use-kv'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  BellRing, 
  AlertTriangle,
  CheckCircle,
  Volume,
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

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onOpenAlerts}
      className="flex items-center gap-2 px-2 py-1 h-8 relative"
    >
      {getStatusIcon()}
      
      <div className="flex items-center gap-1 text-xs">
        {unacknowledgedAlerts.length > 0 && (
          <Badge variant="destructive" className="text-xs px-1.5 py-0 h-4">
            {unacknowledgedAlerts.length}
          </Badge>
        )}
        
        {activeSessionsCount > 0 && !unacknowledgedAlerts.length && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
            {activeSessionsCount} active
          </Badge>
        )}
        
        {!hasActiveCriticalSituations && !activeSessionsCount && (
          <span className="text-muted-foreground">
            All quiet
          </span>
        )}
      </div>
      
      {/* Audio indicator */}
      {alertSettings.enabled ? (
        <Volume className="w-3 h-3 text-muted-foreground ml-1" />
      ) : (
        <VolumeX className="w-3 h-3 text-muted-foreground ml-1" />
      )}
    </Button>
  )
}
