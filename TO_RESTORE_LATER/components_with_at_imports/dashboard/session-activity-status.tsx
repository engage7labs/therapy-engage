'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, AlertCircle, Play, Pause, Users, Clock } from 'lucide-react'
import { useKV } from '@/hooks/use-kv'

interface ActiveSession {
  id: string
  patientName: string
  type: 'individual' | 'group' | 'emergency'
  startTime: string
  duration: string
  status: 'active' | 'paused' | 'waiting'
}

export function SessionActivityStatus() {
  const [activeSessions] = useKV('active-sessions', [
    {
      id: '1',
      patientName: 'Ana Silva',
      type: 'individual',
      startTime: '14:00',
      duration: '25min',
      status: 'active'
    },
    {
      id: '2',
      patientName: 'Group Session B',
      type: 'group',
      startTime: '15:30',
      duration: '15min',
      status: 'paused'
    }
  ] as ActiveSession[])

  const getStatusColor = (status: ActiveSession['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'waiting': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: ActiveSession['type']) => {
    switch (type) {
      case 'individual': return Users
      case 'group': return Users
      case 'emergency': return AlertCircle
      default: return Users
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Active Sessions
          </CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {activeSessions.filter(s => s.status === 'active').length} Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeSessions.map((session) => {
            const TypeIcon = getTypeIcon(session.type)
            return (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <TypeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {session.patientName}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Started: {session.startTime}</span>
                      <span>•</span>
                      <span>Duration: {session.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                  
                  <div className="flex space-x-1">
                    {session.status === 'active' ? (
                      <Button variant="ghost" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {activeSessions.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Activity className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2">No active sessions</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
