'use client'

// Force dynamic rendering to avoid serialization issues
export const dynamic = 'force-dynamic'

import { useAuth } from '../../contexts/auth-context'
import { LoginPage } from '../../../components/auth/login-page'
import { redirect } from 'next/navigation'

export default function LoginPageRoute() {
  const { isAuthenticated, user } = useAuth()

  // Redirect if already authenticated
  if (isAuthenticated && user?.role === 'therapist') {
    redirect('/dashboard')
  }
  
  if (isAuthenticated && user?.role === 'patient') {
    redirect('/client-portal')
  }

  return <LoginPage />
}
