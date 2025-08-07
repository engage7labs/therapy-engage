'use client'

// Force dynamic rendering to avoid serialization issues
export const dynamic = 'force-dynamic'

import { useAuth } from '@/contexts/auth-context'
import { SessionManager } from '@/components/session/session-manager'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { redirect } from 'next/navigation'
import { useKV } from '@/hooks/use-kv'

export default function SessionsPageRoute() {
  const { user, isAuthenticated } = useAuth()

  // Redirect if not authenticated or not a therapist
  if (!isAuthenticated || user?.role !== 'therapist') {
    redirect('/')
  }

  const [currentTherapist] = useKV("current-therapist", {
    id: "dr-smith",
    name: "Dr. Smith",
    license: "CRP-123456", 
    specialization: ""
  })

  return (
    <DashboardLayout 
      therapist={currentTherapist}
      activeView="sessions"
      onNavigate={() => {}}
    >
      <SessionManager />
    </DashboardLayout>
  )
}
