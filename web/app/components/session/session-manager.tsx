import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Play, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  Video,
  Brain,
  ChevronRight,
  TestTube,
  Warning,
  CheckCircle,
  Info,
  FirstAid
} from '@phosphor-icons/react'
import { SessionRecorder } from './session-recorder'
import { WebRTCSessionRecorder } from './webrtc-session-recorder'
import { SessionInsights } from './session-insights'
import { TestScenarios } from './test-scenarios'

interface SessionManagerProps {
  patientId?: string
  patientName?: string
}

export function SessionManager({ patientId, patientName }: SessionManagerProps) {
  const [activeView, setActiveView] = useState<'list' | 'recorder' | 'webrtc-recorder' | 'insights' | 'scenarios' | 'documentation'>('list')
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [scenarioFilter, setScenarioFilter] = useState<'all' | string>('all')
  const [riskFilter, setRiskFilter] = useState<'all' | string>('all')
  const [recordingMode, setRecordingMode] = useState<'demo' | 'webrtc'>('demo')
  
  // Comprehensive session test scenarios with varying patient responses and risk levels
  const [sessions, setSessions] = useKV('therapy-sessions', [
    // LOW RISK - Positive progress scenario
    {
      id: 'session-001',
      patientId: 'patient-001',
      patientName: 'Ana Silva',
      scheduledTime: '2025-01-15T14:00:00Z',
      status: 'completed',
      duration: 45,
      type: 'Anxiety Management',
      hasRecording: true,
      hasTranscript: true,
      hasInsights: true,
      riskLevel: 'low',
      scenario: 'positive-progress',
      patientResponse: 'cooperative',
      therapeuticOutcome: 'breakthrough'
    },
    // MODERATE RISK - Mixed progress scenario
    {
      id: 'session-002',
      patientId: 'patient-002', 
      patientName: 'Carlos Santos',
      scheduledTime: '2025-01-15T16:00:00Z',
      status: 'completed',
      duration: 50,
      type: 'Depression CBT',
      hasRecording: true,
      hasTranscript: true,
      hasInsights: true,
      riskLevel: 'moderate',
      scenario: 'mixed-progress',
      patientResponse: 'resistant-initially',
      therapeuticOutcome: 'gradual-improvement'
    },
    // HIGH RISK - Crisis intervention scenario
    {
      id: 'session-003',
      patientId: 'patient-003',
      patientName: 'Maria Oliveira',
      scheduledTime: '2025-01-16T10:00:00Z',
      status: 'completed',
      duration: 75,
      type: 'PTSD Crisis Session',
      hasRecording: true,
      hasTranscript: true,
      hasInsights: true,
      riskLevel: 'high',
      scenario: 'crisis-intervention',
      patientResponse: 'distressed',
      therapeuticOutcome: 'safety-plan-activated'
    },
    // SCHEDULED - Standard session
    {
      id: 'session-004',
      patientId: 'patient-001',
      patientName: 'Ana Silva',
      scheduledTime: '2025-01-17T14:00:00Z',
      status: 'scheduled',
      duration: null,
      type: 'Follow-up Session',
      hasRecording: false,
      hasTranscript: false,
      hasInsights: false,
      riskLevel: null,
      scenario: 'follow-up',
      patientResponse: null,
      therapeuticOutcome: null
    },
    // IN-PROGRESS - Active session scenario
    {
      id: 'session-005',
      patientId: 'patient-004',
      patientName: 'João Pedro',
      scheduledTime: '2025-01-15T09:00:00Z',
      status: 'in-progress',
      duration: null,
      type: 'Trauma Processing',
      hasRecording: true,
      hasTranscript: false,
      hasInsights: false,
      riskLevel: null,
      scenario: 'trauma-processing',
      patientResponse: 'emotional-release',
      therapeuticOutcome: null
    },
    // MODERATE RISK - Medication adjustment scenario
    {
      id: 'session-006',
      patientId: 'patient-005',
      patientName: 'Sofia Fernandes',
      scheduledTime: '2025-01-14T11:00:00Z',
      status: 'completed',
      duration: 40,
      type: 'Medication Review',
      hasRecording: true,
      hasTranscript: true,
      hasInsights: true,
      riskLevel: 'moderate',
      scenario: 'medication-adjustment',
      patientResponse: 'concerned-about-side-effects',
      therapeuticOutcome: 'medication-modified'
    },
    // LOW RISK - Family therapy scenario
    {
      id: 'session-007',
      patientId: 'patient-006',
      patientName: 'Ricardo & Elena Martinez',
      scheduledTime: '2025-01-13T16:30:00Z',
      status: 'completed',
      duration: 60,
      type: 'Couples Therapy',
      hasRecording: true,
      hasTranscript: true,
      hasInsights: true,
      riskLevel: 'low',
      scenario: 'relationship-counseling',
      patientResponse: 'both-engaged',
      therapeuticOutcome: 'communication-improved'
    },
    // HIGH RISK - Substance abuse scenario
    {
      id: 'session-008',
      patientId: 'patient-007',
      patientName: 'Miguel Santos',
      scheduledTime: '2025-01-12T10:00:00Z',
      status: 'completed',
      duration: 55,
      type: 'Addiction Counseling',
      hasRecording: true,
      hasTranscript: true,
      hasInsights: true,
      riskLevel: 'high',
      scenario: 'relapse-prevention',
      patientResponse: 'defensive-then-breakthrough',
      therapeuticOutcome: 'relapse-plan-updated'
    },
    // MODERATE RISK - Adolescent therapy scenario
    {
      id: 'session-009',
      patientId: 'patient-008',
      patientName: 'Beatriz Silva (16)',
      scheduledTime: '2025-01-11T15:00:00Z',
      status: 'completed',
      duration: 35,
      type: 'Adolescent Therapy',
      hasRecording: true,
      hasTranscript: true,
      hasInsights: true,
      riskLevel: 'moderate',
      scenario: 'teen-behavioral-issues',
      patientResponse: 'withdrawn-initially',
      therapeuticOutcome: 'parent-involvement-planned'
    },
    // LOW RISK - Group therapy scenario
    {
      id: 'session-010',
      patientId: 'patient-group-001',
      patientName: 'Support Group Session',
      scheduledTime: '2025-01-10T18:00:00Z',
      status: 'completed',
      duration: 90,
      type: 'Group Therapy',
      hasRecording: true,
      hasTranscript: true,
      hasInsights: true,
      riskLevel: 'low',
      scenario: 'peer-support',
      patientResponse: 'varied-participation',
      therapeuticOutcome: 'group-cohesion-strengthened'
    }
  ])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in-progress': return 'secondary'
      case 'scheduled': return 'outline'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  const getRiskBadgeVariant = (riskLevel: string | null) => {
    if (!riskLevel) return 'secondary'
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'default'
      case 'moderate': return 'outline'
      case 'high': return 'destructive'
      default: return 'secondary'
    }
  }

  const getScenarioIcon = (scenario: string) => {
    switch (scenario) {
      case 'positive-progress': return <CheckCircle className="h-3 w-3" />
      case 'crisis-intervention': return <FirstAid className="h-3 w-3" />
      case 'mixed-progress': return <Info className="h-3 w-3" />
      case 'medication-adjustment': return <TestTube className="h-3 w-3" />
      case 'relapse-prevention': return <Warning className="h-3 w-3" />
      default: return <Info className="h-3 w-3" />
    }
  }

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'positive-progress': return 'text-green-600 bg-green-50'
      case 'crisis-intervention': return 'text-red-600 bg-red-50'
      case 'mixed-progress': return 'text-blue-600 bg-blue-50'
      case 'medication-adjustment': return 'text-purple-600 bg-purple-50'
      case 'relapse-prevention': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const filteredSessions = sessions
    .filter(session => !patientId || session.patientId === patientId)
    .filter(session => scenarioFilter === 'all' || session.scenario === scenarioFilter)
    .filter(session => riskFilter === 'all' || session.riskLevel === riskFilter)

  const uniqueScenarios = [...new Set(sessions.map(s => s.scenario).filter(Boolean))]
  const uniqueRiskLevels = [...new Set(sessions.map(s => s.riskLevel).filter(Boolean))]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const startNewSession = (sessionId: string, mode: 'demo' | 'webrtc' = 'demo') => {
    setSelectedSessionId(sessionId)
    setRecordingMode(mode)
    setActiveView(mode === 'webrtc' ? 'webrtc-recorder' : 'recorder')
  }

  const viewSessionInsights = (sessionId: string) => {
    setSelectedSessionId(sessionId)
    setActiveView('insights')
  }

  const onSessionEnd = (sessionData: any) => {
    // Update session list with completed session data
    setSessions(prev => prev.map(session => 
      session.id === sessionData.id 
        ? { 
            ...session, 
            status: 'completed',
            duration: Math.floor(sessionData.duration / 60),
            hasRecording: true,
            hasTranscript: false, // Will be updated when transcription completes
            hasInsights: false    // Will be updated when AI analysis completes
          }
        : session
    ))
    
    // Return to session list
    setActiveView('list')
    setSelectedSessionId(null)
  }

  if ((activeView === 'recorder' || activeView === 'webrtc-recorder') && selectedSessionId) {
    const session = sessions.find(s => s.id === selectedSessionId)
    const isWebRTC = activeView === 'webrtc-recorder'
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('list')}
            className="flex items-center gap-2"
          >
            ← Back to Sessions
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {isWebRTC ? 'WebRTC Live Session' : 'Demo Session'}
            </h2>
            <p className="text-muted-foreground">
              {session?.patientName} • {session?.type}
              {isWebRTC && <Badge variant="outline" className="ml-2">LIVE RECORDING</Badge>}
            </p>
          </div>
        </div>
        
        {isWebRTC ? (
          <WebRTCSessionRecorder 
            sessionId={selectedSessionId}
            patientName={session?.patientName || 'Unknown Patient'}
            patientId={session?.patientId}
            onSessionComplete={onSessionEnd}
            onSessionEnd={() => setActiveView('list')}
            demoMode={false}
          />
        ) : (
          <SessionRecorder 
            sessionId={selectedSessionId}
            patientName={session?.patientName || 'Unknown Patient'}
            onSessionEnd={onSessionEnd}
          />
        )}
      </div>
    )
  }

  if (activeView === 'insights' && selectedSessionId) {
    const session = sessions.find(s => s.id === selectedSessionId)
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('list')}
            className="flex items-center gap-2"
          >
            ← Back to Sessions
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Session Insights</h2>
            <p className="text-muted-foreground">
              {session?.patientName} • {session?.type} • {formatDate(session?.scheduledTime || '')}
            </p>
          </div>
        </div>
        <SessionInsights sessionId={selectedSessionId} />
      </div>
    )
  }

  if (activeView === 'documentation') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('list')}
            className="flex items-center gap-2"
          >
            ← Back to Sessions
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Test Scenarios Documentation</h2>
            <p className="text-muted-foreground">
              Comprehensive documentation of all therapy session test scenarios
            </p>
          </div>
        </div>
        <TestScenarios />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Session Management & Test Scenarios</h2>
          <p className="text-muted-foreground">
            Secure video sessions with automated transcription, AI insights, and comprehensive test scenarios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={activeView === 'scenarios' ? 'default' : 'outline'}
            onClick={() => setActiveView('scenarios')}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            Test Scenarios
          </Button>
          <Button 
            variant={activeView === 'documentation' ? 'default' : 'outline'}
            onClick={() => setActiveView('documentation')}
            className="flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            Documentation
          </Button>
        </div>
      </div>

      {/* Scenario Analysis View */}
      {activeView === 'scenarios' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Session Test Scenarios Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scenario Overview Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Low Risk</span>
                </div>
                <p className="text-2xl font-bold mt-2">{sessions.filter(s => s.riskLevel === 'low').length}</p>
                <p className="text-sm text-green-600">Stable patients</p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <Warning className="h-5 w-5" />
                  <span className="font-semibold">Moderate Risk</span>
                </div>
                <p className="text-2xl font-bold mt-2">{sessions.filter(s => s.riskLevel === 'moderate').length}</p>
                <p className="text-sm text-yellow-600">Requires monitoring</p>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <FirstAid className="h-5 w-5" />
                  <span className="font-semibold">High Risk</span>
                </div>
                <p className="text-2xl font-bold mt-2">{sessions.filter(s => s.riskLevel === 'high').length}</p>
                <p className="text-sm text-red-600">Crisis intervention</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <Brain className="h-5 w-5" />
                  <span className="font-semibold">AI Insights</span>
                </div>
                <p className="text-2xl font-bold mt-2">{sessions.filter(s => s.hasInsights).length}</p>
                <p className="text-sm text-blue-600">Generated analyses</p>
              </div>
            </div>

            {/* Scenario Breakdown */}
            <div>
              <h3 className="font-semibold mb-4">Test Scenario Categories</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {uniqueScenarios.map(scenario => {
                  const scenarioSessions = sessions.filter(s => s.scenario === scenario)
                  return (
                    <div key={scenario} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1 rounded ${getScenarioColor(scenario)}`}>
                          {getScenarioIcon(scenario)}
                        </div>
                        <span className="font-medium">{scenario?.replace('-', ' ')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {scenarioSessions.length} session{scenarioSessions.length !== 1 ? 's' : ''}
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Risk levels: {[...new Set(scenarioSessions.map(s => s.riskLevel).filter(Boolean))].join(', ')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <Button 
              onClick={() => setActiveView('list')}
              variant="outline"
              className="w-full"
            >
              Return to Session List
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      {activeView === 'list' && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">Filter sessions:</span>
          <Select value={scenarioFilter} onValueChange={setScenarioFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All scenarios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All scenarios</SelectItem>
              {uniqueScenarios.map(scenario => (
                <SelectItem key={scenario} value={scenario}>
                  {scenario?.replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All risk levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk levels</SelectItem>
              {uniqueRiskLevels.map(risk => (
                <SelectItem key={risk} value={risk}>
                  {risk} risk
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="ml-auto text-sm text-muted-foreground">
            Showing {filteredSessions.length} of {sessions.length} sessions
          </div>
        </div>
      )}

      {/* Session List */}
      {activeView === 'list' && (
        <div className="grid gap-4">
          {filteredSessions.map(session => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{session.patientName}</h3>
                      <p className="text-sm text-muted-foreground">{session.type}</p>
                      
                      {/* Enhanced session details */}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(session.scheduledTime)}
                        </div>
                        {session.duration && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {session.duration} min
                          </div>
                        )}
                        
                        {/* Scenario indicator */}
                        {session.scenario && (
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getScenarioColor(session.scenario)}`}>
                            {getScenarioIcon(session.scenario)}
                            {session.scenario.replace('-', ' ')}
                          </div>
                        )}
                      </div>

                      {/* Patient response indicator */}
                      {session.patientResponse && (
                        <div className="mt-1">
                          <span className="text-xs text-muted-foreground">
                            Response: <span className="font-medium">{session.patientResponse.replace('-', ' ')}</span>
                          </span>
                        </div>
                      )}

                      {/* Therapeutic outcome */}
                      {session.therapeuticOutcome && (
                        <div className="mt-1">
                          <span className="text-xs text-muted-foreground">
                            Outcome: <span className="font-medium">{session.therapeuticOutcome.replace('-', ' ')}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <Badge variant={getStatusBadgeVariant(session.status)}>
                      {session.status.replace('-', ' ').toUpperCase()}
                    </Badge>

                    {/* Risk Level Badge */}
                    {session.riskLevel && (
                      <Badge variant={getRiskBadgeVariant(session.riskLevel)}>
                        Risk: {session.riskLevel.toUpperCase()}
                      </Badge>
                    )}

                    {/* Feature Indicators */}
                    <div className="flex items-center gap-1">
                      {session.hasRecording && (
                        <div className="p-1 bg-green-100 text-green-700 rounded">
                          <Video className="h-3 w-3" />
                        </div>
                      )}
                      {session.hasTranscript && (
                        <div className="p-1 bg-blue-100 text-blue-700 rounded">
                          <FileText className="h-3 w-3" />
                        </div>
                      )}
                      {session.hasInsights && (
                        <div className="p-1 bg-purple-100 text-purple-700 rounded">
                          <Brain className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {session.status === 'scheduled' && (
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={() => startNewSession(session.id, 'demo')}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Play className="h-3 w-3" />
                            Demo Session
                          </Button>
                          <Button 
                            onClick={() => startNewSession(session.id, 'webrtc')}
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Video className="h-3 w-3" />
                            Live Session
                          </Button>
                        </div>
                      )}

                      {session.status === 'in-progress' && (
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={() => startNewSession(session.id, 'demo')}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Video className="h-3 w-3" />
                            Continue Demo
                          </Button>
                          <Button 
                            onClick={() => startNewSession(session.id, 'webrtc')}
                            size="sm"
                            variant="secondary"
                            className="flex items-center gap-2"
                          >
                            <Video className="h-3 w-3" />
                            Continue Live
                          </Button>
                        </div>
                      )}

                      {session.status === 'completed' && session.hasInsights && (
                        <Button 
                          onClick={() => viewSessionInsights(session.id)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Brain className="h-3 w-3" />
                          View Insights
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats - only show in list view */}
      {activeView === 'list' && (
        <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold clinical-data">
                  {sessions.filter(s => s.status === 'scheduled').length}
                </p>
                <p className="text-sm text-muted-foreground">Scheduled Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-2xl font-bold clinical-data">
                  {sessions.filter(s => s.hasRecording).length}
                </p>
                <p className="text-sm text-muted-foreground">Recorded Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold clinical-data">
                  {sessions.filter(s => s.hasTranscript).length}
                </p>
                <p className="text-sm text-muted-foreground">Transcribed Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-bold clinical-data">
                  {sessions.filter(s => s.hasInsights).length}
                </p>
                <p className="text-sm text-muted-foreground">AI Insights Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  )
}