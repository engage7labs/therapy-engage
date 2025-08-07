'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, MoreHorizontal, Video, MessageCircle } from 'lucide-react'
import { useKV } from '@/hooks/use-kv'

interface Patient {
  id: string
  name: string
  email: string
  lastSession: string
  status: 'active' | 'inactive' | 'at-risk'
  engagement: number
  avatar?: string
}

export function PatientList() {
  const [patientList] = useKV('patient-list', [
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      lastSession: '2024-01-15',
      status: 'active',
      engagement: 85
    },
    {
      id: '2',
      name: 'Carlos Santos',
      email: 'carlos.santos@email.com',
      lastSession: '2024-01-14',
      status: 'at-risk',
      engagement: 45
    },
    {
      id: '3',
      name: 'Maria Costa',
      email: 'maria.costa@email.com',
      lastSession: '2024-01-16',
      status: 'active',
      engagement: 92
    }
  ] as Patient[])

  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'at-risk': return 'bg-red-100 text-red-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return 'text-green-600'
    if (engagement >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Patient Overview
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patientList.map((patient) => (
            <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={patient.avatar} />
                  <AvatarFallback>
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {patient.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {patient.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    Last session: {patient.lastSession}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <Badge className={getStatusColor(patient.status)}>
                    {patient.status}
                  </Badge>
                  <p className={`text-xs font-medium ${getEngagementColor(patient.engagement)}`}>
                    {patient.engagement}% engagement
                  </p>
                </div>
                
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
