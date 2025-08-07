'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  Video,
  FileText,
  Heart,
  Brain,
  User,
  Bell,
  Settings,
  LogOut
} from 'lucide-react'

interface PatientSession {
  id: string
  therapistName: string
  scheduledTime: string
  duration: number
  type: 'video-therapy' | 'consultation' | 'follow-up'
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled'
}

interface PatientData {
  id: string
  name: string
  email: string
  nextAppointment?: PatientSession
  recentSessions: PatientSession[]
  therapistName: string
  treatmentPlan: string
  progressScore: number
}

export default function PatientPortal() {
  const [activeView, setActiveView] = useState<'dashboard' | 'sessions' | 'progress' | 'resources'>('dashboard')
  
  // Mock patient data
  const patientData: PatientData = {
    id: 'patient-001',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    therapistName: 'Dr. Emily Smith',
    treatmentPlan: 'Cognitive Behavioral Therapy for Anxiety',
    progressScore: 78,
    nextAppointment: {
      id: 'session-001',
      therapistName: 'Dr. Emily Smith',
      scheduledTime: '2025-08-07T14:00:00Z',
      duration: 50,
      type: 'video-therapy',
      status: 'upcoming'
    },
    recentSessions: [
      {
        id: 'session-002',
        therapistName: 'Dr. Emily Smith',
        scheduledTime: '2025-08-01T14:00:00Z',
        duration: 50,
        type: 'video-therapy',
        status: 'completed'
      },
      {
        id: 'session-003',
        therapistName: 'Dr. Emily Smith',
        scheduledTime: '2025-07-25T14:00:00Z',
        duration: 30,
        type: 'follow-up',
        status: 'completed'
      }
    ]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming': return <Badge className="bg-blue-500">Upcoming</Badge>
      case 'in-progress': return <Badge className="bg-green-500">In Progress</Badge>
      case 'completed': return <Badge variant="secondary">Completed</Badge>
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl">Welcome back, {patientData.name}</h2>
              <p className="text-muted-foreground">Your mental health journey continues</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Next Appointment */}
      {patientData.nextAppointment && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Next Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-lg font-semibold">{formatDate(patientData.nextAppointment.scheduledTime)}</p>
                <p className="text-muted-foreground">
                  with {patientData.nextAppointment.therapistName} • {patientData.nextAppointment.duration} minutes
                </p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(patientData.nextAppointment.status)}
                  <Badge variant="outline">{patientData.nextAppointment.type}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Join Session
                </Button>
                <Button variant="outline" className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Wellness Score</p>
                <p className={`text-2xl font-bold ${getProgressColor(patientData.progressScore)}`}>
                  {patientData.progressScore}/100
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
                <p className="text-2xl font-bold">{patientData.recentSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Treatment Plan</p>
                <p className="text-sm font-medium">{patientData.treatmentPlan}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patientData.recentSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium">{formatDate(session.scheduledTime)}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.therapistName} • {session.duration} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(session.status)}
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Notes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSessions = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <p className="text-muted-foreground">
            View all your therapy sessions and appointments
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[patientData.nextAppointment, ...patientData.recentSessions]
              .filter(Boolean)
              .map((session) => (
              <div key={session!.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{formatDate(session!.scheduledTime)}</h3>
                      {getStatusBadge(session!.status)}
                    </div>
                    <p className="text-muted-foreground">
                      {session!.therapistName} • {session!.duration} minutes
                    </p>
                    <Badge variant="outline">{session!.type}</Badge>
                  </div>
                  <div className="space-y-2">
                    {session!.status === 'upcoming' && (
                      <Button>
                        <Video className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    )}
                    {session!.status === 'completed' && (
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Notes
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderProgress = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Your Progress Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Score */}
            <div className="text-center">
              <div className={`text-6xl font-bold ${getProgressColor(patientData.progressScore)} mb-2`}>
                {patientData.progressScore}
              </div>
              <p className="text-lg text-muted-foreground">Overall Wellness Score</p>
              <div className="w-full bg-secondary rounded-full h-3 mt-4">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${patientData.progressScore}%` }}
                />
              </div>
            </div>

            {/* Treatment Plan */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Current Treatment Plan</h3>
                <p className="text-muted-foreground">{patientData.treatmentPlan}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Therapist: {patientData.therapistName}
                </p>
              </CardContent>
            </Card>

            {/* Progress Milestones */}
            <div className="space-y-3">
              <h3 className="font-semibold">Recent Milestones</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium">Completed anxiety assessment</p>
                    <p className="text-sm text-muted-foreground">August 1, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <div>
                    <p className="font-medium">Started daily mood tracking</p>
                    <p className="text-sm text-muted-foreground">July 25, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderResources = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mental Health Resources</CardTitle>
          <p className="text-muted-foreground">
            Helpful resources and tools for your mental health journey
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Breathing Exercises</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Guided breathing exercises for anxiety relief
                </p>
                <Button variant="outline" className="w-full">
                  Start Exercise
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Mood Tracker</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Track your daily mood and emotional patterns
                </p>
                <Button variant="outline" className="w-full">
                  Log Mood
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Crisis Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  24/7 crisis support and emergency contacts
                </p>
                <Button variant="destructive" className="w-full">
                  Get Help Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Educational Articles</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn about mental health topics and coping strategies
                </p>
                <Button variant="outline" className="w-full">
                  Browse Articles
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="therapy-gradient w-10 h-10 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Therapy Engage</h1>
                <p className="text-sm text-muted-foreground">Patient Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: User },
              { key: 'sessions', label: 'Sessions', icon: Video },
              { key: 'progress', label: 'Progress', icon: Brain },
              { key: 'resources', label: 'Resources', icon: FileText }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveView(item.key as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeView === item.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'sessions' && renderSessions()}
        {activeView === 'progress' && renderProgress()}
        {activeView === 'resources' && renderResources()}
      </main>
    </div>
  )
}
