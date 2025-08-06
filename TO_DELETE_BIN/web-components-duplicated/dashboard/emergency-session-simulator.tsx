import { useState, useEffect } from 'react'
import { useKV } from '@/hooks/use-kv'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Siren, 
  Play, 
  Pause, 
  RotateCcw,
  AlertTriangle,
  Timer,
  Users
} from 'lucide-react'

interface EmergencyScenario {
  id: string
  name: string
  description: string
  patientName: string
  patientId: string
  severity: 'high' | 'critical' | 'urgent'
  alertType: 'risk-escalation' | 'emergency-session' | 'missed-session' | 'medication-concern' | 'safety-alert'
  triggerDelay: number // seconds
  message: string
}

interface EmergencySimulatorProps {
  onTriggerAlert?: (alert: {
    id: string
    patientName: string
    patientId: string
    alertType: string
    severity: string
    message: string
    timestamp: string
    acknowledged: boolean
    sessionId?: string
  }) => void
}

export function EmergencySessionSimulator({ onTriggerAlert }: EmergencySimulatorProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentScenario, setCurrentScenario] = useState<EmergencyScenario | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [simulationCount, setSimulationCount] = useState(0)

  // Emergency scenarios for testing
  const emergencyScenarios: EmergencyScenario[] = [
    {
      id: 'scenario-001',
      name: 'Suicide Risk Assessment',
      description: 'Patient expresses active suicidal ideation during video session',
      patientName: 'Maria Oliveira',
      patientId: 'patient-003',
      severity: 'critical',
      alertType: 'safety-alert',
      triggerDelay: 15,
      message: 'CRITICAL: Patient expressed active suicidal ideation with specific plan. Immediate safety intervention required. Contact emergency services if patient cannot be reached within 5 minutes.'
    },
    {
      id: 'scenario-002',
      name: 'Panic Attack Emergency',
      description: 'Patient experiencing severe panic attack, hyperventilating',
      patientName: 'Carlos Santos',
      patientId: 'patient-002',
      severity: 'urgent',
      alertType: 'emergency-session',
      triggerDelay: 30,
      message: 'Patient experiencing severe panic symptoms with hyperventilation. Requires immediate grounding techniques and potential medical evaluation.'
    },
    {
      id: 'scenario-003',
      name: 'High-Risk Patient No-Show',
      description: 'Critical patient missed scheduled session without notice',
      patientName: 'Ana Silva',
      patientId: 'patient-001',
      severity: 'high',
      alertType: 'missed-session',
      triggerDelay: 45,
      message: 'High-risk patient missed scheduled session. Previous history of self-harm requires immediate welfare check within 2 hours.'
    },
    {
      id: 'scenario-004',
      name: 'Medication Crisis',
      description: 'Patient reports stopping antidepressants abruptly',
      patientName: 'Luis Rodriguez',
      patientId: 'patient-004',
      severity: 'urgent',
      alertType: 'medication-concern',
      triggerDelay: 20,
      message: 'Patient discontinued antidepressant medication without medical supervision. Risk of withdrawal symptoms and mood destabilization. Immediate psychiatric consultation required.'
    },
    {
      id: 'scenario-005',
      name: 'Domestic Violence Disclosure',
      description: 'Patient discloses active domestic violence situation',
      patientName: 'Elena Martinez',
      patientId: 'patient-005',
      severity: 'critical',
      alertType: 'safety-alert',
      triggerDelay: 10,
      message: 'URGENT: Patient disclosed active domestic violence with immediate physical danger. Safety planning and potential protective services involvement required NOW.'
    }
  ]

  const [criticalAlerts, setCriticalAlerts] = useKV<any[]>('critical-alerts', [])

  // Timer countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (isRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    } else if (isRunning && timeRemaining === 0 && currentScenario) {
      // Trigger the alert
      triggerEmergencyAlert(currentScenario)
      setIsRunning(false)
      setCurrentScenario(null)
    }
    
    return () => clearTimeout(timer)
  }, [isRunning, timeRemaining, currentScenario])

  const triggerEmergencyAlert = (scenario: EmergencyScenario) => {
    const newAlert = {
      id: `emergency-${Date.now()}`,
      patientName: scenario.patientName,
      patientId: scenario.patientId,
      alertType: scenario.alertType,
      severity: scenario.severity,
      message: scenario.message,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      sessionId: `session-emergency-${Date.now()}`
    }

    // Add to critical alerts
    setCriticalAlerts(current => [newAlert, ...current])
    
    // Trigger callback for parent component
    onTriggerAlert?.(newAlert)
    
    setSimulationCount(prev => prev + 1)
  }

  const startScenario = (scenario: EmergencyScenario) => {
    if (isRunning) return
    
    setCurrentScenario(scenario)
    setTimeRemaining(scenario.triggerDelay)
    setIsRunning(true)
  }

  const stopSimulation = () => {
    setIsRunning(false)
    setCurrentScenario(null)
    setTimeRemaining(0)
  }

  const resetSimulation = () => {
    stopSimulation()
    setSimulationCount(0)
    setCriticalAlerts([])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300'
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'high': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Siren className="w-4 h-4 text-red-600" />
            Emergency Alert Simulator
            {simulationCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {simulationCount} Triggered
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {isRunning && (
              <div className="flex items-center gap-2 text-sm">
                <Timer className="w-3 h-3 text-orange-600" />
                <span className="font-mono text-orange-600">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={resetSimulation}
              className="h-6 text-xs px-2"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Current Running Scenario */}
        {isRunning && currentScenario && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
                <span className="font-medium text-sm text-red-800">
                  {currentScenario.name}
                </span>
                <Badge className={getSeverityColor(currentScenario.severity)}>
                  {currentScenario.severity.toUpperCase()}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={stopSimulation}
                className="h-6 text-xs px-2"
              >
                <Pause className="w-3 h-3 mr-1" />
                Stop
              </Button>
            </div>
            
            <p className="text-sm text-red-700 mb-2">
              {currentScenario.description}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-red-600">
              <Users className="w-3 h-3" />
              <span>Patient: {currentScenario.patientName}</span>
              <span>•</span>
              <span>Alert in: {formatTime(timeRemaining)}</span>
            </div>
          </div>
        )}

        {/* Emergency Scenarios */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Test Emergency Scenarios
          </h4>
          
          {emergencyScenarios.map((scenario) => (
            <div 
              key={scenario.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{scenario.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-1.5 py-0 ${getSeverityColor(scenario.severity)}`}
                  >
                    {scenario.severity}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground mb-1">
                  {scenario.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{scenario.patientName}</span>
                  <span>•</span>
                  <Timer className="w-3 h-3" />
                  <span>{scenario.triggerDelay}s delay</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => startScenario(scenario)}
                disabled={isRunning}
                className="h-6 text-xs px-2 ml-3"
              >
                <Play className="w-3 h-3 mr-1" />
                Start
              </Button>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="text-sm font-medium text-blue-800 mb-1">
            Simulation Instructions
          </h5>
          <p className="text-xs text-blue-700 leading-relaxed">
            Select a scenario to simulate emergency alerts. The system will trigger audio alerts
            and create critical notifications based on the scenario severity. Use this to test
            your emergency response protocols and audio alert settings.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}