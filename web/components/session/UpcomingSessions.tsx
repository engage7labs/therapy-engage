import { useKV } from '../../app/hooks/use-kv'

interface Session {
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
      patientName: 'Dr. Sarah Smith',
      time: '2025-01-16T10:00:00Z',
      type: 'Supervision',
      duration: 30,
      status: 'confirmed'
    }
  ])

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatSessionTime = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const isTomorrow = date.toDateString() === tomorrow.toDateString()
    
    if (isToday) {
      return {
        day: 'Today',
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
    }
    
    if (isTomorrow) {
      return {
        day: 'Tomorrow',
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
    }
    
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
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
        <p className="text-sm text-gray-600 mt-1">
          {sortedSessions.length} sessions scheduled
        </p>
      </div>
      
      <div className="p-6">
        {sortedSessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📅</div>
            <p>No upcoming sessions</p>
            <p className="text-sm">Your next sessions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSessions.map(session => {
              const timeInfo = formatSessionTime(session.time)
              
              return (
                <div 
                  key={session.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{session.patientName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">
                        {session.type} • {session.duration} minutes
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{timeInfo.day}</span>
                          <span className="text-gray-500">{timeInfo.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {session.status === 'confirmed' && (
                        <button 
                          onClick={() => handleJoinSession(session.id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                        >
                          Join
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleRescheduleSession(session.id)}
                        className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
