'use client'

// Force dynamic rendering to avoid serialization issues
export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'

export default function PreliminaryDashboardPage() {
  // Redirect to current version
  redirect('/current-version/dashboard')
}
