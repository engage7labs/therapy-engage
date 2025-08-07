'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Play, Users, Clock, Phone } from 'lucide-react'
import { useState } from 'react'

export function EmergencySessionSimulator() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [sessionType, setSessionType] = useState<'panic' | 'crisis' | 'urgent'>('panic')

  const sessionTypes = {
    panic: {
      title: 'Panic Attack Session',
      description: 'Simulate patient experiencing panic attack',
      color: 'bg-red-100 text-red-800',
      duration: '10-15 min',
      urgency: 'Critical'
    },
    crisis: {
      title: 'Crisis Intervention',
      description: 'Simulate mental health crisis situation',
      color: 'bg-orange-100 text-orange-800',
      duration: '20-30 min',
      urgency: 'High'
    },
    urgent: {
      title: 'Urgent Support',
      description: 'Simulate need for immediate support',
      color: 'bg-yellow-100 text-yellow-800',
      duration: '15-20 min',
      urgency: 'Medium'
    }
  }

  const startSimulation = () => {
    setIsSimulating(true)
    // Simulate emergency session
    setTimeout(() => {
      setIsSimulating(false)
    }, 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
          Emergency Session Simulator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(sessionTypes).map(([key, type]) => (
              <div
                key={key}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  sessionType === key 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSessionType(key as any)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{type.title}</h4>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={type.color}>
                      {type.urgency}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {type.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            {isSimulating ? (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-pulse bg-red-500 w-3 h-3 rounded-full"></div>
                  <span className="text-sm font-medium text-red-600">
                    Emergency Session in Progress
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    Patient: Anonymous Demo User
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Voice Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Crisis Protocol
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={startSimulation}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Emergency Simulation
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
