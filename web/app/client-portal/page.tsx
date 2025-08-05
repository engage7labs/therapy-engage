'use client'

import { useAuth } from '@/contexts/auth-context'
import { PatientLayout } from '@/components/layout/patient-layout'
import { PatientDashboard } from '@/components/patient/patient-dashboard'
import { SessionTimeoutManager } from '@/components/auth/session-timeout-manager'
import { redirect } from 'next/navigation'

export default function ClientPortalPage() {
  const { user, isAuthenticated } = useAuth()

  // Redirect if not authenticated or not a patient
  if (!isAuthenticated || user?.role !== 'patient') {
    redirect('/')
  }

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