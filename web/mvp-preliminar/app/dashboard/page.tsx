'use client'

import { useState } from 'react'
import { useKV } from '@/hooks/use-kv'
import { useAuth } from '@/contexts/auth-context'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { PatientList } from '@/components/dashboard/patient-list'
import { UpcomingSessions } from '@/components/dashboard/upcoming-sessions'
import { RecentInsights } from '@/components/dashboard/recent-insights'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { SessionActivityStatus } from '@/components/dashboard/session-activity-status'
import { CriticalAudioAlerts } from '@/components/dashboard/critical-audio-alerts'
import { EmergencySessionSimulator } from '@/components/dashboard/emergency-session-simulator'
import { EmergencyWhatsAppContact } from '@/components/dashboard/emergency-whatsapp-contact'
import { FloatingSessionMonitor } from '@/components/dashboard/floating-session-monitor'
import { DemoGuide } from '@/components/demo/demo-guide'
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [showFloatingMonitor, setShowFloatingMonitor] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useKV<any[]>('critical-alerts', [])

  // Redirect if not authenticated or not a therapist
  if (!isAuthenticated || user?.role !== 'therapist') {
    redirect('/')
  }

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
      consentForEmergencyContact: false
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

  const handleTriggerAlert = (alert: any) => {
    setCriticalAlerts([alert, ...criticalAlerts])
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    setCriticalAlerts(
      criticalAlerts.map((alert: any) => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    )
  }

  return (
    <>
      <DashboardLayout 
        therapist={currentTherapist}
        activeView="dashboard"
        onNavigate={() => {}} // Navigation handled by Next.js router
      >
        <div className="space-y-6">
          {/* Demo Guide - Show first */}
          <DemoGuide onStartDemo={() => window.location.href = '/sessions'} />
          
          {/* Clinical Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsOverview 
              patients={patients}
              sessions={upcomingSessions}
              insights={recentInsights as any}
            />
          </div>

          {/* Main Dashboard Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <PatientList patients={patients as any} />
              <UpcomingSessions sessions={upcomingSessions as any} />
            </div>
            
            <div className="space-y-6">
              <EmergencyWhatsAppContact 
                patients={patients as any}
                onContactInitiated={(contactId) => {
                  console.log('Emergency contact initiated:', contactId)
                }}
              />
              <CriticalAudioAlerts 
                onNavigateToSession={(sessionId) => {
                  console.log('Navigating to session from alert:', sessionId)
                  window.location.href = '/sessions'
                }}
                onAcknowledgeAlert={handleAcknowledgeAlert}
              />
              <SessionActivityStatus 
                onJoinSession={(sessionId) => {
                  console.log('Joining session:', sessionId)
                  window.location.href = '/sessions'
                }}
                onViewDetails={(sessionId) => {
                  console.log('Viewing session details:', sessionId)
                  window.location.href = '/sessions'
                }}
              />
              <EmergencySessionSimulator onTriggerAlert={handleTriggerAlert} />
              <QuickActions onNavigate={() => {}} patients={patients as any} />
              <RecentInsights insights={recentInsights as any} />
            </div>
          </div>
        </div>
      </DashboardLayout>
      
      {/* Floating Session Monitor */}
      {showFloatingMonitor && (
        <FloatingSessionMonitor
          onClose={() => setShowFloatingMonitor(false)}
          onNavigateToSession={(sessionId) => {
            console.log('Navigating to session from floating monitor:', sessionId)
            window.location.href = '/sessions'
          }}
        />
      )}
    </>
  )
}