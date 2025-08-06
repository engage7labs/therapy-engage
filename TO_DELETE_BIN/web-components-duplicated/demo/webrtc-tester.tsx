import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WebRTCSessionRecorder } from '../session/webrtc-session-recorder'
import { 
  Video, 
  TestTube, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Play
} from 'lucide-react'

export function WebRTCTester() {
  const [activeTest, setActiveTest] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, any>>({})

  const testScenarios = [
    {
      id: 'webrtc-basic',
      name: 'Basic WebRTC Recording',
      description: 'Test browser media access and basic recording functionality',
      patientName: 'Test Patient - WebRTC Basic',
      difficulty: 'Basic'
    },
    {
      id: 'webrtc-quality',
      name: 'High Quality Recording',
      description: 'Test recording with optimal video and audio settings',
      patientName: 'Test Patient - Quality Check',
      difficulty: 'Intermediate'
    },
    {
      id: 'webrtc-permissions',
      name: 'Permission Handling',
      description: 'Test camera/microphone permission flows',
      patientName: 'Test Patient - Permissions',
      difficulty: 'Advanced'
    },
    {
      id: 'webrtc-processing',
      name: 'Recording Processing',
      description: 'Test complete recording to AI analysis pipeline',
      patientName: 'Test Patient - Full Pipeline',
      difficulty: 'Advanced'
    }
  ]

  const capabilities = [
    {
      name: 'WebRTC Support',
      check: () => !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia,
      description: 'Browser supports WebRTC media capture'
    },
    {
      name: 'MediaRecorder API',
      check: () => typeof MediaRecorder !== 'undefined',
      description: 'MediaRecorder API is available'
    },
    {
      name: 'VP9 Codec Support',
      check: () => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus'),
      description: 'Browser supports VP9 video codec'
    },
    {
      name: 'WebM Support',
      check: () => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('video/webm'),
      description: 'Browser supports WebM container format'
    },
    {
      name: 'HTTPS Context',
      check: () => location.protocol === 'https:' || location.hostname === 'localhost',
      description: 'Secure context required for media access'
    }
  ]

  const onTestComplete = (sessionData: any) => {
    setTestResults(prev => ({
      ...prev,
      [activeTest!]: {
        completed: true,
        duration: sessionData.duration,
        timestamp: new Date().toISOString(),
        status: 'success'
      }
    }))
    setActiveTest(null)
  }

  const runCapabilityTest = async () => {
    const results: Record<string, boolean> = {}
    
    for (const capability of capabilities) {
      try {
        results[capability.name] = capability.check()
      } catch (error) {
        results[capability.name] = false
      }
    }
    
    setTestResults(prev => ({
      ...prev,
      capabilities: results
    }))
  }

  if (activeTest) {
    const scenario = testScenarios.find(s => s.id === activeTest)
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveTest(null)}
            className="flex items-center gap-2"
          >
            ← Back to Tests
          </Button>
          <div>
            <h2 className="text-2xl font-bold">WebRTC Test: {scenario?.name}</h2>
            <p className="text-muted-foreground">
              {scenario?.description}
            </p>
          </div>
        </div>
        
        <WebRTCSessionRecorder
          sessionId={activeTest}
          patientName={scenario?.patientName || 'Test Patient'}
          onSessionComplete={onTestComplete}
          onSessionEnd={() => setActiveTest(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-primary" />
            WebRTC Recording Capabilities Tester
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Validate browser WebRTC support and test real-time recording functionality
          </p>
        </CardHeader>
      </Card>

      {/* Browser Capability Check */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Browser Capability Assessment</CardTitle>
            <Button onClick={runCapabilityTest} variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Run Check
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {capabilities.map((capability) => {
            const result = testResults.capabilities?.[capability.name]
            return (
              <div key={capability.name} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{capability.name}</p>
                  <p className="text-xs text-muted-foreground">{capability.description}</p>
                </div>
                {result !== undefined && (
                  <Badge variant={result ? 'default' : 'destructive'}>
                    {result ? 'Supported' : 'Not Supported'}
                  </Badge>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Browser Support Info */}
      {testResults.capabilities && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {Object.values(testResults.capabilities).every(Boolean) ? (
              <span className="text-green-700">
                ✅ Your browser fully supports WebRTC recording functionality
              </span>
            ) : (
              <span className="text-orange-700">
                ⚠️ Some WebRTC features may not be available in your browser
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Test Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>WebRTC Test Scenarios</CardTitle>
          <p className="text-sm text-muted-foreground">
            Test different aspects of WebRTC recording functionality
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {testScenarios.map((scenario) => {
            const result = testResults[scenario.id]
            return (
              <div key={scenario.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{scenario.name}</h3>
                      <Badge variant="outline">{scenario.difficulty}</Badge>
                      {result?.completed && (
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {scenario.description}
                    </p>
                    {result?.completed && (
                      <p className="text-xs text-muted-foreground">
                        Completed in {Math.floor(result.duration / 60)}m {result.duration % 60}s
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => setActiveTest(scenario.id)}
                    variant={result?.completed ? "outline" : "default"}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {result?.completed ? 'Run Again' : 'Start Test'}
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Test Results Summary */}
      {Object.keys(testResults).length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Completed Tests</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {Object.values(testResults).filter(r => r?.completed).length}
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <Video className="h-4 w-4" />
                  <span className="font-medium">WebRTC Ready</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {testResults.capabilities && Object.values(testResults.capabilities).every(Boolean) ? 'Yes' : 'Partial'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}