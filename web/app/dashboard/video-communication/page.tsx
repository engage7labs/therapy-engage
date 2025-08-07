'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WebRTCSessionRecorder } from '@/components/session/WebRTCSessionRecorder'
import { VideoCallInterface } from '@/components/session/VideoCallInterface'
import {
  Video,
  Phone,
  PlayCircle,
  Users,
  Calendar,
  Clock,
  Activity,
  Settings,
  Shield,
  Zap
} from 'lucide-react'

interface ActiveSession {
  id: string
  patientName: string
  patientId: string
  startTime: string
  type: 'video-call' | 'recording' | 'emergency'
  status: 'active' | 'waiting' | 'ended'
}

interface ScheduledSession {
  id: string
  patientName: string
  patientId: string
  scheduledTime: string
  duration: number
  type: 'video-therapy' | 'consultation' | 'follow-up'
  status: 'upcoming' | 'ready' | 'missed'
}

export default function VideoCommunicationPage() {
  const [activeTab, setActiveTab] = useState('video-calls')
  const [activeSessions] = useState<ActiveSession[]>([
    {
      id: 'session-1',
      patientName: 'Ana Silva',
      patientId: 'patient-1',
      startTime: '14:30',
      type: 'video-call',
      status: 'active'
    }
  ])

  const [scheduledSessions] = useState<ScheduledSession[]>([
    {
      id: 'sched-1',
      patientName: 'Carlos Santos',
      patientId: 'patient-2', 
      scheduledTime: '15:00',
      duration: 60,
      type: 'video-therapy',
      status: 'upcoming'
    },
    {
      id: 'sched-2',
      patientName: 'Maria Oliveira',
      patientId: 'patient-3',
      scheduledTime: '16:00', 
      duration: 45,
      type: 'follow-up',
      status: 'ready'
    }
  ])

  const [selectedPatient, setSelectedPatient] = useState<{id: string, name: string} | null>(null)
  const [currentView, setCurrentView] = useState<'dashboard' | 'video-call' | 'recording'>('dashboard')

  const startVideoCall = (patientId: string, patientName: string) => {
    setSelectedPatient({ id: patientId, name: patientName })
    setCurrentView('video-call')
  }

  const startRecording = (patientId: string, patientName: string) => {
    setSelectedPatient({ id: patientId, name: patientName })
    setCurrentView('recording')
  }

  const returnToDashboard = () => {
    setSelectedPatient(null)
    setCurrentView('dashboard')
  }

  // Video Call Interface
  if (currentView === 'video-call' && selectedPatient) {
    return (
      <div className="container mx-auto p-6">
        <VideoCallInterface
          sessionId={`call-${Date.now()}`}
          patientName={selectedPatient.name}
          patientId={selectedPatient.id}
          onEndCall={returnToDashboard}
          testMode={true}
          testScenario="normal"
        />
      </div>
    )
  }

  // Recording Interface  
  if (currentView === 'recording' && selectedPatient) {
    return (
      <div className="container mx-auto p-6">
        <WebRTCSessionRecorder
          sessionId={`rec-${Date.now()}`}
          patientName={selectedPatient.name}
          patientId={selectedPatient.id}
          onSessionComplete={(session) => {
            console.log('Session completed:', session)
            returnToDashboard()
          }}
          onSessionEnd={returnToDashboard}
          demoMode={true}
        />
      </div>
    )
  }

  // Main Dashboard
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Communication</h1>
          <p className="text-muted-foreground">
            Secure video calls and session recording
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => startVideoCall('emergency', 'Emergency Session')}>
            <Zap className="h-4 w-4 mr-2" />
            Emergency Call
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeSessions.length}</p>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{scheduledSessions.length}</p>
                <p className="text-sm text-muted-foreground">Scheduled Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Online Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="video-calls">Video Calls</TabsTrigger>
          <TabsTrigger value="recording">Session Recording</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Video Calls Tab */}
        <TabsContent value="video-calls" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start" 
                  size="lg"
                  onClick={() => startVideoCall('new', 'New Patient')}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Start Video Call
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="lg"
                  onClick={() => startVideoCall('group', 'Group Session')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Group Session
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="lg"
                  onClick={() => startVideoCall('emergency', 'Emergency Session')}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Emergency Session
                </Button>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeSessions.length > 0 ? (
                  <div className="space-y-3">
                    {activeSessions.map((session) => (
                      <div 
                        key={session.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <div>
                            <p className="font-medium">{session.patientName}</p>
                            <p className="text-sm text-muted-foreground">
                              Started at {session.startTime}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default">
                          {session.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active sessions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Session Recording Tab */}
        <TabsContent value="recording" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recording Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Recording Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start" 
                  size="lg"
                  onClick={() => startRecording('new', 'New Recording Session')}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Recording Session
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="lg"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Demo Recording
                </Button>
              </CardContent>
            </Card>

            {/* Recording Info */}
            <Card>
              <CardHeader>
                <CardTitle>Recording Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    End-to-end encryption
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    Real-time transcription
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    AI-powered insights
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    Automatic timestamping
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scheduled Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today&apos;s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledSessions.map((session) => (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-bold text-lg">{session.scheduledTime}</p>
                        <p className="text-xs text-muted-foreground">{session.duration}min</p>
                      </div>
                      <div>
                        <p className="font-medium">{session.patientName}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {session.type.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={session.status === 'ready' ? 'default' : 'secondary'}>
                        {session.status}
                      </Badge>
                      {session.status === 'ready' && (
                        <Button 
                          size="sm"
                          onClick={() => startVideoCall(session.patientId, session.patientName)}
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No session history available</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Completed sessions will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
