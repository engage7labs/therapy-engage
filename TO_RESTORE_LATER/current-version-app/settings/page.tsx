'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SettingsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main app
    router.push('/')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p className="text-gray-600">Redirecting to main application...</p>
      </div>
    </div>
  )
}
