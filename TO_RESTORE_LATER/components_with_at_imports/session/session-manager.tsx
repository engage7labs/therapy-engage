'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Video, Play, Pause, Square, Users, Clock, Mic, MicOff } from 'lucide-react'
import { useState } from 'react'
import { useKV } from '@/hooks/use-kv'

interface Session {
  id: string
  patientName: string
  type: 'individual' | 'group' | 'emergency'
  status: 'scheduled' | 'active' | 'paused' | 'completed'
  startTime?: string
  duration?: string
}

export function SessionManager() {
  const [activeSessions, setActiveSessions] = useKV('active-sessions', [] as Session[])
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const startSession = (sessionId: string) => {
    setActiveSessions(sessions => 
      sessions.map(s => 
        s.id === sessionId 
          ? { ...s, status: 'active', startTime: new Date().toLocaleTimeString() }
          : s
      )
    )
  }

  const pauseSession = (sessionId: string) => {
    setActiveSessions(sessions => 
      sessions.map(s => 
        s.id === sessionId 
          ? { ...s, status: 'paused' }
          : s
      )
    )
  }

  const endSession = (sessionId: string) => {
    setActiveSessions(sessions => 
      sessions.map(s => 
        s.id === sessionId 
          ? { ...s, status: 'completed' }
          : s
      )
    )
  }

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Video className="mr-2 h-5 w-5" />
            Session Manager
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
            >
              {isRecording ? <Square className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            <Button
              variant={isMuted ? "outline" : "ghost"}
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{session.patientName}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="capitalize">{session.type}</span>
                      {session.startTime && (
                        <>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>Started: {session.startTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(session.status)}>
                  {session.status}
                </Badge>
              </div>
              
              <div className="flex space-x-2">
                {session.status === 'scheduled' && (
                  <Button size="sm" onClick={() => startSession(session.id)}>
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                )}
                {session.status === 'active' && (
                  <Button size="sm" variant="outline" onClick={() => pauseSession(session.id)}>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                )}
                {session.status === 'paused' && (
                  <Button size="sm" onClick={() => startSession(session.id)}>
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </Button>
                )}
                {(session.status === 'active' || session.status === 'paused') && (
                  <Button size="sm" variant="destructive" onClick={() => endSession(session.id)}>
                    <Square className="h-4 w-4 mr-1" />
                    End
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {activeSessions.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Video className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2">No active sessions</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
