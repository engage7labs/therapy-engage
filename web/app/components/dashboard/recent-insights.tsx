import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  Clock
} from 'lucide-react'

interface Insight {
  id: string
  patientName: string
  type: 'mood-improvement' | 'risk-alert' | 'progress-milestone'
  summary: string
  confidence: number
  timestamp: string
  recommendation: string
}

interface RecentInsightsProps {
  readonly insights: Insight[]
}

export function RecentInsights({ insights }: RecentInsightsProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'mood-improvement': 
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'risk-alert': 
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'progress-milestone': 
        return <Target className="h-4 w-4 text-blue-600" />
      default: 
        return <Brain className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getInsightBadgeVariant = (type: string) => {
    switch (type) {
      case 'mood-improvement': return 'default'
      case 'risk-alert': return 'destructive'
      case 'progress-milestone': return 'secondary'
      default: return 'outline'
    }
  }

  const getInsightTypeLabel = (type: string) => {
    switch (type) {
      case 'mood-improvement': return 'Improvement'
      case 'risk-alert': return 'Risk Alert'
      case 'progress-milestone': return 'Milestone'
      default: return 'Insight'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffHours < 1) {
      return 'Just now'
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else {
      return `${diffDays}d ago`
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const sortedInsights = [...insights].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>AI Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedInsights.map((insight) => (
          <div 
            key={insight.id}
            className="p-4 border rounded-lg space-y-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {getInsightIcon(insight.type)}
                <Badge variant={getInsightBadgeVariant(insight.type)} className="text-xs">
                  {getInsightTypeLabel(insight.type)}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTimestamp(insight.timestamp)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{insight.patientName}</h4>
                <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                  {Math.round(insight.confidence * 100)}% confidence
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {insight.summary}
              </p>
              
              <div className="bg-muted/50 p-3 rounded text-xs">
                <p className="font-medium mb-1">AI Recommendation:</p>
                <p className="text-muted-foreground">{insight.recommendation}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="text-xs h-7">
                Review Details
              </Button>
              <Button size="sm" variant="ghost" className="text-xs h-7">
                Mark as Reviewed
              </Button>
            </div>
          </div>
        ))}
        
        {insights.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent AI insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}