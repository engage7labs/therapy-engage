'use client'

// Force dynamic rendering to avoid serialization issues
export const dynamic = 'force-dynamic'

import { useAuth } from '../../contexts/auth-context'
import { redirect } from 'next/navigation'

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    redirect('/current-version/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <p>Welcome, {user?.username}!</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Settings page is being set up. Check back soon!
          </p>
        </div>
      </div>
    </div>
  )
}
