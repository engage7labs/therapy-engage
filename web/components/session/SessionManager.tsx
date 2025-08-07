import { useState } from 'react'
import { useKV } from '../../app/hooks/use-kv'

interface Session {
  id: string
  patientId: string
  patientName: string
  scheduledTime: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  duration: number | null
  type: string
  hasRecording?: boolean
  hasTranscript?: boolean
  hasInsights?: boolean
  riskLevel?: 'low' | 'moderate' | 'high' | null
  scenario?: string
  patientResponse?: string | null
  therapeuticOutcome?: string | null
}

interface SessionManagerProps {
  readonly patientId?: string
  readonly patientName?: string
}

export function SessionManager({ patientId, patientName }: SessionManagerProps) {
  const [activeView, setActiveView] = useState<'list' | 'insights'>('list')
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'in-progress' | 'completed'>('all')
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'moderate' | 'high'>('all')
  
  // Demo session data for testing
  const [sessions, setSessions] = useKV<Session[]>('therapy-sessions', [
    {
      id: 'session-001',
      patientId: 'patient-rodrigo-001',
      patientName: 'Rodrigo Marques',
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
    {
      id: 'session-002',
      patientId: 'patient-rodrigo-001',
      patientName: 'Rodrigo Marques',
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
    {
      id: 'session-003',
      patientId: 'patient-001',
      patientName: 'Ana Silva',
      scheduledTime: '2025-01-16T10:00:00Z',
      status: 'in-progress',
      duration: null,
      type: 'CBT Session',
      hasRecording: true,
      hasTranscript: false,
      hasInsights: false,
      riskLevel: 'moderate',
      scenario: 'cognitive-restructuring',
      patientResponse: 'engaged',
      therapeuticOutcome: null
    }
  ])

  const filteredSessions = sessions.filter(session => {
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter
    const matchesRisk = riskFilter === 'all' || session.riskLevel === riskFilter
    const matchesPatient = !patientId || session.patientId === patientId
    return matchesStatus && matchesRisk && matchesPatient
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const getRiskBadgeColor = (riskLevel: string | null) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'moderate': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const formatSessionTime = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStartSession = (sessionId: string) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'in-progress' as const }
        : session
    ))
  }

  const handleCompleteSession = (sessionId: string) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            status: 'completed' as const, 
            duration: 45,
            hasRecording: true,
            hasTranscript: true,
            hasInsights: true
          }
        : session
    ))
  }

  const createNewSession = () => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      patientId: patientId || 'patient-001',
      patientName: patientName || 'New Patient',
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled',
      duration: null,
      type: 'Initial Consultation',
      hasRecording: false,
      hasTranscript: false,
      hasInsights: false,
      riskLevel: null,
      scenario: 'initial-assessment',
      patientResponse: null,
      therapeuticOutcome: null
    }
    
    setSessions([...sessions, newSession])
  }

  if (activeView === 'list') {
    return (
      <div className="bg-card rounded-lg shadow-md border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Session Management</h2>
            <button 
              onClick={createNewSession}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 text-sm"
            >
              + New Session
            </button>
          </div>
          
          <div className="flex gap-4">
            <select 
              title="Filter by status"
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'scheduled' | 'in-progress' | 'completed')}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select 
              title="Filter by risk level"
              value={riskFilter} 
              onChange={(e) => setRiskFilter(e.target.value as 'all' | 'low' | 'moderate' | 'high')}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sessions found matching the current filters.
            </div>
          ) : (
            filteredSessions.map(session => (
              <div key={session.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{session.patientName}</h3>
                    <p className="text-sm text-muted-foreground">{session.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(session.status)}`}>
                      {session.status}
                    </span>
                    {session.riskLevel && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(session.riskLevel)}`}>
                        {session.riskLevel} risk
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {formatSessionTime(session.scheduledTime)}
                  {session.duration && ` • ${session.duration} minutes`}
                </div>
                
                <div className="flex gap-2">
                  {session.status === 'scheduled' && (
                    <button 
                      onClick={() => handleStartSession(session.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
                    >
                      Start Session
                    </button>
                  )}
                  
                  {session.status === 'in-progress' && (
                    <button 
                      onClick={() => handleCompleteSession(session.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                    >
                      Complete Session
                    </button>
                  )}
                  
                  {session.status === 'completed' && session.hasInsights && (
                    <button 
                      onClick={() => {
                        setSelectedSessionId(session.id)
                        setActiveView('insights')
                      }}
                      className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 text-sm"
                    >
                      View Insights
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  if (activeView === 'insights') {
    const selectedSession = sessions.find(s => s.id === selectedSessionId)
    return (
      <div className="bg-card rounded-lg shadow-md border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Session Insights</h2>
            <button 
              onClick={() => setActiveView('list')}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 text-sm"
            >
              Back to List
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {selectedSession ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedSession.patientName}</h3>
                <p className="text-sm text-muted-foreground">{selectedSession.type}</p>
                <p className="text-sm text-muted-foreground">
                  {formatSessionTime(selectedSession.scheduledTime)}
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Session Summary</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Duration:</strong> {selectedSession.duration} minutes</p>
                  <p><strong>Patient Response:</strong> {selectedSession.patientResponse}</p>
                  <p><strong>Therapeutic Outcome:</strong> {selectedSession.therapeuticOutcome}</p>
                  <p><strong>Risk Assessment:</strong> {selectedSession.riskLevel} risk</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="border rounded-lg p-3 text-center">
                  <div className={`font-semibold ${selectedSession.hasRecording ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedSession.hasRecording ? '✓' : '✗'}
                  </div>
                  <div className="text-sm">Recording</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <div className={`font-semibold ${selectedSession.hasTranscript ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedSession.hasTranscript ? '✓' : '✗'}
                  </div>
                  <div className="text-sm">Transcript</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <div className={`font-semibold ${selectedSession.hasInsights ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedSession.hasInsights ? '✓' : '✗'}
                  </div>
                  <div className="text-sm">AI Insights</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Session not found.
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
