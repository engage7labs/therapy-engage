'use client'

import { AppProviders } from '@/components/app-providers'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

export default function HomePage() {
  return (
    <AppProviders>
      <DashboardLayout />
    </AppProviders>
  )
}
