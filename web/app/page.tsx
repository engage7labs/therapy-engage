'use client'

import { useAuth } from '@/hooks/use-auth'
import { LoginPage } from '@/components/auth/login-page'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Force dynamic rendering - page uses authentication context
export const dynamic = 'force-dynamic'

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect based on authentication and role
    if (isAuthenticated && user?.role === 'therapist') {
      router.replace('/dashboard')
    } else if (isAuthenticated && user?.role === 'patient') {
      router.replace('/client-portal')
    }
  }, [isAuthenticated, user, router])

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />
  }

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-muted-foreground">Redirecting...</div>
    </div>
  )
}