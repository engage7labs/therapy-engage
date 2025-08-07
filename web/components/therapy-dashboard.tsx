'use client'

import { useTherapyPlatformData } from '@/hooks/use-advanced-therapy-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'

export function TherapyDashboard() {
  const { patients, sessions, insights, metrics, loading, error, refetchAll } = useTherapyPlatformData()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refetchAll()
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando dados da plataforma...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao Carregar Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <button 
              onClick={handleRefresh}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/80"
            >
              Tentar Novamente
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const urgentPatients = patients.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high')
  const todaySessions = sessions.filter(s => {
    const today = new Date()
    const sessionDate = new Date(s.scheduledDate)
    return sessionDate.toDateString() === today.toDateString() && s.status === 'scheduled'
  })

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Terapia</h1>
          <p className="text-muted-foreground">
            Visão geral da plataforma • {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/80 disabled:opacity-50"
        >
          {refreshing ? 'Atualizando...' : 'Atualizar Dados'}
        </button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activePatients}</div>
            <p className="text-xs text-muted-foreground">
              de {metrics.totalPatients} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sessões Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedSessions}</div>
            <p className="text-xs text-muted-foreground">
              {((metrics.completedSessions / metrics.totalSessions) * 100).toFixed(1)}% taxa de conclusão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Média de Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageSessionRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">de 5.0 estrelas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progresso de Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.goalCompletion.toFixed(1)}%</div>
            <Progress value={metrics.goalCompletion} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule and Urgent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Sessões de Hoje</CardTitle>
            <p className="text-sm text-muted-foreground">
              {todaySessions.length} sessões agendadas
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaySessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma sessão agendada para hoje
              </p>
            ) : (
              todaySessions.slice(0, 5).map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{session.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.scheduledDate).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} • {session.duration}min • {session.type}
                    </p>
                  </div>
                  <Badge variant={session.modality === 'video' ? 'default' : 'outline'}>
                    {session.modality === 'video' ? 'Vídeo' : 
                     session.modality === 'in-person' ? 'Presencial' : 'Telefone'}
                  </Badge>
                </div>
              ))
            )}
            {todaySessions.length > 5 && (
              <p className="text-center text-sm text-muted-foreground">
                +{todaySessions.length - 5} mais sessões...
              </p>
            )}
          </CardContent>
        </Card>

        {/* Urgent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas Urgentes</CardTitle>
            <p className="text-sm text-muted-foreground">
              {urgentPatients.length} pacientes necessitam atenção
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentPatients.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum alerta urgente no momento
              </p>
            ) : (
              urgentPatients.slice(0, 5).map(patient => (
                <div key={patient.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {patient.primaryDiagnosis}
                    </p>
                  </div>
                  <Badge variant={patient.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                    {patient.riskLevel === 'critical' ? 'Crítico' : 'Alto Risco'}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Risk and Mood Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Risco</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(metrics.riskDistribution).map(([level, count]) => (
              <div key={level} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">
                    {level === 'low' ? 'Baixo' : 
                     level === 'medium' ? 'Médio' : 
                     level === 'high' ? 'Alto' : 'Crítico'}
                  </span>
                  <span>{count} pacientes</span>
                </div>
                <Progress 
                  value={(count / metrics.totalPatients) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendências de Humor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(metrics.moodTrends).map(([trend, count]) => (
              <div key={trend} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">
                    {trend === 'improving' ? 'Melhorando' : 
                     trend === 'stable' ? 'Estável' : 
                     trend === 'declining' ? 'Declinando' : 'Flutuante'}
                  </span>
                  <span>{count} pacientes</span>
                </div>
                <Progress 
                  value={(count / metrics.totalPatients) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Recentes</CardTitle>
          <p className="text-sm text-muted-foreground">
            {insights.filter(i => i.urgent).length} insights urgentes, {insights.filter(i => i.actionRequired).length} requerem ação
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum insight disponível
            </p>
          ) : (
            insights
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 8)
              .map(insight => (
                <div key={insight.id} className="flex items-start justify-between p-3 border rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{insight.title}</p>
                      {insight.urgent && (
                        <Badge variant="destructive" className="text-xs">Urgente</Badge>
                      )}
                      {insight.actionRequired && (
                        <Badge variant="secondary" className="text-xs">Ação Requerida</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {insight.patientName} • {insight.summary}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(insight.date).toLocaleDateString('pt-BR')} • 
                      Confiança: {insight.confidence}%
                    </p>
                  </div>
                  <Badge 
                    variant={insight.severity === 'critical' ? 'destructive' : 
                            insight.severity === 'high' ? 'secondary' : 'outline'}
                  >
                    {insight.severity === 'critical' ? 'Crítico' : 
                     insight.severity === 'high' ? 'Alto' : 
                     insight.severity === 'medium' ? 'Médio' : 'Baixo'}
                  </Badge>
                </div>
              ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
