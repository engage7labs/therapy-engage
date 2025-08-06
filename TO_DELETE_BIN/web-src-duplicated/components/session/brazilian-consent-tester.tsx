import { useState } from 'react'
import { useKV } from '@/hooks/use-kv'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  Shield, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Heart,
  Brain,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Download,
  Printer
} from 'lucide-react'

interface BrazilianPatient {
  id: string
  nome: string
  cpf: string
  rg: string
  dataNascimento: string
  idade: number
  telefone: string
  email: string
  endereco: {
    cep: string
    rua: string
    numero: string
    bairro: string
    cidade: string
    estado: string
  }
  profissao: string
  estadoCivil: string
  escolaridade: string
  contatoEmergencia: {
    nome: string
    telefone: string
    parentesco: string
  }
  condicaoClinica: {
    diagnosticoPrincipal: string
    medicamentos: string[]
    alergias: string[]
    historicoFamiliar: string
    observacoes: string
  }
  consentimentos: {
    lgpd: boolean
    gravacaoSessao: boolean
    compartilhamentoDados: boolean
    iaAnalise: boolean
    pesquisaClinica: boolean
  }
  dataConsentimento: string
  responsavelLegal?: {
    nome: string
    cpf: string
    parentesco: string
    telefone: string
  }
}

export function BrazilianConsentTester() {
  const [activeTab, setActiveTab] = useState('pacientes')
  const [selectedPatient, setSelectedPatient] = useState<BrazilianPatient | null>(null)
  const [consentStatus, setConsentStatus] = useState<'pending' | 'collecting' | 'completed' | 'rejected'>('pending')
  
  // Persistent storage for Brazilian patients with LGPD compliance
  const [brazilianPatients, setBrazilianPatients] = useKV<BrazilianPatient[]>("brazilian-patients", [
    {
      id: "br-001",
      nome: "Ana Maria Silva Santos",
      cpf: "123.456.789-01",
      rg: "12.345.678-9",
      dataNascimento: "1985-03-15",
      idade: 39,
      telefone: "(11) 99876-5432",
      email: "ana.silva@email.com",
      endereco: {
        cep: "01310-100",
        rua: "Av. Paulista",
        numero: "1000",
        bairro: "Bela Vista", 
        cidade: "São Paulo",
        estado: "SP"
      },
      profissao: "Engenheira de Software",
      estadoCivil: "Casada",
      escolaridade: "Superior Completo",
      contatoEmergencia: {
        nome: "Carlos Silva Santos",
        telefone: "(11) 99765-4321",
        parentesco: "Esposo"
      },
      condicaoClinica: {
        diagnosticoPrincipal: "Transtorno de Ansiedade Generalizada",
        medicamentos: ["Sertralina 50mg", "Clonazepam 0,5mg"],
        alergias: ["Dipirona"],
        historicoFamiliar: "Depressão - mãe",
        observacoes: "Paciente apresenta sintomas há 6 meses, relacionados ao estresse no trabalho"
      },
      consentimentos: {
        lgpd: true,
        gravacaoSessao: true,
        compartilhamentoDados: false,
        iaAnalise: true,
        pesquisaClinica: false
      },
      dataConsentimento: "2025-01-15T10:00:00-03:00"
    },
    {
      id: "br-002", 
      nome: "João Pedro Oliveira",
      cpf: "987.654.321-09",
      rg: "98.765.432-1",
      dataNascimento: "1992-08-22",
      idade: 32,
      telefone: "(21) 98765-4321",
      email: "joao.oliveira@email.com",
      endereco: {
        cep: "22070-900",
        rua: "Rua das Laranjeiras",
        numero: "350",
        bairro: "Laranjeiras",
        cidade: "Rio de Janeiro", 
        estado: "RJ"
      },
      profissao: "Professor",
      estadoCivil: "Solteiro",
      escolaridade: "Pós-graduação",
      contatoEmergencia: {
        nome: "Maria Oliveira",
        telefone: "(21) 99876-5432",
        parentesco: "Mãe"
      },
      condicaoClinica: {
        diagnosticoPrincipal: "Episódio Depressivo Moderado",
        medicamentos: ["Fluoxetina 20mg"],
        alergias: ["Não possui"],
        historicoFamiliar: "Transtorno Bipolar - pai",
        observacoes: "Primeiro episódio depressivo, iniciou após término de relacionamento"
      },
      consentimentos: {
        lgpd: true,
        gravacaoSessao: false,
        compartilhamentoDados: true,
        iaAnalise: false,
        pesquisaClinica: true
      },
      dataConsentimento: "2025-01-14T14:30:00-03:00"
    },
    {
      id: "br-003",
      nome: "Maria Fernanda Costa",
      cpf: "456.789.123-45",
      rg: "45.678.912-3", 
      dataNascimento: "2010-12-05",
      idade: 14,
      telefone: "(85) 99123-4567",
      email: "mariafernanda@email.com",
      endereco: {
        cep: "60160-230",
        rua: "Rua da Praia",
        numero: "125",
        bairro: "Meireles",
        cidade: "Fortaleza",
        estado: "CE"
      },
      profissao: "Estudante",
      estadoCivil: "Solteira",
      escolaridade: "Ensino Fundamental",
      contatoEmergencia: {
        nome: "Luiza Costa",
        telefone: "(85) 99234-5678", 
        parentesco: "Mãe"
      },
      condicaoClinica: {
        diagnosticoPrincipal: "Transtorno do Espectro Autista",
        medicamentos: ["Risperidona 1mg"],
        alergias: ["Corantes alimentares"],
        historicoFamiliar: "TEA - irmão",
        observacoes: "Paciente menor de idade, necessita acompanhamento dos responsáveis"
      },
      consentimentos: {
        lgpd: true,
        gravacaoSessao: true,
        compartilhamentoDados: false,
        iaAnalise: true,
        pesquisaClinica: false
      },
      dataConsentimento: "2025-01-13T16:00:00-03:00",
      responsavelLegal: {
        nome: "Luiza Maria Costa",
        cpf: "789.123.456-78",
        parentesco: "Mãe",
        telefone: "(85) 99234-5678"
      }
    }
  ])

  const [consentRecords, setConsentRecords] = useKV<any[]>("consent-records-br", [])

  const handleConsentCollection = async (patient: BrazilianPatient) => {
    setSelectedPatient(patient)
    setConsentStatus('collecting')
    
    // Simulate digital consent collection process
    setTimeout(() => {
      const newRecord = {
        id: `consent-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.nome,
        timestamp: new Date().toISOString(),
        consentType: 'complete-lgpd',
        ipAddress: '192.168.1.100',
        userAgent: 'TherapyEngage/1.0',
        status: 'completed',
        consentItems: patient.consentimentos,
        legalBasis: 'LGPD Art. 7, XI - proteção da vida',
        dataRetentionPeriod: '10 anos',
        withdrawalMethod: 'email ou presencial'
      }
      
      setConsentRecords((current) => [newRecord, ...current])
      setConsentStatus('completed')
    }, 2000)
  }

  const generateConsentDocument = (patient: BrazilianPatient) => {
    const doc = `
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO
TERAPIA PSICOLÓGICA COM USO DE TECNOLOGIA

Paciente: ${patient.nome}
CPF: ${patient.cpf}
Data: ${new Date().toLocaleDateString('pt-BR')}

1. IDENTIFICAÇÃO DO PROFISSIONAL
Nome: Dr. José Carlos Deleta
CRP: 06/123456-SP
Especialização: Terapia Cognitivo-Comportamental

2. OBJETIVO DO TRATAMENTO
Tratamento psicológico para ${patient.condicaoClinica.diagnosticoPrincipal} utilizando 
recursos tecnológicos para otimização do cuidado.

3. PROCEDIMENTOS ENVOLVIDOS
- Sessões de psicoterapia presenciais e/ou remotas
- Gravação de sessões para fins de análise e melhoria do tratamento
- Uso de inteligência artificial para análise de padrões emocionais
- Armazenamento seguro de dados clínicos em nuvem

4. RISCOS E BENEFÍCIOS
RISCOS: Possível desconforto emocional durante o processo terapêutico
BENEFÍCIOS: Melhoria dos sintomas e qualidade de vida

5. PROTEÇÃO DE DADOS (LGPD)
Seus dados pessoais e de saúde serão tratados conforme a Lei Geral de 
Proteção de Dados (Lei 13.709/2018) e o Código de Ética Profissional do Psicólogo.

6. DIREITOS DO TITULAR DOS DADOS
- Confirmação da existência de tratamento
- Acesso aos dados
- Correção de dados incompletos/inexatos
- Anonimização, bloqueio ou eliminação
- Portabilidade dos dados
- Revogação do consentimento

7. CONSENTIMENTOS ESPECÍFICOS
${patient.consentimentos.gravacaoSessao ? '✓' : '✗'} Autorizo gravação das sessões
${patient.consentimentos.iaAnalise ? '✓' : '✗'} Autorizo análise por IA
${patient.consentimentos.compartilhamentoDados ? '✓' : '✗'} Autorizo compartilhamento para pesquisa
${patient.consentimentos.pesquisaClinica ? '✓' : '✗'} Autorizo participação em pesquisas

________________________________
Assinatura do Paciente/Responsável

________________________________
Assinatura do Profissional
`
    return doc
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <Shield className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Testador de Consentimento LGPD - Brasil
          </h1>
          <p className="text-muted-foreground">
            Fluxos completos de consentimento para pacientes brasileiros
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pacientes" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Pacientes
          </TabsTrigger>
          <TabsTrigger value="consentimento" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Consentimento
          </TabsTrigger>
          <TabsTrigger value="documentos" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pacientes" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {brazilianPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{patient.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {patient.idade} anos • {patient.profissao}
                      </p>
                    </div>
                    <Badge variant={patient.idade < 18 ? "destructive" : "secondary"}>
                      {patient.idade < 18 ? "Menor" : "Adulto"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.endereco.cidade}/{patient.endereco.estado}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{patient.condicaoClinica.diagnosticoPrincipal}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Status de Consentimento</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        {patient.consentimentos.lgpd ? 
                          <CheckCircle className="h-3 w-3 text-green-600" /> : 
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        }
                        <span>LGPD</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {patient.consentimentos.gravacaoSessao ? 
                          <CheckCircle className="h-3 w-3 text-green-600" /> : 
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        }
                        <span>Gravação</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {patient.consentimentos.iaAnalise ? 
                          <CheckCircle className="h-3 w-3 text-green-600" /> : 
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        }
                        <span>IA</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {patient.consentimentos.pesquisaClinica ? 
                          <CheckCircle className="h-3 w-3 text-green-600" /> : 
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        }
                        <span>Pesquisa</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleConsentCollection(patient)}
                    className="w-full"
                    variant="outline"
                  >
                    Coletar Consentimento
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="consentimento" className="space-y-6">
          {consentStatus === 'pending' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Selecione um paciente na aba "Pacientes" para iniciar o processo de consentimento.
              </AlertDescription>
            </Alert>
          )}

          {consentStatus === 'collecting' && selectedPatient && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 animate-spin" />
                  Coletando Consentimento - {selectedPatient.nome}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Processando consentimento digital com validação LGPD...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {consentStatus === 'completed' && selectedPatient && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Consentimento Coletado com Sucesso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-green-800">Paciente</Label>
                    <p className="font-medium">{selectedPatient.nome}</p>
                    <p className="text-sm text-muted-foreground">CPF: {selectedPatient.cpf}</p>
                  </div>
                  <div>
                    <Label className="text-green-800">Data/Hora</Label>
                    <p className="font-medium">{new Date().toLocaleString('pt-BR')}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-green-800">Consentimentos Coletados</Label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(selectedPatient.consentimentos).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        {value ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        }
                        <span className="text-sm">
                          {key === 'lgpd' && 'Tratamento de dados pessoais (LGPD)'}
                          {key === 'gravacaoSessao' && 'Gravação de sessões terapêuticas'}
                          {key === 'compartilhamentoDados' && 'Compartilhamento para pesquisa'}
                          {key === 'iaAnalise' && 'Análise por inteligência artificial'}
                          {key === 'pesquisaClinica' && 'Participação em pesquisas clínicas'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => setConsentStatus('pending')}
                    variant="outline"
                  >
                    Testar Outro Paciente
                  </Button>
                  <Button onClick={() => setActiveTab('documentos')}>
                    Ver Documento
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documentos" className="space-y-6">
          {selectedPatient ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Termo de Consentimento - {selectedPatient.nome}
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                  <Button size="sm" variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-6 border rounded-lg font-mono text-sm whitespace-pre-line">
                  {generateConsentDocument(selectedPatient)}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Colete um consentimento primeiro para visualizar o documento.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Consentimentos</CardTitle>
              <p className="text-sm text-muted-foreground">
                Registros de todos os consentimentos coletados
              </p>
            </CardHeader>
            <CardContent>
              {consentRecords.length > 0 ? (
                <div className="space-y-4">
                  {consentRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{record.patientName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.timestamp).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <Badge variant="secondary">{record.status}</Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>IP: {record.ipAddress}</p>
                        <p>Base Legal: {record.legalBasis}</p>
                        <p>Retenção: {record.dataRetentionPeriod}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum consentimento coletado ainda
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}