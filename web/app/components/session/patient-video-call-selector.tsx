import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Video, 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  Search,
  Plus,
  CircleDot,
  Warning,
  CheckCircle,
  Heart,
  Brain
} from '@phosphor-icons/react'
import { VideoCallInterface } from './video-call-interface'

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
  const [patients] = useKV('video-call-patients', [
    {
      id: 'patient-001',
      name: 'Ana Silva',
      age: 28,
      diagnosis: 'Anxiety Disorder',
      nextSession: '2025-01-15T14:00:00Z',
      isOnline: true,
      lastSeen: '2025-01-15T13:45:00Z',
      riskLevel: 'low' as const,
      moodTrend: 'improving' as const,
      sessionsCompleted: 8,
      totalSessions: 12,
      preferredCallTime: '14:00-16:00',
      emergencyContact: false
    },
    {
      id: 'patient-002',
      name: 'Carlos Santos',
      age: 34,
      diagnosis: 'Depression',
      nextSession: '2025-01-15T16:00:00Z',
      isOnline: false,
      lastSeen: '2025-01-15T12:30:00Z',
      riskLevel: 'moderate' as const,
      moodTrend: 'stable' as const,
      sessionsCompleted: 4,
      totalSessions: 10,
      preferredCallTime: '16:00-18:00',
      emergencyContact: false
    },
    {
      id: 'patient-003',
      name: 'Maria Oliveira',
      age: 45,
      diagnosis: 'PTSD',
      nextSession: '2025-01-16T10:00:00Z',
      isOnline: true,
      lastSeen: '2025-01-15T13:50:00Z',
      riskLevel: 'high' as const,
      moodTrend: 'declining' as const,
      sessionsCompleted: 12,
      totalSessions: 16,
      preferredCallTime: '10:00-12:00',
      emergencyContact: true
    },
    {
      id: 'patient-004',
      name: 'João Pereira',
      age: 52,
      diagnosis: 'Bipolar Disorder',
      isOnline: false,
      lastSeen: '2025-01-14T15:20:00Z',
      riskLevel: 'moderate' as const,
      moodTrend: 'stable' as const,
      sessionsCompleted: 15,
      totalSessions: 20,
      preferredCallTime: '09:00-11:00',
      emergencyContact: false
    }
  ])

  // Scheduled video sessions
  const [scheduledSessions] = useKV('scheduled-video-sessions', [
    {
      id: 'vsession-001',
      patientId: 'patient-001',
      patientName: 'Ana Silva',
      scheduledTime: '2025-01-15T14:00:00Z',
      type: 'Regular Therapy',
      duration: 50,
      status: 'scheduled' as const,
      isVideoSession: true
    },
    {
      id: 'vsession-002',
      patientId: 'patient-002',
      patientName: 'Carlos Santos',
      scheduledTime: '2025-01-15T16:00:00Z',
      type: 'CBT Session',
      duration: 45,
      status: 'scheduled' as const,
      isVideoSession: true
    },
    {
      id: 'vsession-003',
      patientId: 'patient-003',
      patientName: 'Maria Oliveira',
      scheduledTime: '2025-01-16T10:00:00Z',
      type: 'Trauma Processing',
      duration: 60,
      status: 'scheduled' as const,
      isVideoSession: true
    }
  ])

  // Filter functions
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSessions = scheduledSessions.filter(session =>
    session.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const emergencyPatients = patients.filter(patient => 
    patient.emergencyContact || patient.riskLevel === 'high'
  )

  // Start video call
  const startVideoCall = (patientId: string, patientName: string, sessionId?: string) => {
    const finalSessionId = sessionId || `emergency-${Date.now()}`
    setActiveCall({
      sessionId: finalSessionId,
      patientId,
      patientName
    })
  }

  // End video call
  const endVideoCall = () => {
    setActiveCall(null)
  }

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status color
  const getStatusColor = (patient: Patient) => {
    if (patient.emergencyContact) return 'text-red-500'
    if (patient.riskLevel === 'high') return 'text-orange-500'
    if (patient.isOnline) return 'text-green-500'
    return 'text-gray-500'
  }

  // If in active call, show video interface
  if (activeCall) {
    return (
      <VideoCallInterface
        sessionId={activeCall.sessionId}
        patientId={activeCall.patientId}
        patientName={activeCall.patientName}
        onEndCall={endVideoCall}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Video Sessions</h1>
          <p className="text-muted-foreground">Connect with patients via secure video calls</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={selectedView === 'scheduled' ? 'default' : 'outline'}
            onClick={() => setSelectedView('scheduled')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Scheduled
          </Button>
          <Button
            variant={selectedView === 'patients' ? 'default' : 'outline'}
            onClick={() => setSelectedView('patients')}
          >
            <User className="h-4 w-4 mr-2" />
            All Patients
          </Button>
          <Button
            variant={selectedView === 'emergency' ? 'destructive' : 'outline'}
            onClick={() => setSelectedView('emergency')}
          >
            <Warning className="h-4 w-4 mr-2" />
            Priority
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients or sessions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Scheduled Sessions View */}
      {selectedView === 'scheduled' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.map((session) => {
            const patient = patients.find(p => p.id === session.patientId)
            const isUpcoming = new Date(session.scheduledTime) > new Date()
            const isNow = Math.abs(new Date(session.scheduledTime).getTime() - new Date().getTime()) < 15 * 60 * 1000

            return (
              <Card key={session.id} className={isNow ? 'ring-2 ring-primary' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{session.patientName}</CardTitle>
                    <div className="flex items-center gap-2">
                      {patient?.isOnline && (
                        <CircleDot className="h-4 w-4 text-green-500" />
                      )}
                      {isNow && (
                        <Badge variant="default">Starting Now</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(session.scheduledTime)}</span>
                    <span>•</span>
                    <span>{session.duration} min</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{session.type}</span>
                  </div>
                  
                  {patient && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risk Level:</span>
                      <Badge variant={
                        patient.riskLevel === 'high' ? 'destructive' :
                        patient.riskLevel === 'moderate' ? 'secondary' : 'default'
                      }>
                        {patient.riskLevel}
                      </Badge>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    onClick={() => startVideoCall(session.patientId, session.patientName, session.id)}
                    disabled={!patient?.isOnline && !isNow}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {isNow ? 'Start Session' : 'Join Early'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* All Patients View */}
      {selectedView === 'patients' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => (
            <Card key={patient.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{patient.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <CircleDot className={`h-4 w-4 ${getStatusColor(patient)}`} />
                    {patient.emergencyContact && (
                      <Warning className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {patient.age} years • {patient.diagnosis}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Sessions:</span>
                    <div>{patient.sessionsCompleted}/{patient.totalSessions}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mood:</span>
                    <div className="flex items-center gap-1">
                      <Heart className={`h-3 w-3 ${
                        patient.moodTrend === 'improving' ? 'text-green-500' :
                        patient.moodTrend === 'stable' ? 'text-yellow-500' : 'text-red-500'
                      }`} />
                      {patient.moodTrend}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Preferred Time:</span>
                  <span>{patient.preferredCallTime || 'Flexible'}</span>
                </div>
                
                {patient.lastSeen && !patient.isOnline && (
                  <div className="text-xs text-muted-foreground">
                    Last seen: {new Date(patient.lastSeen).toLocaleString()}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    variant={patient.isOnline ? 'default' : 'secondary'}
                    onClick={() => startVideoCall(patient.id, patient.name)}
                    disabled={!patient.isOnline}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {patient.isOnline ? 'Call Now' : 'Offline'}
                  </Button>
                  
                  {patient.emergencyContact && (
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => startVideoCall(patient.id, patient.name)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Emergency/Priority View */}
      {selectedView === 'emergency' && (
        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-destructive font-medium mb-2">
              <Warning className="h-5 w-5" />
              Priority Patients
            </div>
            <p className="text-sm text-muted-foreground">
              Patients requiring immediate attention or marked as emergency contacts
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {emergencyPatients.map((patient) => (
              <Card key={patient.id} className="border-destructive/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {patient.name}
                      {patient.emergencyContact && (
                        <Badge variant="destructive">Emergency</Badge>
                      )}
                    </CardTitle>
                    <CircleDot className={`h-4 w-4 ${getStatusColor(patient)}`} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {patient.diagnosis} • Risk: {patient.riskLevel}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mood Trend:</span>
                    <span className={
                      patient.moodTrend === 'declining' ? 'text-red-500' :
                      patient.moodTrend === 'stable' ? 'text-yellow-500' : 'text-green-500'
                    }>
                      {patient.moodTrend}
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={() => startVideoCall(patient.id, patient.name)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency Call
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CircleDot className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Online Patients</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {patients.filter(p => p.isOnline).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Today's Sessions</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {scheduledSessions.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Warning className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">High Risk</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {patients.filter(p => p.riskLevel === 'high').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">AI Insights</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              12
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}