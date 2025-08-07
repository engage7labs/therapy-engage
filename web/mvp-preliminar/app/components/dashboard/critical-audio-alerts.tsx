import { useState, useEffect, useRef } from 'react'
import { useKV } from '@/hooks/use-kv'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useTheme } from '../../contexts/theme-context'
import { 
  Bell, 
  BellOff, 
  Volume2, 
  VolumeX, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Clock,
  User
} from 'lucide-react'

interface CriticalAlert {
  id: string
  patientName: string
  patientId: string
  alertType: 'risk-escalation' | 'emergency-session' | 'missed-session' | 'medication-concern' | 'safety-alert'
  severity: 'high' | 'critical' | 'urgent'
  message: string
  timestamp: string
  acknowledged: boolean
  sessionId?: string
}

interface AudioAlertSettings {
  enabled: boolean
  volume: number
  criticalAlertSound: 'chime' | 'urgent' | 'medical' | 'gentle'
  repeatInterval: number // seconds
  maxRepeats: number
  muteUntil?: string
}

interface CriticalAudioAlertsProps {
  readonly onNavigateToSession?: (sessionId: string) => void
  readonly onAcknowledgeAlert?: (alertId: string) => void
}

export function CriticalAudioAlerts({ onNavigateToSession, onAcknowledgeAlert }: CriticalAudioAlertsProps) {
  const { t } = useTheme()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [testingSound, setTestingSound] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const activeAlertsRef = useRef<Set<string>>(new Set())
  const playbackTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Audio alert settings
  const [alertSettings, setAlertSettings] = useKV<AudioAlertSettings>('audio-alert-settings', {
    enabled: true,
    volume: 0.7,
    criticalAlertSound: 'medical',
    repeatInterval: 30,
    maxRepeats: 5,
  })

  // Critical alerts state
  const [criticalAlerts, setCriticalAlerts] = useKV<CriticalAlert[]>('critical-alerts', [
    {
      id: 'alert-001',
      patientName: 'Maria Oliveira',
      patientId: 'patient-003',
      alertType: 'safety-alert',
      severity: 'critical',
      message: 'Patient expressed self-harm ideation during last session. Immediate safety assessment required.',
      timestamp: new Date().toISOString(),
      acknowledged: false,
      sessionId: 'session-emergency-001'
    },
    {
      id: 'alert-002', 
      patientName: 'Carlos Santos',
      patientId: 'patient-002',
      alertType: 'missed-session',
      severity: 'high',
      message: 'Patient missed scheduled session. History of depression requires follow-up within 24 hours.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      acknowledged: false
    }
  ])

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current ??= new (window.AudioContext || (window as any).webkitAudioContext)()
  }, [])

  // Generate medical alert tones using Web Audio API
  const generateAlertTone = (frequency: number, duration: number, type: 'sine' | 'square' = 'sine') => {
    return new Promise<void>((resolve) => {
      if (!audioContextRef.current) return resolve()

      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
      gainNode.gain.linearRampToValueAtTime(alertSettings.volume * 0.3, audioContextRef.current.currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)
      
      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + duration)
      
      oscillator.onended = () => resolve()
    })
  }

  // Play different alert sounds based on severity and type
  const playAlertSound = async (alertType: CriticalAlert['alertType'], severity: CriticalAlert['severity']) => {
    if (!alertSettings.enabled || !audioContextRef.current) return

    // Resume audio context if suspended (required for user interaction)
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }

    switch (alertSettings.criticalAlertSound) {
      case 'medical':
        // Medical equipment-style beeping pattern
        if (severity === 'critical') {
          // Rapid triple beep for critical alerts
          await generateAlertTone(800, 0.2)
          await new Promise(resolve => setTimeout(resolve, 100))
          await generateAlertTone(800, 0.2)
          await new Promise(resolve => setTimeout(resolve, 100))
          await generateAlertTone(800, 0.2)
        } else {
          // Single beep for high priority
          await generateAlertTone(600, 0.4)
        }
        break
        
      case 'urgent':
        // Alarm-style urgent sound
        await generateAlertTone(1000, 0.3, 'square')
        await new Promise(resolve => setTimeout(resolve, 200))
        await generateAlertTone(1200, 0.3, 'square')
        break
        
      case 'gentle':
        // Gentle but attention-getting chime
        await generateAlertTone(523.25, 0.5) // C5
        await new Promise(resolve => setTimeout(resolve, 100))
        await generateAlertTone(659.25, 0.5) // E5
        break
        
      case 'chime':
      default:
        // Pleasant but noticeable chime sequence
        await generateAlertTone(523.25, 0.3) // C5
        await new Promise(resolve => setTimeout(resolve, 100))
        await generateAlertTone(698.46, 0.3) // F5
        await new Promise(resolve => setTimeout(resolve, 100))
        await generateAlertTone(783.99, 0.4) // G5
        break
    }
  }

  // Setup repeat alerts for critical/urgent alerts
  const setupRepeatAlert = (alert: CriticalAlert) => {
    let repeatCount = 0
    const repeatTimer = setInterval(() => {
      repeatCount++
      if (repeatCount >= alertSettings.maxRepeats) {
        clearInterval(repeatTimer)
        playbackTimersRef.current.delete(alert.id)
        return
      }
      
      // Check if alert is still unacknowledged
      const currentAlert = criticalAlerts.find(a => a.id === alert.id)
      if (currentAlert && !currentAlert.acknowledged) {
        playAlertSound(alert.alertType, alert.severity)
      } else {
        clearInterval(repeatTimer)
        playbackTimersRef.current.delete(alert.id)
      }
    }, alertSettings.repeatInterval * 1000)
    
    playbackTimersRef.current.set(alert.id, repeatTimer)
  }

  // Handle new critical alerts
  useEffect(() => {
    const unacknowledgedAlerts = criticalAlerts.filter(alert => !alert.acknowledged)
    
    unacknowledgedAlerts.forEach(alert => {
      if (!activeAlertsRef.current.has(alert.id)) {
        activeAlertsRef.current.add(alert.id)
        
        // Check if we're in mute period
        const now = new Date()
        if (alertSettings.muteUntil && new Date(alertSettings.muteUntil) > now) {
          return
        }
        
        // Play initial alert
        playAlertSound(alert.alertType, alert.severity)
        
        // Set up repeat alerts for critical/urgent alerts
        if (alert.severity === 'critical' || alert.severity === 'urgent') {
          setupRepeatAlert(alert)
        }
      }
    })

    // Clean up active alerts that have been acknowledged
    activeAlertsRef.current.forEach(alertId => {
      const alert = criticalAlerts.find(a => a.id === alertId)
      if (!alert || alert.acknowledged) {
        activeAlertsRef.current.delete(alertId)
        const timer = playbackTimersRef.current.get(alertId)
        if (timer) {
          clearInterval(timer)
          playbackTimersRef.current.delete(alertId)
        }
      }
    })
  }, [criticalAlerts, alertSettings])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      playbackTimersRef.current.forEach(timer => clearInterval(timer))
      playbackTimersRef.current.clear()
    }
  }, [])

  const acknowledgeAlert = (alertId: string) => {
    setCriticalAlerts(
      criticalAlerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    )
    onAcknowledgeAlert?.(alertId)
  }

  const muteAlertsTemporarily = (minutes: number) => {
    const muteUntil = new Date(Date.now() + minutes * 60000).toISOString()
    setAlertSettings({ ...alertSettings, muteUntil })
  }

  const testAlertSound = async () => {
    setTestingSound(true)
    await playAlertSound('safety-alert', 'critical')
    setTestingSound(false)
  }

  const getAlertIcon = (alertType: CriticalAlert['alertType']) => {
    switch (alertType) {
      case 'safety-alert':
      case 'emergency-session':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'missed-session':
        return <Clock className="w-4 h-4 text-orange-600" />
      case 'risk-escalation':
        return <User className="w-4 h-4 text-yellow-600" />
      default:
        return <Bell className="w-4 h-4 text-blue-600" />
    }
  }

  const getSeverityBadge = (severity: CriticalAlert['severity']) => {
    const variants = {
      critical: 'destructive',
      urgent: 'destructive', 
      high: 'secondary'
    } as const
    return <Badge variant={variants[severity]} className="text-xs">{severity.toUpperCase()}</Badge>
  }

  const unacknowledgedAlerts = criticalAlerts.filter(alert => !alert.acknowledged)
  const isMuted = alertSettings.muteUntil && new Date(alertSettings.muteUntil) > new Date()

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {alertSettings.enabled && !isMuted ? (
              <Bell className="w-4 h-4 text-primary" />
            ) : (
              <BellOff className="w-4 h-4 text-muted-foreground" />
            )}
            Critical Alerts
            {unacknowledgedAlerts.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unacknowledgedAlerts.length}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            {isMuted && (
              <Badge variant="outline" className="text-xs">
                Muted
              </Badge>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="h-6 w-6 p-0"
                >
                  <Settings className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-medium">Audio Alert Settings</p>
                  <p className="text-xs opacity-80">Configure sound alerts for critical patient situations</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Settings Panel */}
        {isSettingsOpen && (
          <div className="space-y-4 p-3 bg-muted/30 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Audio Alerts</span>
              <Switch
                checked={alertSettings.enabled}
                onCheckedChange={(enabled) => 
                  setAlertSettings({ ...alertSettings, enabled })
                }
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Volume</span>
                <div className="flex items-center gap-2">
                  <VolumeX className="w-3 h-3" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={alertSettings.volume}
                    onChange={(e) => 
                      setAlertSettings({ 
                        ...alertSettings, 
                        volume: parseFloat(e.target.value) 
                      })
                    }
                    className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    aria-label={t('settings.volume')}
                  />
                  <Volume2 className="w-3 h-3" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={testAlertSound}
                      disabled={testingSound}
                      className="text-xs h-6"
                    >
                      {testingSound ? 'Playing...' : 'Test Sound'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Test critical alert sound at current volume level</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => muteAlertsTemporarily(30)}
                      className="text-xs h-6"
                    >
                      Mute 30min
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Temporarily disable audio alerts for 30 minutes</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        )}

        {/* Active Critical Alerts */}
        <div className="space-y-3">
          {unacknowledgedAlerts.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              No critical alerts
            </div>
          ) : (
            unacknowledgedAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 border rounded-lg space-y-2 ${
                  alert.severity === 'critical' 
                    ? 'border-red-300 bg-red-50/50' 
                    : 'border-orange-300 bg-orange-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.alertType)}
                    <span className="font-medium text-sm">{alert.patientName}</span>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {alert.sessionId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigateToSession?.(alert.sessionId!)}
                        className="h-6 text-xs px-2"
                      >
                        View Session
                      </Button>
                    )}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="h-6 text-xs px-2"
                    >
                      Acknowledge
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 leading-relaxed">
                  {alert.message}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="capitalize">
                    {alert.alertType.replace('-', ' ')}
                  </span>
                  <span>
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}