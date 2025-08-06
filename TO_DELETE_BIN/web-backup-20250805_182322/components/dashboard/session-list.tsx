interface Session {
  id: string
  clientName: string
  datetime: string
  type: 'individual' | 'group' | 'crisis'
  status: 'scheduled' | 'priority' | 'completed' | 'cancelled'
}

interface SessionListProps {
  sessions: Session[]
}

export function SessionList({ sessions }: SessionListProps) {
  const getTypeColor = (type: Session['type']) => {
    switch (type) {
      case 'individual':
        return 'bg-blue-100 text-blue-800'
      case 'group':
        return 'bg-purple-100 text-purple-800'
      case 'crisis':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Session['status']) => {
    switch (status) {
      case 'scheduled':
        return '🕐'
      case 'priority':
        return '🚨'
      case 'completed':
        return '✅'
      case 'cancelled':
        return '❌'
      default:
        return '🕐'
    }
  }

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime)
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    const day = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
    return { time, day }
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const { time, day } = formatDateTime(session.datetime)
        
        return (
          <div
            key={session.id}
            className={`p-3 rounded-lg border transition-colors hover:bg-gray-50 ${
              session.status === 'priority' ? 'border-red-200 bg-red-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm">{getStatusIcon(session.status)}</span>
                  <h4 className="text-sm font-medium text-gray-900">
                    {session.clientName}
                  </h4>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(session.type)}`}>
                    {session.type}
                  </span>
                  
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">{time}</span>
                    <span className="mx-1">•</span>
                    <span>{day}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-1 ml-2">
                <button className="text-gray-400 hover:text-blue-600 p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                
                <button className="text-gray-400 hover:text-green-600 p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )
      })}
      
      {sessions.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <div className="text-2xl mb-2">📅</div>
          <p className="text-sm">No upcoming sessions</p>
        </div>
      )}
    </div>
  )
}