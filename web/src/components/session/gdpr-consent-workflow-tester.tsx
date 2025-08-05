import { useState, useRef, useEffect } from 'react'
import { useKV } from '../hooks/use-kv'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Shield, 
  Signature, 
  FileText, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  User,
  Clock,
  Monitor,
  Mic,
  Video,
  Brain,
  Database,
  Search,
  Globe,
  Eye,
  Trash2,
  UserCheck,
  Play,
  StopCircle,
  RotateCcw
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TestScenario {
  id: string
  name: string
  description: string
  patientProfile: {
    id: string
    name: string
    age: number
    capacity: 'full' | 'limited' | 'guardian-required'
    languagePreference: 'en' | 'pt' | 'es'
    specialNeeds?: string
  }
  sessionType: 'individual' | 'group' | 'family' | 'assessment'
  consentRequirements: {
    video: boolean
    audio: boolean
    transcription: boolean
    aiAnalysis: boolean
    dataRetention: boolean
    research: boolean
    witnessRequired: boolean
  }
  riskLevel: 'low' | 'medium' | 'high'
  expectedOutcome: 'success' | 'warning' | 'failure'
}

interface ConsentFormData {
  patientName: string
  patientId: string
  sessionId: string
  videoConsent: boolean
  audioConsent: boolean
  transcriptionConsent: boolean
  aiAnalysisConsent: boolean
  dataRetentionConsent: boolean
  researchConsent: boolean
  clinicalUseConsent: boolean
  consentDuration: 'session' | '30-days' | '90-days' | '1-year'
  dataProcessingLocations: string[]
  clinicalJustification: string
  specialConditions: string
  witnessName?: string
  witnessRelationship?: string
  withdrawalAcknowledged: boolean
  signatureData?: string
}

interface DigitalSignatureCapture {
  signature: string
  timestamp: string
  ipAddress: string
  userAgent: string
  geolocation?: { lat: number; lon: number }
}

interface AuditTrailEntry {
  id: string
  type: 'CONSENT_INITIATED' | 'CONSENT_SIGNED' | 'CONSENT_SUBMITTED' | 'CONSENT_VALIDATED' | 'CONSENT_STORED' | 'CONSENT_REVOKED' | 'DATA_ACCESSED' | 'DATA_EXPORTED'
  sessionId: string
  patientId: string
  timestamp: string
  details: any
  ipAddress: string
  userAgent: string
}

const TEST_SCENARIOS: TestScenario[] = [
  {
    id: 'scenario-standard',
    name: 'Standard Adult Patient',
    description: 'Regular therapy session with full consent capacity',
    patientProfile: {
      id: 'test-patient-001',
      name: 'João Silva',
      age: 32,
      capacity: 'full',
      languagePreference: 'pt'
    },
    sessionType: 'individual',
    consentRequirements: {
      video: true,
      audio: true,
      transcription: true,
      aiAnalysis: true,
      dataRetention: true,
      research: false,
      witnessRequired: false
    },
    riskLevel: 'low',
    expectedOutcome: 'success'
  },
  {
    id: 'scenario-minor',
    name: 'Minor Patient with Guardian',
    description: 'Child therapy requiring guardian consent',
    patientProfile: {
      id: 'test-patient-002',
      name: 'Ana Santos',
      age: 16,
      capacity: 'guardian-required',
      languagePreference: 'pt',
      specialNeeds: 'Parental consent required for all recordings'
    },
    sessionType: 'individual',
    consentRequirements: {
      video: true,
      audio: true,
      transcription: true,
      aiAnalysis: false,
      dataRetention: true,
      research: false,
      witnessRequired: true
    },
    riskLevel: 'medium',
    expectedOutcome: 'success'
  },
  {
    id: 'scenario-high-risk',
    name: 'High-Risk Patient',
    description: 'Patient with limited capacity requiring special handling',
    patientProfile: {
      id: 'test-patient-003',
      name: 'Carlos Oliveira',
      age: 45,
      capacity: 'limited',
      languagePreference: 'pt',
      specialNeeds: 'Cognitive impairment - simplified consent required'
    },
    sessionType: 'assessment',
    consentRequirements: {
      video: true,
      audio: true,
      transcription: false,
      aiAnalysis: false,
      dataRetention: true,
      research: false,
      witnessRequired: true
    },
    riskLevel: 'high',
    expectedOutcome: 'warning'
  },
  {
    id: 'scenario-research',
    name: 'Research Participation',
    description: 'Patient consenting to research participation',
    patientProfile: {
      id: 'test-patient-004',
      name: 'Maria Costa',
      age: 38,
      capacity: 'full',
      languagePreference: 'pt'
    },
    sessionType: 'individual',
    consentRequirements: {
      video: true,
      audio: true,
      transcription: true,
      aiAnalysis: true,
      dataRetention: true,
      research: true,
      witnessRequired: false
    },
    riskLevel: 'medium',
    expectedOutcome: 'success'
  },
  {
    id: 'scenario-revocation',
    name: 'Consent Revocation Test',
    description: 'Testing GDPR right to withdraw consent',
    patientProfile: {
      id: 'test-patient-005',
      name: 'Pedro Ferreira',
      age: 29,
      capacity: 'full',
      languagePreference: 'pt'
    },
    sessionType: 'individual',
    consentRequirements: {
      video: true,
      audio: true,
      transcription: true,
      aiAnalysis: true,
      dataRetention: true,
      research: false,
      witnessRequired: false
    },
    riskLevel: 'low',
    expectedOutcome: 'success'
  }
]

