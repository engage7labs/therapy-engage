import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '../../contexts/theme-context'
import { 
  Users, 
  Calendar, 
  Brain, 
  TrendUp 
} from '@phosphor-icons/react'

interface StatsOverviewProps {
  patients: Array<{
    id: string
    riskLevel: string
    moodTrend: string
  }>
  sessions: Array<{
    id: string
    status: string
  }>
  insights: Array<{
    id: string
    type: string
  }>
}

export function StatsOverview({ patients, sessions, insights }: StatsOverviewProps) {
  const { t } = useTheme()
  const totalPatients = patients.length
  const highRiskPatients = patients.filter(p => p.riskLevel === 'high').length
  const improvingPatients = patients.filter(p => p.moodTrend === 'improving').length
  const pendingSessions = sessions.filter(s => s.status === 'pending').length
  const criticalInsights = insights.filter(i => i.type === 'risk-alert').length

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('dashboard.stats.patients')}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPatients}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Badge variant={highRiskPatients > 0 ? "destructive" : "secondary"} className="text-xs">
              {highRiskPatients} {t('risk.high')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('dashboard.stats.sessions_today')}</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sessions.length}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {pendingSessions > 0 && (
              <Badge variant="secondary" className="text-xs">
                {pendingSessions} pending
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{insights.length}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {criticalInsights > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalInsights} {t('emergency.critical_alert')}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress Trends</CardTitle>
          <TrendUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{improvingPatients}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Badge variant={improvingPatients > 0 ? "secondary" : "outline"} className="text-xs">
              improving
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  )
}