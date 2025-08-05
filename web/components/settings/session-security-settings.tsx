import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useKV } from '../hooks/use-kv'
import { useAuth } from '@/contexts/auth-context'
import { useSessionTimeout, useSessionSecurity } from '@/hooks/use-session-timeout'
import { 
  Clock, 
  Shield, 
  Activity, 
  Settings, 
  Lock, 
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react'

interface SessionConfig {
  timeoutMinutes: number
  warningMinutes: number
  autoExtendOnActivity: boolean
  showActivityIndicator: boolean
  enableSecurityLogging: boolean
  maxConcurrentSessions: number
}

/**
 * SessionSecuritySettings - Advanced session configuration
 * 
 * Allows therapists to customize session timeout behavior
 * based on their workflow and security requirements
 */
export function SessionSecuritySettings() {
  const { user, sessionInfo } = useAuth()
  const { securityEvents, logSecurityEvent, getRecentEvents } = useSessionSecurity()
  
  // Session configuration
  const [config, setConfig] = useKV<SessionConfig>('session-config', {
    timeoutMinutes: user?.role === 'therapist' ? 30 : 60,
    warningMinutes: 5,
    autoExtendOnActivity: true,
    showActivityIndicator: true,
    enableSecurityLogging: true,
    maxConcurrentSessions: 1
  })

  const [tempConfig, setTempConfig] = useState<SessionConfig>(config)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Session timeout hook for live data
  const sessionTimeout = useSessionTimeout({
    timeoutMinutes: config.timeoutMinutes,
    warningMinutes: config.warningMinutes,
    autoExtendOnActivity: config.autoExtendOnActivity,
    onWarning: (level) => {
      logSecurityEvent('session_timeout_warning', { level })
    }
  })

  // Update temp config and track changes
  const updateTempConfig = (key: keyof SessionConfig, value: any) => {
    setTempConfig(prev => ({ ...prev, [key]: value }))
    setHasUnsavedChanges(true)
  }

  // Save configuration
  const saveConfig = () => {
    setConfig(tempConfig)
    setHasUnsavedChanges(false)
    logSecurityEvent('session_config_updated', tempConfig)
    console.log('💾 Session configuration saved')
  }

  // Reset to defaults
  const resetToDefaults = () => {
    const defaults: SessionConfig = {
      timeoutMinutes: user?.role === 'therapist' ? 30 : 60,
      warningMinutes: 5,
      autoExtendOnActivity: true,
      showActivityIndicator: true,
      enableSecurityLogging: true,
      maxConcurrentSessions: 1
    }
    setTempConfig(defaults)
    setHasUnsavedChanges(true)
  }

  // Get security level badge
  const getSecurityLevel = () => {
    const recentEvents = getRecentEvents(60)
    const failedLogins = recentEvents.filter(e => e.type === 'login_failed').length
    
    if (failedLogins > 3) return { level: 'High Risk', color: 'destructive' }
    if (failedLogins > 1) return { level: 'Medium Risk', color: 'warning' }
    return { level: 'Secure', color: 'default' }
  }

  const securityLevel = getSecurityLevel()

  return (
    <div className="space-y-6">
      {/* Current Session Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Current Session Status
          </CardTitle>
          <CardDescription>
            Real-time information about your active session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Time Remaining</Label>
              <div className="text-2xl font-mono">
                {sessionTimeout.getFormattedTime(sessionTimeout.timeRemaining).formatted}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">Session Duration</Label>
              <div className="text-2xl font-mono">
                {Math.floor(sessionTimeout.sessionDuration / 60000)}m
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">Warning Level</Label>
              <Badge variant={
                sessionTimeout.warningLevel === 'critical' ? 'destructive' :
                sessionTimeout.warningLevel === 'urgent' ? 'secondary' :
                sessionTimeout.warningLevel === 'early' ? 'outline' : 'default'
              }>
                {sessionTimeout.warningLevel === 'none' ? 'Normal' : sessionTimeout.warningLevel}
              </Badge>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">Security Level</Label>
              <Badge variant={securityLevel.color as any}>
                {securityLevel.level}
              </Badge>
            </div>
          </div>

          {sessionInfo && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <div>Session started: {new Date(sessionInfo.startTime).toLocaleString()}</div>
                  <div>Last activity: {new Date(sessionInfo.lastActivity).toLocaleString()}</div>
                  <div>Login count: {sessionInfo.loginCount}</div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Session Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Session Configuration
          </CardTitle>
          <CardDescription>
            Customize session timeout behavior for your workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timeout Settings */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">Session Timeout (minutes)</Label>
                <Input
                  id="timeout"
                  type="number"
                  min="5"
                  max="240"
                  value={tempConfig.timeoutMinutes}
                  onChange={(e) => updateTempConfig('timeoutMinutes', parseInt(e.target.value))}
                />
                <div className="text-sm text-muted-foreground">
                  Recommended: {user?.role === 'therapist' ? '30' : '60'} minutes
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warning">Warning Time (minutes)</Label>
                <Input
                  id="warning"
                  type="number"
                  min="1"
                  max="30"
                  value={tempConfig.warningMinutes}
                  onChange={(e) => updateTempConfig('warningMinutes', parseInt(e.target.value))}
                />
                <div className="text-sm text-muted-foreground">
                  Show warning before timeout
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-sessions">Max Concurrent Sessions</Label>
              <Input
                id="max-sessions"
                type="number"
                min="1"
                max="5"
                value={tempConfig.maxConcurrentSessions}
                onChange={(e) => updateTempConfig('maxConcurrentSessions', parseInt(e.target.value))}
              />
              <div className="text-sm text-muted-foreground">
                Limit simultaneous logins for security
              </div>
            </div>
          </div>

          <Separator />

          {/* Behavior Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Behavior Settings</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-extend on Activity</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically extend session when user is active
                </div>
              </div>
              <Switch
                checked={tempConfig.autoExtendOnActivity}
                onCheckedChange={(checked) => updateTempConfig('autoExtendOnActivity', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Activity Indicator</Label>
                <div className="text-sm text-muted-foreground">
                  Display session countdown in corner
                </div>
              </div>
              <Switch
                checked={tempConfig.showActivityIndicator}
                onCheckedChange={(checked) => updateTempConfig('showActivityIndicator', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Security Logging</Label>
                <div className="text-sm text-muted-foreground">
                  Track login attempts and security events
                </div>
              </div>
              <Switch
                checked={tempConfig.enableSecurityLogging}
                onCheckedChange={(checked) => updateTempConfig('enableSecurityLogging', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Save Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={saveConfig} 
              disabled={!hasUnsavedChanges}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Save Configuration
            </Button>
            <Button 
              variant="outline" 
              onClick={resetToDefaults}
            >
              Reset to Defaults
            </Button>
          </div>

          {hasUnsavedChanges && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have unsaved changes. Click "Save Configuration" to apply them.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Security Events Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
          <CardDescription>
            Last 10 security-related events for this session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {securityEvents.slice(0, 10).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{event.type.replace('_', ' ')}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            
            {securityEvents.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                No security events recorded
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => sessionTimeout.extendSession(15)}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Extend 15min
            </Button>
            <Button 
              variant="outline" 
              onClick={() => sessionTimeout.extendSession(30)}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Extend 30min
            </Button>
            <Button 
              variant="outline" 
              onClick={() => sessionTimeout.extendSession(60)}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Extend 1hr
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}