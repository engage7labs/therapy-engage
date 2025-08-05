import { useKV } from '../hooks/use-kv'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '../../contexts/auth-context'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Video, 
  FileText, 
  TrendUp,
  Shield,
  Heart
} from '@phosphor-icons/react'

export function PatientDashboard() {
  const { user } = useAuth()

  // Patient-specific data
  const [patientData] = useKV('patient-rodrigo-data', {
    nextSession: {
      date: '2025-01-15T14:00:00Z',
      therapist: 'Dr. Smith',
      type: 'Sessão Individual',
      duration: 50,
      status: 'confirmada'
    },
    progress: {
      sessionsCompleted: 8,
      totalSessions: 12,
      currentGoals: [
        'Reduzir ansiedade em situações sociais',
        'Melhorar qualidade do sono',
        'Desenvolver técnicas de respiração'
      ],
      completedGoals: [
        'Estabelecer rotina de exercícios',
        'Implementar técnicas de mindfulness'
      ]
    },
    consents: [
      {
        id: 'consent-recording',
        title: 'Gravação de Sessões',
        status: 'aprovado',
        date: '2025-01-10',
        type: 'recording'
      },
      {
        id: 'consent-ai-analysis',
        title: 'Análise por IA',
        status: 'aprovado',
        date: '2025-01-10',
        type: 'ai-analysis'
      },
      {
        id: 'consent-data-sharing',
        title: 'Compartilhamento de Dados (GDPR)',
        status: 'pendente',
        date: null,
        type: 'data-sharing'
      }
    ],
    moodTracking: {
      currentWeek: [7, 6, 8, 7, 8, 9, 8],
      trend: 'melhorando',
      lastEntry: '2025-01-14'
    }
  })

  const progressPercentage = (patientData.progress.sessionsCompleted / patientData.progress.totalSessions) * 100

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getConsentStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      case 'pendente':
        return <Badge variant="outline" className="text-orange-600">Pendente</Badge>
      case 'negado':
        return <Badge variant="destructive">Negado</Badge>
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
          👨‍🎓
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Olá, {user?.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu portal pessoal de terapia
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próxima Sessão</p>
                <p className="font-medium">Hoje, 14:00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progresso</p>
                <p className="font-medium">{progressPercentage.toFixed(0)}% Completo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Heart size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Humor Hoje</p>
                <p className="font-medium">8/10 😊</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Consentimentos</p>
                <p className="font-medium">2/3 Aprovados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Session */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video size={20} />
                Próxima Sessão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{patientData.nextSession.type}</h3>
                    <p className="text-sm text-muted-foreground">
                      com {patientData.nextSession.therapist}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {patientData.nextSession.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(patientData.nextSession.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {patientData.nextSession.duration} minutos
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="gap-2">
                    <Video size={14} />
                    Entrar na Sessão
                  </Button>
                  <Button variant="outline" size="sm">
                    Reagendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp size={20} />
                Progresso do Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Sessões Concluídas</span>
                  <span className="text-sm text-muted-foreground">
                    {patientData.progress.sessionsCompleted}/{patientData.progress.totalSessions}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Objetivos Atuais</h4>
                {patientData.progress.currentGoals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">{goal}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-green-600">Objetivos Alcançados</h4>
                {patientData.progress.completedGoals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm line-through text-muted-foreground">{goal}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Consent Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Status dos Consentimentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patientData.consents.map((consent) => (
                <div key={consent.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{consent.title}</h4>
                    {getConsentStatusBadge(consent.status)}
                  </div>
                  {consent.date && (
                    <p className="text-xs text-muted-foreground">
                      Aprovado em {new Date(consent.date).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              ))}

              <Button variant="outline" size="sm" className="w-full gap-2">
                <FileText size={14} />
                Gerenciar Consentimentos
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Alert>
            <Shield size={16} />
            <AlertDescription className="text-sm">
              Seus dados estão protegidos conforme as regulamentações GDPR e LGPD. 
              Você tem controle total sobre suas informações pessoais.
            </AlertDescription>
          </Alert>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Heart size={14} />
                Registrar Humor
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Calendar size={14} />
                Agendar Sessão
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <FileText size={14} />
                Baixar Relatórios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}