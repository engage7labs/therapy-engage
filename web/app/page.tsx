'use client'

import { useState } from 'react'
import { useAuth } from './contexts/auth-context'

// Simple login component for now
function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const success = await login(username, password)
      if (!success) {
        alert('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Therapy Engage
          </h2>
          <p className="text-center text-gray-600">Sign in to your account</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center text-sm text-gray-600">
          <p>Demo Accounts:</p>
          <p>Therapist: dr.smith / demo123</p>
          <p>Patient: rodrigo / demo123</p>
          <p>Admin: admin / admin123</p>
        </div>
      </div>
    </div>
  )
}

// Simple dashboard components
function PatientDashboard() {
  const { user, logout } = useAuth()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Patient Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Your Patient Portal
              </h2>
              <p className="text-gray-600">
                Your therapy dashboard will be available here.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Session timeout: {user?.sessionTimeout || 60} minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TherapistDashboard() {
  const { user, logout } = useAuth()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Therapist Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Dr. {user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Overview</h3>
                <p className="text-gray-600">Your patient management dashboard will be here.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Session timeout: {user?.sessionTimeout || 30} minutes
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <p className="text-gray-600">Quick therapy tools and actions will be available here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const { user, logout } = useAuth()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                System Administration
              </h2>
              <p className="text-gray-600">
                Platform management tools will be available here.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Session timeout: {user?.sessionTimeout || 45} minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const { user, isAuthenticated } = useAuth()

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />
  }

  // Show appropriate dashboard based on user role
  if (user?.role === 'patient') {
    return <PatientDashboard />
  }
  
  if (user?.role === 'therapist') {
    return <TherapistDashboard />
  }
  
  if (user?.role === 'admin') {
    return <AdminDashboard />
  }

  // Fallback
  return <LoginPage />
}

export default function HomePage() {
  return <AppContent />
}