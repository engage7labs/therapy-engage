'use client'

import { useAuth } from '@/contexts/auth-context'
import { SettingsPage } from '@/components/settings/settings-page'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { redirect } from 'next/navigation'
import { useKV } from '@github/spark/hooks'

export default function SettingsPageRoute() {
  const { user, isAuthenticated } = useAuth()

  // Redirect if not authenticated
  if (!isAuthenticated) {
    redirect('/login')
  }

  const [currentTherapist] = useKV("current-therapist", {
    id: "dr-smith",
    name: "Dr. Smith", 
    license: "CRP-123456",
    specialization: ""
  })

  if (user?.role === 'therapist') {
    return (
      <DashboardLayout 
        therapist={currentTherapist}
        activeView="settings"
        onNavigate={() => {}}
      >
        <SettingsPage />
      </DashboardLayout>
    )
  }

  // For patients, show settings without therapist layout
  return <SettingsPage />
}