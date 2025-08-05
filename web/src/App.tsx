import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from './contexts/auth-context'
import { ThemeProvider } from './contexts/theme-context'
import { LoginPage } from './components/auth/login-page'
import { SessionTimeoutManager } from './components/auth/session-timeout-manager'
import { LoginSystemTester } from './components/auth/login-system-tester'
import { DashboardLayout } from './components/layout/dashboard-layout'
import { PatientLayout } from './components/layout/patient-layout'
import { PatientDashboard } from './components/patient/patient-dashboard'
import { SettingsPage } from './components/settings/settings-page'
import { StatsOverview } from './components/dashboard/stats-overview'
import { PatientList } from './components/dashboard/patient-list'
import { UpcomingSessions } from './components/dashboard/upcoming-sessions'
import { RecentInsights } from './components/dashboard/recent-insights'
import { QuickActions } from './components/dashboard/quick-actions'
import { SessionActivityStatus } from './components/dashboard/session-activity-status'
import { CriticalAudioAlerts } from './components/dashboard/critical-audio-alerts'
import { EmergencySessionSimulator } from './components/dashboard/emergency-session-simulator'
import { EmergencyWhatsAppContact } from './components/dashboard/emergency-whatsapp-contact'
import { FloatingSessionMonitor } from './components/dashboard/floating-session-monitor'
import { SessionManager } from './components/session/session-manager'
import { PatientVideoCallSelector } from './components/session/patient-video-call-selector'
import { SecureSessionRecorder } from './components/session/secure-session-recorder'
import { ConsentManagementDashboard } from './components/session/consent-management-dashboard'
import { DemoGuide } from './components/demo/demo-guide'
import { WebRTCTester } from './components/demo/webrtc-tester'
import { SessionTimeoutTester } from './components/demo/session-timeout-tester'
import { SessionTimeoutGuide } from './components/demo/session-timeout-guide'
import { ComprehensiveVideoTest } from './components/session/comprehensive-video-test'
import { GDPRConsentWorkflowTester } from './components/session/gdpr-consent-workflow-tester'
import { InternationalConsentTester } from './components/session/international-consent-tester'
import { BrazilianConsentTester } from './components/session/brazilian-consent-tester'
import { TooltipDemoPage } from './components/demo/tooltip-demo-page'

function AppContent() {
  const { user, isAuthenticated } = useAuth()

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />
  }

  // Show patient portal if user is a patient
  if (user?.role === 'patient') {
    return (
      <>
        <SessionTimeoutManager 
          sessionTimeoutMinutes={user.sessionTimeout || 60}
          warningTimeMinutes={10}
          autoExtendOnActivity={true}
          showActivityIndicator={true}
        />
        <PatientLayout>
          <PatientDashboard />
        </PatientLayout>
      </>
    )
  }

  // Show therapist dashboard if user is a therapist
  return (
    <>
      <SessionTimeoutManager 
        sessionTimeoutMinutes={user?.sessionTimeout || 30}
        warningTimeMinutes={5}
        autoExtendOnActivity={true}
        showActivityIndicator={true}
      />
      <TherapistApp />
    </>
  )
}

