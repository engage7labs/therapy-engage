'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to current-version by default
    router.push('/current-version')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Therapy Engage Platform</h1>
        <p className="text-gray-600">Redirecting to platform...</p>
      </div>
    </div>
  )
}
