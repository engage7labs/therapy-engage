'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Video, User } from 'lucide-react'
import { useKV } from '@/hooks/use-kv'

interface Session {
  id: string
  patientName: string
  time: string
  duration: string
  type: 'individual' | 'group' | 'emergency'
  status: 'scheduled' | 'confirmed' | 'in-progress'
}

export function UpcomingSessions() {
  const [upcomingSessions] = useKV('upcoming-sessions', [
    {
      id: '1',
      patientName: 'Ana Silva',
      time: '14:00',
      duration: '50min',
      type: 'individual',
      status: 'confirmed'
    },
    {
      id: '2',
      patientName: 'Carlos Santos',
      time: '15:00',
      duration: '50min',
      type: 'individual',
      status: 'scheduled'
    },
    {
      id: '3',
      patientName: 'Group Session A',
      time: '16:00',
      duration: '90min',
      type: 'group',
      status: 'confirmed'
    }
  ] as Session[])

  const getTypeColor = (type: Session['type']) => {
    switch (type) {
      case 'individual': return 'bg-blue-100 text-blue-800'
      case 'group': return 'bg-purple-100 text-purple-800'
      case 'emergency': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Upcoming Sessions
          </CardTitle>
          <Button variant="outline" size="sm">
            Schedule New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">
                    {session.time}
                  </span>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {session.patientName}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Duration: {session.duration}</span>
                    <span>•</span>
                    <Badge className={getTypeColor(session.type)}>
                      {session.type}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(session.status)}>
                  {session.status}
                </Badge>
                
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {upcomingSessions.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2">No upcoming sessions</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
