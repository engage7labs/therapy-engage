interface Stats {
  totalClients: number
  activeClients: number
  sessionsToday: number
  avgMoodScore: number
  completionRate: number
}

interface StatsOverviewProps {
  stats: Stats
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: '👥'
    },
    {
      title: 'Active This Week',
      value: stats.activeClients.toString(),
      change: '+5%',
      changeType: 'positive' as const,
      icon: '🟢'
    },
    {
      title: 'Sessions Today',
      value: stats.sessionsToday.toString(),
      change: 'On schedule',
      changeType: 'neutral' as const,
      icon: '📅'
    },
    {
      title: 'Avg Mood Score',
      value: stats.avgMoodScore.toFixed(1),
      change: '+0.3',
      changeType: 'positive' as const,
      icon: '😊'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      change: '+2%',
      changeType: 'positive' as const,
      icon: '✅'
    }
  ]

  const getChangeColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      case 'neutral':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className={`text-sm mt-1 ${getChangeColor(stat.changeType)}`}>
                {stat.change}
              </p>
            </div>
            <div className="text-2xl">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}