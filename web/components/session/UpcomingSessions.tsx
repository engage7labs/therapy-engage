import { useKV } from '../../app/hooks/use-kv'

export interface Session {
  id: string
  patientName: string
  time: string
  type: string
  duration: number
  status: 'confirmed' | 'pending' | 'completed'
}

interface UpcomingSessionsProps {
  readonly sessions?: Session[]
}

export function UpcomingSessions({ sessions: propSessions }: UpcomingSessionsProps) {
  const [sessions] = useKV<Session[]>('upcoming-sessions', propSessions || [
    {
      id: 'session-upcoming-001',
      patientName: 'Rodrigo Marques',
      time: '2025-01-15T14:00:00Z',
      type: 'Follow-up Session',
      duration: 50,
      status: 'confirmed'
    },
    {
      id: 'session-upcoming-002',
      patientName: 'Ana Silva',
      time: '2025-01-15T16:00:00Z',
      type: 'CBT Session',
      duration: 45,
      status: 'pending'
    },
    {
      id: 'session-upcoming-003',
      patientName: 'Dr. Ego Smith',
      time: '2025-01-16T10:00:00Z',
      type: 'Supervision',
      duration: 30,
      status: 'confirmed'
    }
  ])

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'completed': return 'bg-secondary text-secondary-foreground'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    const today = now.toDateString() === date.toDateString()
    
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const isTomorrow = tomorrow.toDateString() === date.toDateString()
    
    if (today) {
      return {
        day: 'Today',
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
    } else if (isTomorrow) {
      return {
        day: 'Tomorrow',
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
    } else {
      return {
        day: date.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric' 
        }),
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
    }
  }

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  )

  const handleJoinSession = (sessionId: string) => {
    console.log(`Joining session: ${sessionId}`)
    // This will be implemented in Priority 3 with video call functionality
  }

  const handleRescheduleSession = (sessionId: string) => {
    console.log(`Rescheduling session: ${sessionId}`)
    // This will be implemented with session scheduling functionality
  }

  return (
    <div className="bg-card rounded-lg shadow-md border">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Upcoming Sessions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {sortedSessions.length} sessions scheduled
        </p>
      </div>
      
      <div className="p-6">
        {sortedSessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No upcoming sessions scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSessions.map((session) => {
              const timeInfo = formatTime(session.time)
              
              return (
                <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{session.patientName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{session.type}</span>
                      <span>•</span>
                      <span>{session.duration} minutes</span>
                      <span>•</span>
                      <span>{timeInfo.day} at {timeInfo.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {session.status === 'confirmed' && (
                      <button
                        onClick={() => handleJoinSession(session.id)}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
                      >
                        Join
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleRescheduleSession(session.id)}
                      className="px-3 py-1 border border-border rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      <div className="border-t border-border p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Total sessions this week: {sessions.length}
          </div>
          
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
            Schedule New Session
          </button>
        </div>
      </div>
    </div>
  )
}
