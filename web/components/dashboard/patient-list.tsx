import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  User, 
  Calendar, 
  TrendUp, 
  TrendDown, 
  Minus,
  VideoCamera,
  MessageCircle,
  Phone,
  Shield,
  ShieldWarning
} from '@phosphor-icons/react'

interface Patient {
  id: string
  name: string
  age: number
  diagnosis: string
  nextSession: string
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
  moodTrend: 'improving' | 'stable' | 'declining'
  sessionsCompleted: number
  totalSessions: number
  phone?: string
  emergencyContact?: string
  consentForEmergencyContact?: boolean
  lastWhatsAppContact?: string
}

interface PatientListProps {
  patients: Patient[]
}

export function PatientList({ patients }: PatientListProps) {
  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'moderate': return 'secondary'
      default: return 'outline'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendUp className="h-4 w-4 text-green-600" />
      case 'declining': return <TrendDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const formatNextSession = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    if (isToday) {
      return `Today ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleWhatsAppContact = async (patient: Patient) => {
    if (!patient.consentForEmergencyContact) {
      toast.error('Paciente não autorizou contato de emergência', {
        description: 'Solicite consentimento antes de contatar'
      })
      return
    }

    if (!patient.phone) {
      toast.error('Telefone não cadastrado', {
        description: 'Atualize o cadastro do paciente'
      })
      return
    }

    // Quick wellness check message
    const message = `Olá ${patient.name.split(' ')[0]}, aqui é Dr. Smith. Como você está se sentindo hoje? Gostaria de conversar?`
    const whatsappUrl = `https://wa.me/${patient.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank')
    
    toast.success(`WhatsApp aberto para ${patient.name}`, {
      description: 'Mensagem de bem-estar enviada'
    })
  }

  const handleEmergencyCall = async (patient: Patient) => {
    if (!patient.phone) {
      toast.error('Telefone não cadastrado')
      return
    }

    // Generate tel: link for phone call
    const telUrl = `tel:${patient.phone.replace(/\D/g, '')}`
    window.location.href = telUrl
    
    toast.success(`Ligando para ${patient.name}`, {
      description: 'Chamada de emergência iniciada'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Patient Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {patients.map((patient) => (
          <div 
            key={patient.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{patient.name}</h4>
                  <Badge variant={getRiskBadgeVariant(patient.riskLevel)} className="text-xs">
                    {patient.riskLevel} risk
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{patient.age} years</span>
                  <span>•</span>
                  <span>{patient.diagnosis}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={(patient.sessionsCompleted / patient.totalSessions) * 100}
                    className="w-24 h-1"
                  />
                  <span className="text-xs text-muted-foreground">
                    {patient.sessionsCompleted}/{patient.totalSessions} sessions
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-right space-y-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatNextSession(patient.nextSession)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getTrendIcon(patient.moodTrend)}
                  <span className="text-xs text-muted-foreground capitalize">
                    {patient.moodTrend}
                  </span>
                </div>

                {/* Emergency Contact Status */}
                <div className="flex items-center space-x-1">
                  {patient.consentForEmergencyContact ? (
                    <Shield className="h-3 w-3 text-green-600" />
                  ) : (
                    <ShieldWarning className="h-3 w-3 text-orange-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {patient.consentForEmergencyContact ? 'Contato autorizado' : 'Sem consentimento'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-1">
                <Button size="sm" variant="outline">
                  <VideoCamera className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
                
                {/* Emergency Contact Buttons - only for high risk patients */}
                {(patient.riskLevel === 'high' || patient.riskLevel === 'critical') && (
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleWhatsAppContact(patient)}
                      disabled={!patient.consentForEmergencyContact || !patient.phone}
                      className="px-2"
                      title="WhatsApp de bem-estar"
                    >
                      <MessageCircle className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEmergencyCall(patient)}
                      disabled={!patient.phone}
                      className="px-2"
                      title="Ligação de emergência"
                    >
                      <Phone className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}