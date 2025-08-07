'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { useKV } from '@/hooks/use-kv'

interface Insight {
  id: string
  type: 'improvement' | 'concern' | 'milestone' | 'recommendation'
  patient: string
  title: string
  description: string
  timestamp: string
  priority: 'high' | 'medium' | 'low'
}

export function RecentInsights() {
  const [recentInsights] = useKV('recent-insights', [
    {
      id: '1',
      type: 'improvement',
      patient: 'Ana Silva',
      title: 'Significant Progress in Anxiety Management',
      description: 'Patient shows 40% improvement in anxiety scores over the past month.',
      timestamp: '2 hours ago',
      priority: 'high'
    },
    {
      id: '2',
      type: 'concern',
      patient: 'Carlos Santos',
      title: 'Missed Sessions Alert',
      description: 'Patient has missed 3 consecutive sessions. Requires immediate follow-up.',
      timestamp: '4 hours ago',
      priority: 'high'
    },
    {
      id: '3',
      type: 'milestone',
      patient: 'Maria Costa',
      title: 'Treatment Goal Achieved',
      description: 'Patient has successfully completed the initial treatment phase.',
      timestamp: '1 day ago',
      priority: 'medium'
    }
  ] as Insight[])

  const getTypeIcon = (type: Insight['type']) => {
    switch (type) {
      case 'improvement': return TrendingUp
      case 'concern': return AlertTriangle
      case 'milestone': return CheckCircle
      case 'recommendation': return Brain
      default: return Brain
    }
  }

  const getTypeColor = (type: Insight['type']) => {
    switch (type) {
      case 'improvement': return 'bg-green-100 text-green-800'
      case 'concern': return 'bg-red-100 text-red-800'
      case 'milestone': return 'bg-blue-100 text-blue-800'
      case 'recommendation': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Recent Insights
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentInsights.map((insight) => {
            const Icon = getTypeIcon(insight.type)
            return (
              <div key={insight.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(insight.type)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {insight.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {insight.timestamp}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {insight.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-600">
                        Patient: {insight.patient}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {recentInsights.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Brain className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2">No recent insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