function TherapistApp() {
  // Navigation state
  const [activeView, setActiveView] = useState('dashboard')
  const [showFloatingMonitor, setShowFloatingMonitor] = useState(true)

  // Critical alerts state
  const [criticalAlerts, setCriticalAlerts] = useKV<any[]>('critical-alerts', [])

  // Persist therapist preferences and session data
  const [currentTherapist] = useKV("current-therapist", {
    id: "dr-smith",
    name: "Dr. Smith",
    license: "CRP-123456",
    specialization: ""
  })

  const [patients] = useKV("patients", [
    {
      id: "patient-001",
      name: "Ana Silva",
      age: 28,
      diagnosis: "Anxiety Disorder",
      nextSession: "2025-01-15T14:00:00Z",
      riskLevel: "low",
      moodTrend: "improving",
      sessionsCompleted: 8,
      totalSessions: 12,
      phone: "+5511987654321",
      emergencyContact: "+5511999888777",
      consentForEmergencyContact: true,
      lastWhatsAppContact: "2025-01-10T10:30:00Z"
    },
    {
      id: "patient-002", 
      name: "Carlos Santos",
      age: 34,
      diagnosis: "Depression",
      nextSession: "2025-01-15T16:00:00Z",
      riskLevel: "moderate",
      moodTrend: "stable",
      sessionsCompleted: 4,
      totalSessions: 10,
      phone: "+5511876543210",
      emergencyContact: "+5511888777666",
      consentForEmergencyContact: true,
      lastWhatsAppContact: "2025-01-12T15:45:00Z"
    },
    {
      id: "patient-003",
      name: "Maria Oliveira", 
      age: 45,
      diagnosis: "PTSD",
      nextSession: "2025-01-16T10:00:00Z",
      riskLevel: "high",
      moodTrend: "declining",
      sessionsCompleted: 12,
      totalSessions: 16,
      phone: "+5511765432109",
      emergencyContact: "+5511777666555",
      consentForEmergencyContact: true,
      lastWhatsAppContact: "2025-01-14T08:20:00Z"
    },
    {
      id: "patient-004",
      name: "João Costa",
      age: 52,
      diagnosis: "Severe Depression",
      nextSession: "2025-01-15T11:00:00Z",
      riskLevel: "critical",
      moodTrend: "declining",
      sessionsCompleted: 3,
      totalSessions: 20,
      phone: "+5511654321098",
      emergencyContact: "+5511666555444",
      consentForEmergencyContact: true,
      lastWhatsAppContact: null
    },
    {
      id: "patient-005",
      name: "Petra Müller",
      age: 31,
      diagnosis: "Burnout Syndrome",
      nextSession: "2025-01-17T09:00:00Z",
      riskLevel: "moderate",
      moodTrend: "stable",
      sessionsCompleted: 6,
      totalSessions: 15,
      phone: "+49157123456789",
      emergencyContact: "+49157987654321",
      consentForEmergencyContact: false // No consent for emergency contact
    }
  ])

  const [upcomingSessions] = useKV("upcoming-sessions", [
    {
      id: "session-001",
      patientName: "Ana Silva",
      time: "2025-01-15T14:00:00Z",
      type: "Individual Therapy",
      duration: 50,
      status: "confirmed"
    },
    {
      id: "session-002",
      patientName: "Carlos Santos", 
      time: "2025-01-15T16:00:00Z",
      type: "CBT Session",
      duration: 45,
      status: "confirmed"
    },
    {
      id: "session-003",
      patientName: "Maria Oliveira",
      time: "2025-01-16T10:00:00Z", 
      type: "PTSD Treatment",
      duration: 60,
      status: "pending"
    }
  ])

  const [recentInsights] = useKV("recent-insights", [
    {
      id: "insight-001",
      patientName: "Ana Silva",
      type: "mood-improvement",
      summary: "Significant reduction in anxiety symptoms over the last 3 sessions",
      confidence: 0.87,
      timestamp: "2025-01-14T10:30:00Z",
      recommendation: "Consider gradual exposure therapy introduction"
    },
    {
      id: "insight-002", 
      patientName: "Maria Oliveira",
      type: "risk-alert",
      summary: "Increased mention of avoidance behaviors and sleep disturbances",
      confidence: 0.92,
      timestamp: "2025-01-14T09:15:00Z", 
      recommendation: "Immediate follow-up recommended for safety assessment"
    },
    {
      id: "insight-003",
      patientName: "Carlos Santos",
      type: "progress-milestone",
      summary: "Patient shows consistent engagement with homework assignments",
      confidence: 0.78,
      timestamp: "2025-01-13T16:45:00Z",
      recommendation: "Increase cognitive restructuring exercises complexity"
    }
  ])

  // Alert handling functions
  const handleTriggerAlert = (alert: any) => {
    setCriticalAlerts(current => [alert, ...current])
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    setCriticalAlerts(current => 
      current.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    )
  }

  const renderContent = () => {
    switch (activeView) {
      case 'settings':
        return <SettingsPage />
      case 'tooltip-demo':
        return <TooltipDemoPage />
      case 'login-tester':
        return <LoginSystemTester />
      case 'timeout-tester':
        return <SessionTimeoutTester />
      case 'timeout-guide':
        return <SessionTimeoutGuide />
      case 'emergency-simulator':
        return <EmergencySessionSimulator onTriggerAlert={handleTriggerAlert} />
      case 'sessions':
        return <SessionManager />
      case 'secure-sessions':
        return (
          <SecureSessionRecorder 
            sessionId="session-001"
            patientId="patient-001"
            patientName="Ana Silva"
            therapistId="dr-smith"
          />
        )
      case 'consent-management':
        return <ConsentManagementDashboard />
      case 'gdpr-tester':
        return <GDPRConsentWorkflowTester />
      case 'international-consent':
        return <InternationalConsentTester />
      case 'brazilian-consent':
        return <BrazilianConsentTester />
      case 'video-calls':
        return <PatientVideoCallSelector />
      case 'comprehensive-test':
        return <ComprehensiveVideoTest />
      case 'webrtc-tester':
        return <WebRTCTester />
      case 'demo':
        return <DemoGuide onStartDemo={() => setActiveView('sessions')} />
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Demo Guide - Show first */}
            <DemoGuide onStartDemo={() => setActiveView('login-tester')} />
            
            {/* Clinical Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatsOverview 
                patients={patients}
                sessions={upcomingSessions}
                insights={recentInsights}
              />
            </div>

            {/* Main Dashboard Content */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <PatientList patients={patients} />
                <UpcomingSessions sessions={upcomingSessions} />
              </div>
              
              <div className="space-y-6">
                <EmergencyWhatsAppContact 
                  patients={patients}
                  onContactInitiated={(contactId) => {
                    console.log('Emergency contact initiated:', contactId)
                  }}
                />
                <CriticalAudioAlerts 
                  onNavigateToSession={(sessionId) => {
                    console.log('Navigating to session from alert:', sessionId)
                    setActiveView('secure-sessions')
                  }}
                  onAcknowledgeAlert={handleAcknowledgeAlert}
                />
                <SessionActivityStatus 
                  onJoinSession={(sessionId) => {
                    console.log('Joining session:', sessionId)
                    setActiveView('secure-sessions')
                  }}
                  onViewDetails={(sessionId) => {
                    console.log('Viewing session details:', sessionId)
                    setActiveView('sessions')
                  }}
                />
                <EmergencySessionSimulator onTriggerAlert={handleTriggerAlert} />
                <QuickActions onNavigate={setActiveView} patients={patients} />
                <RecentInsights insights={recentInsights} />
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <DashboardLayout 
        therapist={currentTherapist}
        activeView={activeView}
        onNavigate={setActiveView}
      >
        {renderContent()}
      </DashboardLayout>
      
      {/* Floating Session Monitor */}
      {showFloatingMonitor && activeView !== 'dashboard' && (
        <FloatingSessionMonitor
          onClose={() => setShowFloatingMonitor(false)}
          onNavigateToSession={(sessionId) => {
            console.log('Navigating to session from floating monitor:', sessionId)
            setActiveView('secure-sessions')
          }}
        />
      )}
    </>
  )
}

function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  )
}

export default App