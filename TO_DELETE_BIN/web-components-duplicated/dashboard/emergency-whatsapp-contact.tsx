import { useState } from 'react'
import { useKV } from '@/hooks/use-kv'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTheme } from '@/hooks/use-theme'
import { 
  MessageCircle, 
  AlertTriangle, 
  User, 
  Clock, 
  Send,
  CheckCircle
} from 'lucide-react'

interface Patient {
  id: string
  name: string
  phone?: string
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
  consentForEmergencyContact: boolean
  lastWhatsAppContact?: string | null
}

interface EmergencyContact {
  id: string
  patientId: string
  patientName: string
  contactType: 'whatsapp' | 'sms' | 'call'
  message: string
  priority: 'urgent' | 'critical' | 'immediate'
  timestamp: string
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'responded'
}

interface EmergencyWhatsAppContactProps {
  patients: Patient[]
  onContactInitiated?: (contactId: string) => void
}

export function EmergencyWhatsAppContact({ patients, onContactInitiated }: EmergencyWhatsAppContactProps) {
  const { t } = useTheme()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'urgent' | 'critical' | 'immediate'>('urgent')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Persistent emergency contacts log
  const [emergencyContacts, setEmergencyContacts] = useKV<EmergencyContact[]>('emergency-contacts', [])

  // Filter high-risk patients for emergency contact
  const highRiskPatients = patients.filter(p => 
    (p.riskLevel === 'high' || p.riskLevel === 'critical') && p.consentForEmergencyContact
  )

  const emergencyMessageTemplates = {
    urgent: `Olá {name}, este é Dr. Smith. Notei algumas preocupações em nossa última sessão. Como você está se sentindo hoje? Pode me responder quando possível?`,
    critical: `{name}, é Dr. Smith. Preciso verificar como você está. Por favor, responda assim que possível ou me ligue se precisar de apoio imediato.`,
    immediate: `{name}, Dr. Smith aqui. Estou preocupado com você. Por favor, responda AGORA ou ligue para mim imediatamente. Se for emergência, ligue 192 ou vá ao hospital mais próximo.`
  }

  const handleEmergencyContact = async () => {
    if (!selectedPatient || !message.trim()) {
      toast.error('Selecione um paciente e digite uma mensagem')
      return
    }

    if (!selectedPatient.consentForEmergencyContact) {
      toast.error('Paciente não deu consentimento para contato de emergência')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate WhatsApp integration
      const contactId = `emergency-${Date.now()}`
      const formattedMessage = message.replace('{name}', selectedPatient.name.split(' ')[0])
      
      const newContact: EmergencyContact = {
        id: contactId,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        contactType: 'whatsapp',
        message: formattedMessage,
        priority,
        timestamp: new Date().toISOString(),
        status: 'pending'
      }

      // Add to emergency contacts log
      setEmergencyContacts(current => [newContact, ...current])

      // Simulate WhatsApp API call
      await simulateWhatsAppSend(selectedPatient, formattedMessage)

      // Update contact status
      setEmergencyContacts(current => 
        current.map(contact => 
          contact.id === contactId 
            ? { ...contact, status: 'sent' as const }
            : contact
        )
      )

      toast.success(`Mensagem de emergência enviada para ${selectedPatient.name}`, {
        description: 'WhatsApp entregue com sucesso'
      })

      onContactInitiated?.(contactId)
      setIsDialogOpen(false)
      setMessage('')
      setSelectedPatient(null)

    } catch (error) {
      toast.error('Erro ao enviar mensagem de emergência', {
        description: 'Tente novamente ou use método alternativo'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const simulateWhatsAppSend = async (patient: Patient, message: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate WhatsApp URL for real implementation
    const whatsappUrl = `https://wa.me/${patient.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    console.log('WhatsApp URL generated:', whatsappUrl)
    
    // In real implementation, this would call WhatsApp Business API
    return { success: true, messageId: `wa_${Date.now()}` }
  }

  const handleTemplateSelect = (template: keyof typeof emergencyMessageTemplates) => {
    setMessage(emergencyMessageTemplates[template])
    setPriority(template)
  }

  const getStatusIcon = (status: EmergencyContact['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-orange-500" />
      case 'sent': return <Send className="w-4 h-4 text-blue-500" />
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'read': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'responded': return <MessageCircle className="w-4 h-4 text-green-700" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'bg-red-500'
      case 'critical': return 'bg-orange-500'
      case 'urgent': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className="border-red-200 bg-red-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <MessageCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-red-800">Contato de Emergência</CardTitle>
              <CardDescription className="text-red-600">
                WhatsApp para pacientes em risco
              </CardDescription>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Emergência
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <div className="space-y-2">
                  <p className="font-medium">{t('tooltip.emergency')}</p>
                  <p className="text-xs opacity-80">
                    Send urgent WhatsApp messages to high-risk patients
                  </p>
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <AlertTriangle className="h-3 w-3" />
                    <span>For critical situations only</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Contato de Emergência
                </DialogTitle>
                <DialogDescription>
                  Enviar mensagem WhatsApp para paciente em situação de risco
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Patient Selection */}
                <div className="space-y-2">
                  <Label>Paciente</Label>
                  <Select
                    value={selectedPatient?.id || ''}
                    onValueChange={(value) => {
                      const patient = highRiskPatients.find(p => p.id === value)
                      setSelectedPatient(patient || null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar paciente em risco" />
                    </SelectTrigger>
                    <SelectContent>
                      {highRiskPatients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline"
                              className={`text-xs ${
                                patient.riskLevel === 'critical' ? 'border-red-500 text-red-700' : 'border-orange-500 text-orange-700'
                              }`}
                            >
                              {patient.riskLevel}
                            </Badge>
                            {patient.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message Templates */}
                <div className="space-y-2">
                  <Label>Templates de Emergência</Label>
                  <div className="grid gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTemplateSelect('urgent')}
                      className="justify-start text-left h-auto p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor('urgent')}`} />
                        <span className="text-xs">Urgente - Verificação bem-estar</span>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTemplateSelect('critical')}
                      className="justify-start text-left h-auto p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor('critical')}`} />
                        <span className="text-xs">Crítico - Resposta necessária</span>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTemplateSelect('immediate')}
                      className="justify-start text-left h-auto p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor('immediate')}`} />
                        <span className="text-xs">Imediato - Emergência</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="space-y-2">
                  <Label>Mensagem</Label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite a mensagem de emergência..."
                    rows={4}
                    className="resize-none"
                  />
                  {selectedPatient && (
                    <p className="text-xs text-muted-foreground">
                      Será enviado para: {selectedPatient.phone || 'Telefone não cadastrado'}
                    </p>
                  )}
                </div>

                {/* Consent Warning */}
                {selectedPatient && !selectedPatient.consentForEmergencyContact && (
                  <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-orange-800">
                      Paciente não deu consentimento para contato de emergência
                    </span>
                  </div>
                )}

                {/* Send Button */}
                <Button
                  onClick={handleEmergencyContact}
                  disabled={!selectedPatient || !message.trim() || isProcessing || !selectedPatient?.consentForEmergencyContact}
                  className="w-full"
                  variant="destructive"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Emergência
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* High Risk Patients Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-red-800">Pacientes em Risco Alto</h4>
          {highRiskPatients.length > 0 ? (
            <div className="space-y-2">
              {highRiskPatients.slice(0, 3).map(patient => (
                <div key={patient.id} className="flex items-center justify-between p-2 bg-white/60 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium">{patient.name}</span>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        patient.riskLevel === 'critical' 
                          ? 'border-red-500 text-red-700 bg-red-50' 
                          : 'border-orange-500 text-orange-700 bg-orange-50'
                      }`}
                    >
                      {patient.riskLevel}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedPatient(patient)
                      setMessage(emergencyMessageTemplates.urgent)
                      setIsDialogOpen(true)
                    }}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum paciente em risco alto no momento</p>
          )}
        </div>

        {/* Recent Emergency Contacts */}
        {emergencyContacts.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-red-200">
            <h4 className="text-sm font-medium text-red-800">Contatos Recentes</h4>
            <div className="space-y-2">
              {emergencyContacts.slice(0, 3).map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-2 bg-white/60 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(contact.status)}
                    <div>
                      <span className="text-sm font-medium">{contact.patientName}</span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(contact.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(contact.priority)}`} />
                    <Badge variant="outline" className="text-xs">
                      {contact.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}