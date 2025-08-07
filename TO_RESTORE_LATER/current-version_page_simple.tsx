'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'

export default function CurrentVersionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Therapy Engage
          </h1>
          <p className="text-gray-600 mb-8">
            Professional Therapy Platform
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => router.push('/current-version/login')}
            className="w-full"
          >
            Login to Platform
          </Button>
          
          <Button 
            onClick={() => router.push('/current-version/dashboard')}
            variant="outline"
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
