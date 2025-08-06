'use client'

import { useAuth } from '@/hooks/use-auth'
import { LoginPage } from '@/components/auth/login-page'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    // Redirect based on authentication and role
    if (isAuthenticated && user?.role === 'therapist') {
      redirect('/dashboard')
    } else if (isAuthenticated && user?.role === 'patient') {
      redirect('/client-portal')
    }
  }, [isAuthenticated, user])

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