'use client'

import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ClientCard } from '@/components/dashboard/client-card'
import { SessionList } from '@/components/dashboard/session-list'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { QuickActions } from '@/components/dashboard/quick-actions'

// GraphQL queries
const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`

// Mock data for development
const mockClients = [
  {
    id: '1',
    name: 'Sarah Johnson',
    lastSession: '2025-08-04',
    nextSession: '2025-08-07',
    status: 'active' as const,
    riskLevel: 'low' as const,
    moodTrend: 'improving' as const
  },
  {
    id: '2', 
    name: 'Michael Chen',
    lastSession: '2025-08-03',
    nextSession: '2025-08-06',
    status: 'active' as const,
    riskLevel: 'medium' as const,
    moodTrend: 'stable' as const
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    lastSession: '2025-08-02',
    nextSession: '2025-08-08',
    status: 'attention_needed' as const,
    riskLevel: 'high' as const,
    moodTrend: 'declining' as const
  }
]
const mockSessions = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    datetime: '2025-08-07T10:00:00',
    type: 'individual' as const,
    status: 'scheduled' as const
  },
  {
    id: '2',
    clientName: 'Michael Chen', 
    datetime: '2025-08-07T14:30:00',
    type: 'individual' as const,
    status: 'scheduled' as const
  },
  {
    id: '3',
    clientName: 'Emma Rodriguez',
    datetime: '2025-08-08T09:00:00',
    type: 'crisis' as const,
    status: 'priority' as const
  }
]

const mockStats = {
  totalClients: 127,
  activeClients: 89,
  sessionsToday: 6,
  avgMoodScore: 7.2,
  completionRate: 92
}

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week')
  
  // Test GraphQL connection
  const { data, loading, error } = useQuery(HELLO_QUERY, {
    errorPolicy: 'all'
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, Dr. Smith
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your clients today
            </p>
          </div>
          
          {/* API Connection Status */}
          <div className="text-sm">
            {loading && (
              <span className="text-yellow-600">Connecting to API...</span>
            )}
            {data && (
              <span className="text-green-600">✓ API Connected: {data.hello}</span>
            )}
            {error && (
              <span className="text-red-600">⚠ API Error: Check connection</span>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={mockStats} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Clients</h2>
                <select 
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              
              <div className="space-y-3">
                {mockClients.map((client) => (
                  <ClientCard key={client.id} client={client} />
                ))}
              </div>
              
              <button className="w-full mt-4 text-center py-2 text-blue-600 hover:text-blue-800 font-medium">
                View All Clients →
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
              <SessionList sessions={mockSessions} />
              
              <button className="w-full mt-4 text-center py-2 text-blue-600 hover:text-blue-800 font-medium">
                View Schedule →
              </button>
            </div>

            {/* AI Insights Preview */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="font-medium text-yellow-800">Attention Needed</p>
                  <p className="text-yellow-700">
                    Emma Rodriguez shows declining mood pattern
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="font-medium text-green-800">Progress Update</p>
                  <p className="text-green-700">
                    Sarah Johnson's anxiety levels improving
                  </p>
                </div>
              </div>
              
              <button className="w-full mt-4 text-center py-2 text-blue-600 hover:text-blue-800 font-medium">
                View All Insights →
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}