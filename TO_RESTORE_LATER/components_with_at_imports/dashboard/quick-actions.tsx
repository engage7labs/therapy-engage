'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar, Video, MessageCircle, FileText, Clock } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      icon: Plus,
      title: 'New Session',
      description: 'Schedule a new therapy session',
      action: () => console.log('New session'),
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    },
    {
      icon: Calendar,
      title: 'View Calendar',
      description: 'Check upcoming appointments',
      action: () => console.log('View calendar'),
      color: 'bg-green-100 text-green-600 hover:bg-green-200'
    },
    {
      icon: Video,
      title: 'Start Video Call',
      description: 'Begin emergency session',
      action: () => console.log('Start video'),
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
    },
    {
      icon: MessageCircle,
      title: 'Send Message',
      description: 'Contact a patient',
      action: () => console.log('Send message'),
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200'
    },
    {
      icon: FileText,
      title: 'New Report',
      description: 'Create session report',
      action: () => console.log('New report'),
      color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Log session hours',
      action: () => console.log('Time tracking'),
      color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="ghost"
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${action.color}`}
                onClick={action.action}
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs opacity-75">{action.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
