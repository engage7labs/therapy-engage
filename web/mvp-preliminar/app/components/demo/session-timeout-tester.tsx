import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { useKV } from '@/hooks/use-kv'
import { useAuth } from '@/contexts/auth-context'
import { useSessionTimeout, useActivityTracker } from '@/hooks/use-session-timeout'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Timer
} from 'lucide-react'

/**
 * SessionTimeoutTester - Testing component for session timeout functionality
 * 
 * Allows developers and therapists to test different timeout scenarios:
 * - Quick timeout simulation (30 seconds instead of 30 minutes)
 * - Activity simulation
 * - Warning level testing
 * - Emergency session scenarios
 */
export function SessionTimeoutTester() {
  const { user, updateActivity, extendSession } = useAuth()
  const [testMode, setTestMode] = useState(false)
  const [testScenario, setTestScenario] = useState<'normal' | 'emergency' | 'quick' | 'inactive'>('normal')
  const [simulatedActivity, setSimulatedActivity] = useState(0)
  
  // Test configuration
  const [testTimeoutMinutes, setTestTimeoutMinutes] = useKV('test-timeout-minutes', 0.5) // 30 seconds for testing
  const [testWarningMinutes, setTestWarningMinutes] = useKV('test-warning-minutes', 0.2) // 12 seconds for testing
  
  // Activity tracker
  const activityTracker = useActivityTracker(() => {
    console.log('🎯 Activity detected by tracker')
  })

  // Session timeout with test configuration
  const sessionTimeout = useSessionTimeout({
    timeoutMinutes: testMode ? testTimeoutMinutes : (user?.sessionTimeout || 30),
    warningMinutes: testMode ? testWarningMinutes : 5,
    autoExtendOnActivity: testScenario !== 'inactive',
    onTimeout: () => {
      console.log('⏰ Test timeout triggered!')
      addTestResult('timeout_triggered')
    },
    onWarning: (level) => {
      console.log(`⚠️ Test warning: ${level}`)
      addTestResult(`warning_${level}`)
    }
  })

  // Test results tracking
  const [testResults, setTestResults] = useKV<Array<{
    timestamp: number
    event: string
    scenario: string
  }>>('session-test-results', [])

  // Helper function to add test results
  const addTestResult = (event: string) => {
    const newResult = {
      timestamp: Date.now(),
      event,
      scenario: testScenario
    }
    setTestResults([...testResults, newResult])
  }

  // Simulate activity bursts
  const simulateActivity = () => {
    const events = ['mousedown', 'keypress', 'click', 'scroll']
    const randomEvent = events[Math.floor(Math.random() * events.length)]
    
    // Trigger activity
    updateActivity()
    setSimulatedActivity(prev => prev + 1)
    
    console.log(`🖱️ Simulated ${randomEvent} activity`)
    
    addTestResult(`simulated_${randomEvent}`)
  }

  // Start activity burst simulation
  const startActivityBurst = () => {
    const burstCount = 5 + Math.floor(Math.random() * 10) // 5-15 activities
    const burstInterval = 100 + Math.floor(Math.random() * 400) // 100-500ms apart
    
    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        simulateActivity()
      }, i * burstInterval)
    }
  }

  // Reset test environment
  const resetTest = () => {
    setTestResults([])
    setSimulatedActivity(0)
    activityTracker.reset()
    extendSession(testMode ? testTimeoutMinutes : 30)
    console.log('🔄 Test environment reset')
  }

  // Get scenario description
  const getScenarioDescription = () => {
    switch (testScenario) {
      case 'emergency':
        return 'Emergency session - auto-extend disabled during critical patient care'
      case 'quick':
        return 'Quick test - 30 second timeout for rapid testing'
      case 'inactive':
        return 'Inactive user - no auto-extension on activity'
      default:
        return 'Normal operation - standard timeout behavior'
    }
  }

  // Get warning badge variant
  const getWarningBadgeVariant = () => {
    if (sessionTimeout.warningLevel === 'critical') return 'destructive'
    if (sessionTimeout.warningLevel === 'urgent') return 'secondary'
    if (sessionTimeout.warningLevel === 'early') return 'outline'
    return 'default'
  }

  // Get warning level color
  const getWarningColor = () => {
    switch (sessionTimeout.warningLevel) {
      case 'critical': return 'text-red-600'
      case 'urgent': return 'text-orange-600'
      case 'early': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Test Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Session Timeout Testing
          </CardTitle>
          <CardDescription>
            Test and validate session timeout functionality in a controlled environment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Mode Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="text-base font-medium">Test Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use accelerated timeouts for testing (30 seconds instead of 30 minutes)
              </p>
            </div>
            <Button
              variant={testMode ? "default" : "outline"}
              onClick={() => {
                setTestMode(!testMode)
                resetTest()
              }}
              className="flex items-center gap-2"
            >
              {testMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {testMode ? 'Exit Test Mode' : 'Enter Test Mode'}
            </Button>
          </div>

          {testMode && (
            <>
              {/* Test Configuration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-timeout">Test Timeout (minutes)</Label>
                  <Input
                    id="test-timeout"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5"
                    value={testTimeoutMinutes}
                    onChange={(e) => setTestTimeoutMinutes(parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-warning">Test Warning (minutes)</Label>
                  <Input
                    id="test-warning"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="2"
                    value={testWarningMinutes}
                    onChange={(e) => setTestWarningMinutes(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              {/* Scenario Selection */}
              <div className="space-y-3">
                <Label>Test Scenario</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'normal', label: 'Normal', icon: CheckCircle },
                    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
                    { id: 'quick', label: 'Quick Test', icon: Zap },
                    { id: 'inactive', label: 'Inactive User', icon: Pause }
                  ].map(scenario => (
                    <Button
                      key={scenario.id}
                      variant={testScenario === scenario.id ? "default" : "outline"}
                      onClick={() => setTestScenario(scenario.id as any)}
                      className="flex items-center gap-2 justify-start"
                    >
                      <scenario.icon className="h-4 w-4" />
                      {scenario.label}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {getScenarioDescription()}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Session Status Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Session Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Time Remaining</Label>
              <div className={`text-xl font-mono ${getWarningColor()}`}>
                {sessionTimeout.getFormattedTime(sessionTimeout.timeRemaining).formatted}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">Warning Level</Label>
              <Badge variant={getWarningBadgeVariant()}>
                {sessionTimeout.warningLevel === 'none' ? 'Safe' : sessionTimeout.warningLevel}
              </Badge>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">Real Activity</Label>
              <div className="text-xl font-mono">
                {activityTracker.activityCount}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">Simulated Activity</Label>
              <div className="text-xl font-mono">
                {simulatedActivity}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Session Progress</span>
              <span>{Math.round((sessionTimeout.timeRemaining / (testMode ? testTimeoutMinutes * 60 * 1000 : 30 * 60 * 1000)) * 100)}%</span>
            </div>
            <Progress 
              value={(sessionTimeout.timeRemaining / (testMode ? testTimeoutMinutes * 60 * 1000 : 30 * 60 * 1000)) * 100}
              className={`h-3 ${sessionTimeout.warningLevel === 'critical' ? 'animate-pulse' : ''}`}
            />
          </div>

          {/* Test Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={simulateActivity}
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              Simulate Activity
            </Button>
            <Button
              variant="outline"
              onClick={startActivityBurst}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Activity Burst
            </Button>
            <Button
              variant="outline"
              onClick={() => extendSession(testMode ? testTimeoutMinutes : 15)}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Extend Session
            </Button>
            <Button
              variant="outline"
              onClick={resetTest}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Log */}
      <Card>
        <CardHeader>
          <CardTitle>Test Event Log</CardTitle>
          <CardDescription>
            Chronological log of timeout and activity events during testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testResults.slice(-20).reverse().map((result) => (
              <div key={`${result.timestamp}-${result.event}`} className="flex items-center justify-between p-2 border rounded text-sm">
                <div className="flex items-center gap-2">
                  {result.event.includes('warning') && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                  {result.event.includes('timeout') && <Clock className="h-4 w-4 text-red-500" />}
                  {result.event.includes('simulated') && <Activity className="h-4 w-4 text-blue-500" />}
                  <span className="font-medium">{result.event.replace('_', ' ')}</span>
                  <Badge variant="outline" className="text-xs">
                    {result.scenario}
                  </Badge>
                </div>
                <span className="text-muted-foreground">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            
            {testResults.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No test events recorded yet. Start testing to see results here.
              </div>
            )}
          </div>
          
          {testResults.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total events: {testResults.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTestResults([])}
                >
                  Clear Log
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Testing Guidelines */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Testing Guidelines:</strong>
          <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
            <li>Test mode uses accelerated timeouts for rapid validation</li>
            <li>Simulated activity should trigger auto-extension (except in inactive scenario)</li>
            <li>Emergency scenario disables auto-extension to test critical workflows</li>
            <li>Monitor the event log to verify expected behavior patterns</li>
            <li>Always reset test environment between different scenarios</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}