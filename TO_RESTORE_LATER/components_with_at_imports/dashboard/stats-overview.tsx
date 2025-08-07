'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react'
import { useKV } from '@/hooks/use-kv'

export function StatsOverview() {
  const [patients] = useKV('total-patients', 0)
  const [sessionsToday] = useKV('sessions-today', 0)
  const [activeMinutes] = useKV('active-minutes-today', 0)
  const [engagementRate] = useKV('engagement-rate', 0)

  const stats = [
    {
      title: 'Total Patients',
      value: patients,
      icon: Users,
      description: 'Active patients',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Sessions Today',
      value: sessionsToday,
      icon: Calendar,
      description: 'Completed sessions',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Active Minutes',
      value: activeMinutes,
      icon: Clock,
      description: 'Session time today',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Engagement Rate',
      value: `${engagementRate}%`,
      icon: TrendingUp,
      description: 'Patient engagement',
      trend: '+2%',
      trendUp: true
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{stat.description}</span>
                <Badge 
                  variant={stat.trendUp ? "default" : "secondary"}
                  className="text-xs"
                >
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
