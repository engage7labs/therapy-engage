'use client'

import { useAuth } from '../../../hooks/use-auth'
import { PatientLayout } from '../components/layout/patient-layout'
import { PatientDashboard } from '../components/patient/patient-dashboard'
import { SessionTimeoutManager } from '../components/auth/session-timeout-manager'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// ###desabilitado_mvp### Disable SSG for this auth-required page
export const dynamic = 'force-dynamic'

export default function ClientPortalPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  // ###desabilitado_mvp### Handle redirect client-side to avoid SSG issues
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'patient') {
      router.push('/')
    }
  }, [isAuthenticated, user?.role, router])

  // Show loading or redirect message during auth check
  if (!isAuthenticated || user?.role !== 'patient') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Verificando autenticação...</p>
        </div>
      </div>
    )
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