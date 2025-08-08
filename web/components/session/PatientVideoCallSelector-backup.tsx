import { useState } from 'react'
import { useKV } from '../../app/hooks/use-kv'

interface Patient {
  id: string
  name: string
  age: number
  diagnosis: string
  nextSession?: string
  isOnline: boolean
  lastSeen?: string
  riskLevel: 'low' | 'moderate' | 'high'
  moodTrend: 'improving' | 'stable' | 'declining'
  sessionsCompleted: number
  totalSessions: number
  preferredCallTime?: string
  emergencyContact?: boolean
}

interface ScheduledSession {
  id: string
  patientId: string
  patientName: string
  scheduledTime: string
  type: string
  duration: number
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  isVideoSession: boolean
}

export function PatientVideoCallSelector() {
  const [activeCall, setActiveCall] = useState<{
    sessionId: string
    patientId: string
    patientName: string
  } | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedView, setSelectedView] = useState<'scheduled' | 'patients' | 'emergency'>('scheduled')

  // Patient data with online status simulation
  const [patients] = useKV<Patient[]>('video-call-patients', [
    {
      id: 'patient-rodrigo-001',
      name: 'Rodrigo Marques',
      age: 28,
      diagnosis: 'Anxiety Disorder',
      nextSession: '2025-01-15T14:00:00Z',
      isOnline: true,
      lastSeen: '2025-01-15T13:45:00Z',
      riskLevel: 'low',
      moodTrend: 'improving',
      sessionsCompleted: 8,
      totalSessions: 12,
      preferredCallTime: '14:00-16:00',
      emergencyContact: false
    },
    {
      id: 'patient-001',
      name: 'Ana Silva',
      age: 34,
      diagnosis: 'Depression',
      nextSession: '2025-01-16T10:00:00Z',
      isOnline: false,
      lastSeen: '2025-01-14T16:30:00Z',
      riskLevel: 'moderate',
      moodTrend: 'stable',
      sessionsCompleted: 15,
      totalSessions: 20,
      preferredCallTime: '10:00-12:00',
      emergencyContact: false
    },
    {
      id: 'patient-002',
      name: 'Carlos Santos',
      age: 45,
      diagnosis: 'PTSD',
      nextSession: '2025-01-17T09:00:00Z',
      isOnline: true,
      lastSeen: '2025-01-15T08:30:00Z',
      riskLevel: 'high',
      moodTrend: 'declining',
      sessionsCompleted: 22,
      totalSessions: 30,
      preferredCallTime: '09:00-11:00',
      emergencyContact: true
    }
  ])

  // Scheduled sessions for video calls
  const [scheduledSessions] = useKV<ScheduledSession[]>('scheduled-video-sessions', [
    {
      id: 'video-session-001',
      patientId: 'patient-rodrigo-001',
      patientName: 'Rodrigo Marques',
      scheduledTime: '2025-01-15T14:00:00Z',
      type: 'Follow-up Session',
      duration: 50,
      status: 'scheduled',
      isVideoSession: true
    },
    {
      id: 'video-session-002',
      patientId: 'patient-001',
      patientName: 'Ana Silva',
      scheduledTime: '2025-01-16T10:00:00Z',
      type: 'CBT Session',
      duration: 45,
      status: 'scheduled',
      isVideoSession: true
    }
  ])

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const emergencyPatients = patients.filter(patient => 
    patient.emergencyContact || patient.riskLevel === 'high'
  )

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'moderate': return 'bg-orange-100 text-orange-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMoodTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600'
      case 'stable': return 'text-blue-600'
      case 'declining': return 'text-red-600'
      default: return 'text-gray-600'
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
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStartVideoCall = (patientId: string, patientName: string, sessionId?: string) => {
    setActiveCall({
      sessionId: sessionId || `emergency-${Date.now()}`,
      patientId,
      patientName
    })
  }

  const handleEndCall = () => {
    setActiveCall(null)
  }

  if (activeCall) {
    return (
      <div className="bg-card rounded-lg shadow-md border">
        <div className="p-6 border-b border-border bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                Video Call in Progress
              </h2>
              <p className="text-blue-700 dark:text-blue-300">
                Connected with {activeCall.patientName}
              </p>
            </div>
            <button 
              onClick={handleEndCall}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-md hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all duration-200"
            >
              End Call
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-900 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center text-white border border-gray-700">
            <div className="text-center">
              <div className="text-6xl mb-4">📹</div>
              <p className="text-xl">Video Call with {activeCall.patientName}</p>
              <p className="text-gray-300 mt-2">Session ID: {activeCall.sessionId}</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50">
              <span>🎤</span>
              <span>Mute</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50">
              <span>📹</span>
              <span>Camera</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50">
              <span>📱</span>
              <span>Share Screen</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg shadow-md border">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Video Call Center</h2>
        
        <div className="flex gap-4 mt-4">
          <button 
            onClick={() => setSelectedView('scheduled')}
            className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
              selectedView === 'scheduled' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-700' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Scheduled Sessions
          </button>
          <button 
            onClick={() => setSelectedView('patients')}
            className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
              selectedView === 'patients' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-700' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            All Patients
          </button>
          <button 
            onClick={() => setSelectedView('emergency')}
            className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
              selectedView === 'emergency' 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white dark:from-red-600 dark:to-red-700' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Emergency Contacts
          </button>
        </div>
        
        {selectedView === 'patients' && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:border-slate-600"
            />
          </div>
        )}
      </div>
      
      <div className="p-6">
        {selectedView === 'scheduled' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Today&apos;s Video Sessions</h3>
            {scheduledSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No video sessions scheduled for today
              </div>
            ) : (
              scheduledSessions.map(session => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{session.patientName}</h4>
                      <p className="text-sm text-gray-600">
                        {session.type} • {session.duration} minutes
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatSessionTime(session.scheduledTime)}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleStartVideoCall(session.patientId, session.patientName, session.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Start Video Call
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedView === 'patients' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">All Patients</h3>
            {filteredPatients.map(patient => (
              <div key={patient.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{patient.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${
                        patient.isOnline ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(patient.riskLevel)}`}>
                        {patient.riskLevel} risk
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      {patient.diagnosis} • Age {patient.age}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span>Sessions: {patient.sessionsCompleted}/{patient.totalSessions}</span>
                      <span className={getMoodTrendColor(patient.moodTrend)}>
                        Mood: {patient.moodTrend}
                      </span>
                    </div>
                    
                    {!patient.isOnline && patient.lastSeen && (
                      <p className="text-xs text-gray-400 mt-1">
                        Last seen: {new Date(patient.lastSeen).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStartVideoCall(patient.id, patient.name)}
                      disabled={!patient.isOnline}
                      className={`px-4 py-2 rounded-md text-sm ${
                        patient.isOnline 
                          ? 'bg-blue-500 text-white hover:bg-blue-600' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {patient.isOnline ? 'Start Call' : 'Offline'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedView === 'emergency' && (
          <div className="space-y-4">
            <h3 className="font-medium text-red-900">Emergency Contacts</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 mb-3">
                High-risk patients and emergency contacts available for immediate video calls
              </p>
            </div>
            
            {emergencyPatients.map(patient => (
              <div key={patient.id} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-red-900">{patient.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${
                        patient.isOnline ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {patient.emergencyContact ? 'Emergency Contact' : 'High Risk'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-red-700 mb-1">
                      {patient.diagnosis} • Risk Level: {patient.riskLevel}
                    </p>
                    
                    <p className="text-sm text-red-600">
                      Mood Trend: {patient.moodTrend}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleStartVideoCall(patient.id, patient.name)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Emergency Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
