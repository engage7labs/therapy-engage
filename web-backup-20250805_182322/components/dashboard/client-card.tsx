interface Client {
  id: string
  name: string
  lastSession: string
  nextSession: string
  status: 'active' | 'attention_needed' | 'inactive'
  riskLevel: 'low' | 'medium' | 'high'
  moodTrend: 'improving' | 'stable' | 'declining'
}

interface ClientCardProps {
  client: Client
}

export function ClientCard({ client }: ClientCardProps) {
  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'attention_needed':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskLevelColor = (level: Client['riskLevel']) => {
    switch (level) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getMoodTrendIcon = (trend: Client['moodTrend']) => {
    switch (trend) {
      case 'improving':
        return '📈'
      case 'stable':
        return '➡️'
      case 'declining':
        return '📉'
      default:
        return '➡️'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">
            {client.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        
        {/* Client Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-900">{client.name}</h3>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Last: {formatDate(client.lastSession)}</span>
            <span>•</span>
            <span>Next: {formatDate(client.nextSession)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Mood Trend */}
        <div className="flex items-center space-x-1">
          <span className="text-sm">{getMoodTrendIcon(client.moodTrend)}</span>
          <span className="text-xs text-gray-500 capitalize">{client.moodTrend}</span>
        </div>

        {/* Risk Level */}
        <div className={`text-xs font-medium ${getRiskLevelColor(client.riskLevel)}`}>
          {client.riskLevel.toUpperCase()}
        </div>

        {/* Status Badge */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
          {client.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}