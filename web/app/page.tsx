'use client'

import { useState } from 'react'
import { useAuth } from './contexts/auth-context'
import { useTheme } from '../hooks/use-theme'
import { SessionManager } from '../components/session/SessionManager'
import { UpcomingSessions } from '../components/session/UpcomingSessions'
import { PatientVideoCallSelector } from '../components/session/PatientVideoCallSelector'
import { SimpleThemeLanguageToggle } from '../components/settings/simple-theme-language-toggle'

// Simple login component for now
function LoginPage() {
  const { login } = useAuth()
  const { t } = useTheme()
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
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      {/* Theme/Language Controls */}
      <div className="absolute top-4 right-4">
        <SimpleThemeLanguageToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-md border">
        <div>
          <h2 className="text-3xl font-bold text-center text-foreground mb-2">
            Therapy Engage
          </h2>
          <p className="text-center text-muted-foreground">{t('login.title')}</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground">
              {t('login.username')}
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder={t('login.username')}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              {t('login.password')}
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
        
        {/* Debug button to clear localStorage */}
        <div className="mt-4 text-center">
          <button 
            onClick={() => {
              localStorage.clear()
              window.location.reload()
            }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear Storage & Reload (Debug)
          </button>
        </div>
      </div>
    </div>
  )
}

// Simple dashboard components
function PatientDashboard() {
  const { user, logout } = useAuth()
  
  // Demo data for patient's upcoming sessions
  const patientSessions = [
    {
      id: 'session-patient-001',
      therapistName: 'Dr. Sarah Johnson',
      date: '2025-01-15T14:00:00Z',
      type: 'Follow-up Session',
      duration: 50,
      status: 'scheduled',
      isVideoSession: true
    },
    {
      id: 'session-patient-002', 
      therapistName: 'Dr. Sarah Johnson',
      date: '2025-01-22T14:00:00Z',
      type: 'CBT Session',
      duration: 45,
      status: 'scheduled',
      isVideoSession: false
    }
  ]

  const formatSessionTime = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">Patient Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <SimpleThemeLanguageToggle />
              <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-primary hover:text-primary/80"
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
            {/* Upcoming Sessions */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Upcoming Sessions</h3>
                <div className="space-y-4">
                  {patientSessions.map(session => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{session.therapistName}</h4>
                          <p className="text-sm text-gray-600">
                            {session.type} • {session.duration} minutes
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatSessionTime(session.date)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.isVideoSession 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {session.isVideoSession ? 'Video Session' : 'In-Person'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {session.isVideoSession && (
                            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                              Join Video
                            </button>
                          )}
                          <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {patientSessions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No upcoming sessions scheduled
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Progress */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Progress</h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900">Sessions Completed</h4>
                    <p className="text-2xl font-bold text-blue-600">8 / 12</p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full w-2/3"></div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900">Mood Progress</h4>
                    <p className="text-sm text-green-700">Showing improvement</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-green-600">📈</span>
                      <span className="text-sm text-green-600">Trending upward</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Quick Actions</h4>
                    <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                      Schedule New Session
                    </button>
                    <button className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600">
                      Message Therapist
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  Session timeout: {user?.sessionTimeout || 60} minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TherapistDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'sessions' | 'upcoming' | 'video'>('sessions')
  
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">Therapist Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <SimpleThemeLanguageToggle />
              <span className="text-sm text-muted-foreground">Dr. {user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-primary hover:text-primary/80"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('sessions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sessions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Session Management
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upcoming'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Upcoming Sessions
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'video'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Video Calls
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'sessions' && (
              <SessionManager />
            )}
            
            {activeTab === 'upcoming' && (
              <UpcomingSessions />
            )}
            
            {activeTab === 'video' && (
              <PatientVideoCallSelector />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const { user, logout } = useAuth()
  
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <SimpleThemeLanguageToggle />
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-primary hover:text-primary/80"
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