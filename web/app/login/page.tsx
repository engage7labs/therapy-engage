'use client'

import { useAuth } from '@/hooks/use-auth'
import { LoginPage } from '@/components/auth/login-page'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Force dynamic rendering - page uses authentication context
export const dynamic = 'force-dynamic'

export default function LoginPageRoute() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && user?.role === 'therapist') {
      router.replace('/dashboard')
    } else if (isAuthenticated && user?.role === 'patient') {
      router.replace('/client-portal')
    }
  }, [isAuthenticated, user, router])

  return <LoginPage />
}