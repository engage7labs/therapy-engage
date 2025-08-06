import { useState, useEffect } from 'react'
import { useKV } from '@/hooks/use-kv'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  MessageCircle, 
  Phone, 
  Shield, 
  ShieldWarning,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit2,
  Save,
  X
} from 'lucide-react'

interface Patient {
  id: string
  name: string
  phone?: string
  emergencyContact?: string
  consentForEmergencyContact?: boolean
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
}

interface EmergencyContactLog {
  id: string
  patientId: string
  patientName: string
  contactType: 'whatsapp' | 'call' | 'sms'
  message?: string
  timestamp: string
  status: 'pending' | 'sent' | 'delivered' | 'responded'
  responseTime?: string
  response?: string
}

interface EmergencyContactManagerProps {
  patients: Patient[]
  onPatientUpdate?: (patientId: string, updates: Partial<Patient>) => void
}

export function EmergencyContactManager({ patients, onPatientUpdate }: EmergencyContactManagerProps) {
  const [contactLogs, setContactLogs] = useKV<EmergencyContactLog[]>('emergency-contact-logs', [])
  const [editingPatient, setEditingPatient] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Patient>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Auto-simulate responses for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setContactLogs(current => 
        current.map(log => {
          if (log.status === 'sent' && Math.random() > 0.7) {
            const responses = [
              'Estou bem, obrigado por perguntar!',
              'Meio ansioso hoje, mas melhor que ontem',
              'Preciso conversar, pode me ligar?',
              'Tudo tranquilo por aqui',
              'Não muito bem hoje...'
            ]
            return {
              ...log,
              status: 'responded' as const,
              response: responses[Math.floor(Math.random() * responses.length)],
              responseTime: new Date().toISOString()
            }
          }
          return log
        })
      )
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [setContactLogs])

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient.id)
    setEditForm({
      phone: patient.phone || '',
      emergencyContact: patient.emergencyContact || '',
      consentForEmergencyContact: patient.consentForEmergencyContact || false
    })
  }

  const handleSavePatient = () => {
    if (!editingPatient) return

    // In real app, this would update the patient in the database
    onPatientUpdate?.(editingPatient, editForm)
    setEditingPatient(null)
    setEditForm({})
    
    toast.success('Dados de contato atualizados', {
      description: 'Informações de emergência salvas com sucesso'
    })
  }

  const handleQuickContact = async (patient: Patient, type: 'whatsapp' | 'call') => {
    if (!patient.consentForEmergencyContact) {
      toast.error('Consentimento necessário', {
        description: 'Paciente deve autorizar contato de emergência'
      })
      return
    }

    if (!patient.phone) {
      toast.error('Telefone não cadastrado', {
        description: 'Atualize o cadastro do paciente'
      })
      return
    }

    const contactId = `contact-${Date.now()}`
    const newLog: EmergencyContactLog = {
      id: contactId,
      patientId: patient.id,
      patientName: patient.name,
      contactType: type,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }

    if (type === 'whatsapp') {
      const message = `Olá ${patient.name.split(' ')[0]}, aqui é Dr. Smith. Como você está se sentindo? Pode me responder quando possível?`
      newLog.message = message
      
      // Generate WhatsApp URL
      const whatsappUrl = `https://wa.me/${patient.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    } else {
      // Generate tel: URL
      const telUrl = `tel:${patient.phone.replace(/\D/g, '')}`
      window.location.href = telUrl
    }

    // Add to logs
    setContactLogs(current => [newLog, ...current])

    // Simulate sent status after delay
    setTimeout(() => {
      setContactLogs(current => 
        current.map(log => 
          log.id === contactId 
            ? { ...log, status: 'sent' as const }
            : log
        )
      )
    }, 2000)

    toast.success(`${type === 'whatsapp' ? 'WhatsApp' : 'Chamada'} iniciado`, {
      description: `Contato de bem-estar para ${patient.name}`
    })
  }

  const getStatusIcon = (status: EmergencyContactLog['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-orange-500" />
      case 'sent': return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'responded': return <MessageCircle className="w-4 h-4 text-green-600" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500' 
      case 'moderate': return 'bg-yellow-500'
      default: return 'bg-green-500'
    }
  }

  const highRiskPatients = patients.filter(p => ['high', 'critical'].includes(p.riskLevel))
  const recentContacts = contactLogs.slice(0, 10)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Shield className="w-4 h-4 mr-2" />
          Gerenciar Contatos de Emergência
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-red-500" />
            Gerenciamento de Contatos de Emergência
          </DialogTitle>
          <DialogDescription>
            Configure e monitore contatos WhatsApp para pacientes em risco
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="quick-contact">Contato Rápido</TabsTrigger>
            <TabsTrigger value="logs">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Configuração de Contatos</h3>
              {patients.map(patient => (
                <Card key={patient.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(patient.riskLevel)}`} />
                      <div>
                        <h4 className="font-medium">{patient.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {patient.riskLevel}
                          </Badge>
                          {patient.consentForEmergencyContact ? (
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3 text-green-600" />
                              <span>Autorizado</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-orange-500" />
                              <span>Sem autorização</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {editingPatient === patient.id ? (
                      <div className="flex items-center gap-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Telefone:</Label>
                            <Input
                              value={editForm.phone || ''}
                              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                              placeholder="+55119999999"
                              className="w-32 h-8 text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Autorização:</Label>
                            <Switch
                              checked={editForm.consentForEmergencyContact || false}
                              onCheckedChange={(checked) => 
                                setEditForm({...editForm, consentForEmergencyContact: checked})
                              }
                            />
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" onClick={handleSavePatient}>
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingPatient(null)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm">
                          <div>{patient.phone || 'Sem telefone'}</div>
                          <div className="text-muted-foreground">
                            {patient.emergencyContact || 'Sem contato emergência'}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleEditPatient(patient)}>
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quick-contact" className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Contato Rápido - Pacientes em Risco</h3>
              {highRiskPatients.length > 0 ? (
                <div className="grid gap-3">
                  {highRiskPatients.map(patient => (
                    <Card key={patient.id} className="p-4 border-orange-200 bg-orange-50/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${getRiskColor(patient.riskLevel)}`} />
                          <div>
                            <h4 className="font-medium">{patient.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="destructive" className="text-xs">
                                {patient.riskLevel} risk
                              </Badge>
                              <span>{patient.phone || 'Sem telefone'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickContact(patient, 'whatsapp')}
                            disabled={!patient.consentForEmergencyContact || !patient.phone}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            WhatsApp
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickContact(patient, 'call')}
                            disabled={!patient.phone}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Ligar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                  <p>Nenhum paciente em risco alto no momento</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Histórico de Contatos</h3>
              {recentContacts.length > 0 ? (
                <div className="space-y-3">
                  {recentContacts.map(log => (
                    <Card key={log.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(log.status)}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{log.patientName}</h4>
                              <Badge variant="outline" className="text-xs">
                                {log.contactType}
                              </Badge>
                              <Badge 
                                variant={log.status === 'responded' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {log.status}
                              </Badge>
                            </div>
                            
                            {log.message && (
                              <p className="text-sm text-muted-foreground max-w-md">
                                {log.message}
                              </p>
                            )}
                            
                            {log.response && (
                              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                                <strong>Resposta:</strong> {log.response}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right text-xs text-muted-foreground">
                          <div>{new Date(log.timestamp).toLocaleDateString('pt-BR')}</div>
                          <div>{new Date(log.timestamp).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</div>
                          {log.responseTime && (
                            <div className="text-green-600 mt-1">
                              Resp: {new Date(log.responseTime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>Nenhum contato de emergência registrado</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}