export function GDPRConsentWorkflowTester() {
  // Test state
  const [selectedScenario, setSelectedScenario] = useState<TestScenario | null>(null)
  const [currentStep, setCurrentStep] = useState<'select' | 'consent' | 'signature' | 'validation' | 'complete'>('select')
  const [testInProgress, setTestInProgress] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  
  // Form state
  const [formData, setFormData] = useState<ConsentFormData>({
    patientName: '',
    patientId: '',
    sessionId: '',
    videoConsent: false,
    audioConsent: false,
    transcriptionConsent: false,
    aiAnalysisConsent: false,
    dataRetentionConsent: false,
    researchConsent: false,
    clinicalUseConsent: false,
    consentDuration: 'session',
    dataProcessingLocations: ['Ireland'],
    clinicalJustification: '',
    specialConditions: '',
    withdrawalAcknowledged: false
  })
  
  // Signature state
  const [signatureCapture, setSignatureCapture] = useState<DigitalSignatureCapture | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Audit trail
  const [auditTrail, setAuditTrail] = useKV<AuditTrailEntry[]>('gdpr-test-audit-trail', [])
  const [consentRecords, setConsentRecords] = useKV<any[]>('gdpr-test-consent-records', [])

  // Initialize test scenario
  const startTest = (scenario: TestScenario) => {
    setSelectedScenario(scenario)
    setTestInProgress(true)
    setCurrentStep('consent')
    
    // Pre-fill form with scenario data
    const sessionId = `test-session-${Date.now()}`
    setFormData({
      patientName: scenario.patientProfile.name,
      patientId: scenario.patientProfile.id,
      sessionId,
      videoConsent: scenario.consentRequirements.video,
      audioConsent: scenario.consentRequirements.audio,
      transcriptionConsent: scenario.consentRequirements.transcription,
      aiAnalysisConsent: scenario.consentRequirements.aiAnalysis,
      dataRetentionConsent: scenario.consentRequirements.dataRetention,
      researchConsent: scenario.consentRequirements.research,
      clinicalUseConsent: true,
      consentDuration: 'session',
      dataProcessingLocations: ['Ireland', 'European Union'],
      clinicalJustification: `Clinical session recording for ${scenario.sessionType} therapy`,
      specialConditions: scenario.patientProfile.specialNeeds || '',
      withdrawalAcknowledged: true
    })

    // Add audit entry
    addAuditEntry('CONSENT_INITIATED', sessionId, scenario.patientProfile.id, {
      scenario: scenario.name,
      patientCapacity: scenario.patientProfile.capacity,
      riskLevel: scenario.riskLevel
    })

    toast.success(`Started test scenario: ${scenario.name}`)
  }

  const addAuditEntry = (type: AuditTrailEntry['type'], sessionId: string, patientId: string, details: any) => {
    const entry: AuditTrailEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      sessionId,
      patientId,
      timestamp: new Date().toISOString(),
      details,
      ipAddress: '127.0.0.1', // Simulated
      userAgent: navigator.userAgent
    }
    
    setAuditTrail(current => [...current, entry])
  }

  // Digital signature handling
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const captureSignature = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const signatureData = canvas.toDataURL()
    
    // Simulate geolocation (in real app, request user permission)
    const signature: DigitalSignatureCapture = {
      signature: signatureData,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1', // Simulated
      userAgent: navigator.userAgent,
      geolocation: { lat: 53.3498, lon: -6.2603 } // Dublin coordinates (simulated)
    }
    
    setSignatureCapture(signature)
    setCurrentStep('validation')
    
    if (selectedScenario) {
      addAuditEntry('CONSENT_SIGNED', formData.sessionId, formData.patientId, {
        signatureMethod: 'digital-canvas',
        witnessPresent: selectedScenario.consentRequirements.witnessRequired
      })
    }
    
    toast.success('Digital signature captured successfully')
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignatureCapture(null)
  }

  // Validation and submission
  const validateConsent = async () => {
    if (!selectedScenario || !signatureCapture) return

    const validationResults = []
    
    // GDPR Compliance Checks
    const gdprChecks = [
      {
        name: 'Lawful Basis',
        passed: formData.clinicalJustification.length > 0,
        requirement: 'GDPR Article 6 - Legitimate interest for healthcare'
      },
      {
        name: 'Specific Consent',
        passed: formData.videoConsent || formData.audioConsent,
        requirement: 'GDPR Article 7 - Specific consent for processing'
      },
      {
        name: 'Informed Consent',
        passed: formData.withdrawalAcknowledged,
        requirement: 'GDPR Article 7 - Right to withdraw consent acknowledged'
      },
      {
        name: 'Data Minimization',
        passed: (!formData.researchConsent || selectedScenario.consentRequirements.research),
        requirement: 'GDPR Article 5 - Data minimization principle'
      },
      {
        name: 'Capacity Assessment',
        passed: selectedScenario.patientProfile.capacity === 'full' || formData.witnessName,
        requirement: 'Mental Capacity Act - Appropriate consent obtained'
      }
    ]

    validationResults.push(...gdprChecks)

    // Technical validation
    const technicalChecks = [
      {
        name: 'Digital Signature',
        passed: signatureCapture.signature.length > 100,
        requirement: 'Valid digital signature captured'
      },
      {
        name: 'Timestamp Integrity',
        passed: new Date(signatureCapture.timestamp) <= new Date(),
        requirement: 'Signature timestamp valid'
      },
      {
        name: 'Session Integrity',
        passed: formData.sessionId.startsWith('test-session-'),
        requirement: 'Valid session identifier'
      }
    ]

    validationResults.push(...technicalChecks)

    const allPassed = validationResults.every(check => check.passed)
    
    setTestResults(validationResults)
    
    if (selectedScenario) {
      addAuditEntry('CONSENT_VALIDATED', formData.sessionId, formData.patientId, {
        validationResults,
        allChecksPassed: allPassed,
        riskLevel: selectedScenario.riskLevel
      })
    }

    if (allPassed) {
      await submitConsent()
    } else {
      toast.error('Consent validation failed - see results for details')
    }
  }

  const submitConsent = async () => {
    if (!selectedScenario || !signatureCapture) return

    const consentRecord = {
      id: `consent-${formData.sessionId}`,
      ...formData,
      digitalSignature: signatureCapture.signature,
      ipAddress: signatureCapture.ipAddress,
      timestamp: signatureCapture.timestamp,
      userAgent: signatureCapture.userAgent,
      geolocation: signatureCapture.geolocation,
      witnessInfo: formData.witnessName ? {
        name: formData.witnessName,
        relationship: formData.witnessRelationship || 'Guardian',
        signature: 'Digital witness confirmation'
      } : undefined,
      status: 'active',
      scenario: selectedScenario.name,
      validationResults: testResults
    }

    // Store consent record
    setConsentRecords(current => [...current, consentRecord])
    
    // Also store in main consent system for integration testing
    await spark.kv.set(`consent-${formData.sessionId}`, consentRecord)

    addAuditEntry('CONSENT_STORED', formData.sessionId, formData.patientId, {
      consentId: consentRecord.id,
      dataLocations: formData.dataProcessingLocations,
      retentionPeriod: formData.consentDuration
    })

    setCurrentStep('complete')
    toast.success('Consent successfully submitted and stored')
  }

  const resetTest = () => {
    setSelectedScenario(null)
    setCurrentStep('select')
    setTestInProgress(false)
    setTestResults([])
    setSignatureCapture(null)
    clearSignature()
    toast.info('Test reset - ready for new scenario')
  }

  const exportTestData = () => {
    const exportData = {
      scenario: selectedScenario,
      formData,
      signatureCapture,
      testResults,
      auditTrail: auditTrail.filter(entry => 
        selectedScenario && entry.sessionId === formData.sessionId
      ),
      exportedAt: new Date().toISOString(),
      compliance: 'GDPR Article 20 - Right to Data Portability'
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gdpr-consent-test-${formData.sessionId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Test data exported successfully')
  }

  const testConsentRevocation = async () => {
    if (!selectedScenario) return

    const revokedRecord = {
      ...consentRecords[consentRecords.length - 1],
      status: 'revoked',
      revokedAt: new Date().toISOString(),
      revocationReason: 'Patient exercised GDPR Article 7(3) right to withdraw'
    }

    setConsentRecords(current => 
      current.map((record, index) => 
        index === current.length - 1 ? revokedRecord : record
      )
    )

    addAuditEntry('CONSENT_REVOKED', formData.sessionId, formData.patientId, {
      revocationMethod: 'patient-request',
      gdprArticle: 'Article 7(3) - Right to withdraw consent'
    })

    toast.success('Consent revocation tested successfully')
  }

  if (currentStep === 'select') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              GDPR Consent Workflow Tester
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Test digital consent workflows with various patient scenarios and GDPR compliance validation
            </p>
          </CardHeader>
        </Card>

        {/* Test Scenarios */}
        <div className="grid gap-4 md:grid-cols-2">
          {TEST_SCENARIOS.map(scenario => (
            <Card key={scenario.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{scenario.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={
                      scenario.riskLevel === 'low' ? 'default' :
                      scenario.riskLevel === 'medium' ? 'secondary' : 'destructive'
                    }>
                      {scenario.riskLevel} risk
                    </Badge>
                    <Badge variant="outline">
                      {scenario.expectedOutcome}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Patient Profile</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>{scenario.patientProfile.name}, {scenario.patientProfile.age} years</p>
                      <p>Capacity: {scenario.patientProfile.capacity}</p>
                      {scenario.patientProfile.specialNeeds && (
                        <p className="text-orange-600">{scenario.patientProfile.specialNeeds}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-1">Required Consents</h4>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(scenario.consentRequirements).map(([key, required]) => 
                        required && (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {key}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => startTest(scenario)} 
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Previous Test Results */}
        {auditTrail.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Test Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {auditTrail.slice(-10).reverse().map(entry => (
                  <div key={entry.id} className="flex items-center gap-3 text-sm p-2 bg-muted rounded">
                    <Badge variant="outline">{entry.type}</Badge>
                    <span className="flex-1">{entry.sessionId}</span>
                    <span className="text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (currentStep === 'consent') {
    return (
      <div className="space-y-6">
        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Button onClick={resetTest} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Test
              </Button>
              <div className="flex-1">
                <h3 className="font-medium">Testing: {selectedScenario?.name}</h3>
                <p className="text-sm text-muted-foreground">Step 1: Consent Form</p>
              </div>
              <Badge variant="outline">GDPR Compliant</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Consent Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Patient Consent Form
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete digital consent form with GDPR compliance requirements
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Patient Name</label>
                <Input 
                  value={formData.patientName} 
                  onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium">Patient ID</label>
                <Input 
                  value={formData.patientId} 
                  disabled
                />
              </div>
            </div>

            {/* Recording Permissions */}
            <div>
              <h4 className="font-medium mb-3">Recording Permissions</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={formData.videoConsent}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, videoConsent: checked as boolean }))
                    }
                  />
                  <Video className="h-4 w-4" />
                  <span className="text-sm">Video Recording</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={formData.audioConsent}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, audioConsent: checked as boolean }))
                    }
                  />
                  <Mic className="h-4 w-4" />
                  <span className="text-sm">Audio Recording</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={formData.transcriptionConsent}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, transcriptionConsent: checked as boolean }))
                    }
                  />
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Transcription</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={formData.aiAnalysisConsent}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, aiAnalysisConsent: checked as boolean }))
                    }
                  />
                  <Brain className="h-4 w-4" />
                  <span className="text-sm">AI Analysis</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={formData.dataRetentionConsent}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, dataRetentionConsent: checked as boolean }))
                    }
                  />
                  <Database className="h-4 w-4" />
                  <span className="text-sm">Data Retention</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={formData.researchConsent}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, researchConsent: checked as boolean }))
                    }
                  />
                  <Search className="h-4 w-4" />
                  <span className="text-sm">Research Use</span>
                </label>
              </div>
            </div>

            {/* Clinical Justification */}
            <div>
              <label className="text-sm font-medium">Clinical Justification</label>
              <Textarea 
                value={formData.clinicalJustification}
                onChange={(e) => setFormData(prev => ({ ...prev, clinicalJustification: e.target.value }))}
                placeholder="Provide clinical justification for recording this session..."
                className="mt-1"
              />
            </div>

            {/* Witness Information (if required) */}
            {selectedScenario?.consentRequirements.witnessRequired && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Witness Information (Required)
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Witness Name</label>
                    <Input 
                      value={formData.witnessName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, witnessName: e.target.value }))}
                      placeholder="Enter witness name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Relationship</label>
                    <Input 
                      value={formData.witnessRelationship || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, witnessRelationship: e.target.value }))}
                      placeholder="Parent, Guardian, etc."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* GDPR Acknowledgment */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                GDPR Rights Acknowledgment
              </h4>
              <label className="flex items-start space-x-2">
                <Checkbox 
                  checked={formData.withdrawalAcknowledged}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, withdrawalAcknowledged: checked as boolean }))
                  }
                />
                <span className="text-sm">
                  I acknowledge my rights under GDPR including the right to withdraw consent at any time, 
                  access my data, request corrections, and data portability.
                </span>
              </label>
            </div>

            <Button 
              onClick={() => setCurrentStep('signature')} 
              className="w-full"
              disabled={!formData.withdrawalAcknowledged}
            >
              Proceed to Digital Signature
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === 'signature') {
    return (
      <div className="space-y-6">
        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Button onClick={() => setCurrentStep('consent')} variant="outline" size="sm">
                Back
              </Button>
              <div className="flex-1">
                <h3 className="font-medium">Testing: {selectedScenario?.name}</h3>
                <p className="text-sm text-muted-foreground">Step 2: Digital Signature</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Digital Signature */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Signature className="h-5 w-5" />
              Digital Signature Capture
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Sign using your mouse or touch device to provide legally binding consent
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-48 border rounded cursor-crosshair bg-white"
                style={{ touchAction: 'none' }}
              />
            </div>
            
            <div className="flex gap-3">
              <Button onClick={clearSignature} variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button 
                onClick={captureSignature} 
                disabled={!canvasRef.current}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Capture Signature
              </Button>
            </div>

            {signatureCapture && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  ✓ Signature captured at {new Date(signatureCapture.timestamp).toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  IP: {signatureCapture.ipAddress} | 
                  Location: {signatureCapture.geolocation?.lat.toFixed(4)}, {signatureCapture.geolocation?.lon.toFixed(4)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === 'validation') {
    return (
      <div className="space-y-6">
        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Button onClick={() => setCurrentStep('signature')} variant="outline" size="sm">
                Back
              </Button>
              <div className="flex-1">
                <h3 className="font-medium">Testing: {selectedScenario?.name}</h3>
                <p className="text-sm text-muted-foreground">Step 3: Validation & Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              GDPR Compliance Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <div className="text-center py-8">
                <Button onClick={validateConsent} size="lg">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Validate Consent & Compliance
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded">
                    {result.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-muted-foreground">{result.requirement}</p>
                    </div>
                    <Badge variant={result.passed ? 'default' : 'destructive'}>
                      {result.passed ? 'Pass' : 'Fail'}
                    </Badge>
                  </div>
                ))}
                
                {testResults.every(r => r.passed) && (
                  <div className="mt-6 text-center">
                    <p className="text-green-600 font-medium mb-3">
                      ✓ All compliance checks passed!
                    </p>
                    <Button onClick={() => setCurrentStep('complete')} size="lg">
                      Complete Test
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === 'complete') {
    return (
      <div className="space-y-6">
        {/* Success */}
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Test Completed Successfully!</h3>
            <p className="text-muted-foreground mb-4">
              GDPR consent workflow for "{selectedScenario?.name}" completed with full compliance
            </p>
            
            <div className="flex gap-3 justify-center">
              <Button onClick={exportTestData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Test Data
              </Button>
              <Button onClick={testConsentRevocation} variant="outline">
                <XCircle className="h-4 w-4 mr-2" />
                Test Revocation
              </Button>
              <Button onClick={resetTest}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Run Another Test
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Scenario Details</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Patient:</span> {formData.patientName}</p>
                  <p><span className="font-medium">Session:</span> {formData.sessionId}</p>
                  <p><span className="font-medium">Risk Level:</span> {selectedScenario?.riskLevel}</p>
                  <p><span className="font-medium">Capacity:</span> {selectedScenario?.patientProfile.capacity}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Compliance Status</h4>
                <div className="text-sm space-y-1">
                  <p className="text-green-600">✓ GDPR Article 6 - Lawful basis</p>
                  <p className="text-green-600">✓ GDPR Article 7 - Valid consent</p>
                  <p className="text-green-600">✓ Digital signature captured</p>
                  <p className="text-green-600">✓ Audit trail complete</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consent Records */}
        {consentRecords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Consent Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {consentRecords.slice(-3).map((record, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded">
                    <FileText className="h-4 w-4" />
                    <div className="flex-1">
                      <p className="font-medium">{record.patientName}</p>
                      <p className="text-sm text-muted-foreground">{record.sessionId}</p>
                    </div>
                    <Badge className={record.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return null
}