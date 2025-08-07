'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Minimize2, Maximize2, Activity, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useKV } from '@/hooks/use-kv'

export function FloatingSessionMonitor() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [currentSession] = useKV('current-session', {
    id: '1',
    patientName: 'Ana Silva',
    startTime: '14:00',
    duration: '25 min',
    status: 'active',
    alerts: []
  })

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-auto'} shadow-lg border-2`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center">
              <Activity className="mr-2 h-4 w-4 text-green-500" />
              {isMinimized ? 'Session Active' : 'Session Monitor'}
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsVisible(false)}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{currentSession.patientName}</p>
                  <p className="text-xs text-gray-500">
                    Started: {currentSession.startTime} • Duration: {currentSession.duration}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {currentSession.status}
                </Badge>
              </div>
              
              {currentSession.alerts?.length > 0 && (
                <div className="space-y-1">
                  {currentSession.alerts.map((alert: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-xs bg-yellow-50 p-2 rounded">
                      <AlertCircle className="h-3 w-3 text-yellow-600" />
                      <span className="text-yellow-800">{alert}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Session
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Add Note
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
