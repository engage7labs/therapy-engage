import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  VideoCamera,
  Phone
} from 'lucide-react'

interface Session {
  id: string
  patientName: string
  time: string
  type: string
  duration: number
  status: 'confirmed' | 'pending' | 'completed'
}

interface UpcomingSessionsProps {
  sessions: Session[]
}

export function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'secondary'
      case 'pending': return 'outline'
      case 'completed': return 'default'
      default: return 'outline'
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Upcoming Sessions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedSessions.map((session) => {
          const timeInfo = formatSessionTime(session.time)
          const sessionDate = new Date(session.time)
          const now = new Date()
          const isStartingSoon = sessionDate.getTime() - now.getTime() < 15 * 60 * 1000 // 15 minutes
          
          return (
            <div 
              key={session.id}
              className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                isStartingSoon ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-center min-w-[60px]">
                  <p className="text-sm font-medium">{timeInfo.day}</p>
                  <p className="text-xs text-muted-foreground">{timeInfo.time}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{session.patientName}</h4>
                    <Badge variant={getStatusBadgeVariant(session.status)} className="text-xs">
                      {session.status}
                    </Badge>
                    {isStartingSoon && (
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        Starting Soon
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{session.type}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{session.duration}min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {isStartingSoon && (
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Video className="h-4 w-4 mr-2" />
                    Join Now
                  </Button>
                )}
                
                {!isStartingSoon && (
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Patient
                  </Button>
                )}
              </div>
            </div>
          )
        })}
        
        {sessions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No upcoming sessions scheduled</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}