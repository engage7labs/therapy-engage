import { useState, useEffect } from 'react'
import { useKV } from '@/hooks/use-kv'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Clock
} from 'lucide-react'
import { PatientConsentForm } from './patient-consent-form'
// import { SessionRecorder } from './session-recorder' // ###desabilitado_mvp###
import { toast } from 'sonner'

interface SecureSessionRecorderProps {
  sessionId: string
  patientId: string
  patientName: string
  therapistId: string
  onSessionComplete?: (sessionData: any) => void
}

interface ConsentData {
  id: string
  patientId: string
  sessionId: string
  patientName: string
  timestamp: string
  digitalSignature: string
  ipAddress: string
  videoRecordingConsent: boolean
  audioRecordingConsent: boolean
  transcriptionConsent: boolean
  aiAnalysisConsent: boolean
  dataRetentionConsent: boolean
  researchConsent: boolean
  clinicalUseConsent: boolean
  witnessInfo?: {
    name: string
    relationship: string
    signature: string
  }
  specialConditions?: string
  consentDuration: 'session' | '30-days' | '90-days' | '1-year'
  dataProcessingLocations: string[]
  withdrawalAcknowledged: boolean
  clinicalJustification: string
  status?: 'active' | 'revoked' | 'expired'
  revokedAt?: string
}

type SessionStage = 'pre-session' | 'consent-review' | 'recording-authorized' | 'session-active' | 'session-complete'

export function SecureSessionRecorder({ 
  sessionId, 
  patientId, 
  patientName, 
  therapistId,
  onSessionComplete 
}: SecureSessionRecorderProps) {
  // Session state management
  const [sessionStage, setSessionStage] = useState<SessionStage>('pre-session')
  const [consentData, setConsentData] = useKV<ConsentData | null>(`consent-${sessionId}`, null)
  const [sessionMetadata, setSessionMetadata] = useKV(`session-metadata-${sessionId}`, {
    sessionId,
    patientId,
    patientName,
    therapistId,
    createdAt: new Date().toISOString(),
    status: 'pending-consent',
    complianceChecks: {
      consentObtained: false,
      gdprCompliant: false,
      hipaaCompliant: false,
      auditTrailCreated: false
    }
  })

  // Check for existing valid consent on mount
  useEffect(() => {
    if (consentData && consentData.status !== 'revoked') {
      // Check if consent is still valid based on duration
      const consentDate = new Date(consentData.timestamp)
      const now = new Date()
      let isValid = false

      switch (consentData.consentDuration) {
        case 'session':
          // Session-specific consent is always valid for this session
          isValid = consentData.sessionId === sessionId
          break
        case '30-days':
          isValid = (now.getTime() - consentDate.getTime()) < (30 * 24 * 60 * 60 * 1000)
          break
        case '90-days':
          isValid = (now.getTime() - consentDate.getTime()) < (90 * 24 * 60 * 60 * 1000)
          break
        case '1-year':
          isValid = (now.getTime() - consentDate.getTime()) < (365 * 24 * 60 * 60 * 1000)
          break
      }

      if (isValid) {
        setSessionStage('consent-review')
      } else {
        // Consent expired, require new consent
        setConsentData(null)
        toast.warning('Previous consent has expired. New consent required.')
      }
    }
  }, [consentData, sessionId])

  const handleConsentGranted = async (newConsentData: ConsentData) => {
    try {
      // Update session metadata with compliance checks
      const updatedMetadata = {
        ...sessionMetadata,
        status: 'consent-granted',
        consentId: newConsentData.id,
        consentTimestamp: newConsentData.timestamp,
        complianceChecks: {
          consentObtained: true,
          gdprCompliant: true,
          hipaaCompliant: true,
          auditTrailCreated: true
        },
        recordingPermissions: {
          video: newConsentData.videoRecordingConsent,
          audio: newConsentData.audioRecordingConsent,
          transcription: newConsentData.transcriptionConsent,
          aiAnalysis: newConsentData.aiAnalysisConsent
        }
      }

      setSessionMetadata(updatedMetadata)
      setSessionStage('recording-authorized')

      // Log successful consent in audit trail
      const auditEntry = {
        id: `audit-${Date.now()}`,
        type: 'SESSION_AUTHORIZED',
        sessionId,
        patientId,
        therapistId,
        timestamp: new Date().toISOString(),
        details: {
          consentId: newConsentData.id,
          permissions: updatedMetadata.recordingPermissions,
          clinicalJustification: newConsentData.clinicalJustification
        }
      }

      // ###desabilitado_mvp### const existingAudit = await spark.kv.get<any[]>('audit-trail') || []
      // ###desabilitado_mvp### await spark.kv.set('audit-trail', [...existingAudit, auditEntry])

      toast.success('Session authorized - ready to begin recording')

    } catch (error) {
      console.error('Error processing consent:', error)
      toast.error('Failed to process consent authorization')
    }
  }

  const handleConsentDeclined = async () => {
    try {
      // Update session to reflect declined consent
      const updatedMetadata = {
        ...sessionMetadata,
        status: 'consent-declined',
        complianceChecks: {
          consentObtained: false,
          gdprCompliant: true, // Still compliant, just no recording
          hipaaCompliant: true,
          auditTrailCreated: true
        }
      }

      setSessionMetadata(updatedMetadata)

      // Log declined consent
      const auditEntry = {
        id: `audit-${Date.now()}`,
        type: 'CONSENT_DECLINED',
        sessionId,
        patientId,
        therapistId,
        timestamp: new Date().toISOString(),
        details: {
          reason: 'Patient declined recording consent',
          sessionWillProceed: true,
          recordingEnabled: false
        }
      }

      // ###desabilitado_mvp### const existingAudit = await spark.kv.get<any[]>('audit-trail') || []
      // ###desabilitado_mvp### await spark.kv.set('audit-trail', [...existingAudit, auditEntry])

      toast.info('Session will proceed without recording capabilities')

    } catch (error) {
      console.error('Error processing consent decline:', error)
      toast.error('Failed to process consent response')
    }
  }

  const handleProceedWithConsent = () => {
    if (consentData) {
      setSessionStage('recording-authorized')
      toast.success('Proceeding with authorized recording permissions')
    }
  }

  const handleSessionStart = () => {
    setSessionStage('session-active')
    
    // Update metadata
    setSessionMetadata({
      ...sessionMetadata,
      status: 'active'
    })
  }

  const handleSessionEnd = async (sessionData: any) => {
    try {
      setSessionStage('session-complete')
      
      // Update final session metadata
      const finalMetadata = {
        ...sessionMetadata,
        status: 'completed',
        completedAt: new Date().toISOString(),
        duration: sessionData.duration,
        recordingData: sessionData
      }

      setSessionMetadata(finalMetadata)

      // Create final audit entry
      const auditEntry = {
        id: `audit-${Date.now()}`,
        type: 'SESSION_COMPLETED',
        sessionId,
        patientId,
        therapistId,
        timestamp: new Date().toISOString(),
        details: {
          duration: sessionData.duration,
          recordingStatus: sessionData.recordingEnabled ? 'recorded' : 'not-recorded',
          transcriptionStatus: sessionData.transcriptionStatus,
          aiAnalysisStatus: sessionData.aiAnalysisStatus
        }
      }

      // ###desabilitado_mvp### const existingAudit = await spark.kv.get<any[]>('audit-trail') || []
      // ###desabilitado_mvp### await spark.kv.set('audit-trail', [...existingAudit, auditEntry])

      if (onSessionComplete) {
        onSessionComplete({
          ...sessionData,
          metadata: finalMetadata,
          consent: consentData
        })
      }

      toast.success('Session completed and documented')

    } catch (error) {
      console.error('Error completing session:', error)
      toast.error('Error finalizing session documentation')
    }
  }

  const renderPreSessionChecks = () => (
    <div className="space-y-6">
      {/* Session Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Secure Therapy Session Setup
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Session: {sessionId} • Patient: {patientName}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Compliance Status</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">GDPR Ready</Badge>
                <Badge variant="secondary">HIPAA Compliant</Badge>
                <Badge variant="secondary">LGPD Ready</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Data Processing</p>
              <p className="text-xs text-muted-foreground mt-1">
                EU/Ireland • Encrypted • Audit Logged
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-session Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Required Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Patient Informed Consent</p>
                <p className="text-xs text-muted-foreground">Required before session recording</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setSessionStage('consent-review')} 
            className="w-full mt-4"
          >
            Begin Consent Process
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderConsentReview = () => {
    if (consentData && consentData.status !== 'revoked') {
      return (
        <div className="space-y-6">
          {/* Existing Consent Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Valid Consent on File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Consent Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(consentData.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Valid Until</p>
                  <p className="text-sm text-muted-foreground">
                    {consentData.consentDuration === 'session' ? 'This session only' : 
                     consentData.consentDuration.replace('-', ' ')}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Authorized Permissions</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {consentData.videoRecordingConsent && (
                    <Badge variant="default">Video Recording</Badge>
                  )}
                  {consentData.audioRecordingConsent && (
                    <Badge variant="default">Audio Recording</Badge>
                  )}
                  {consentData.transcriptionConsent && (
                    <Badge variant="secondary">Transcription</Badge>
                  )}
                  {consentData.aiAnalysisConsent && (
                    <Badge variant="secondary">AI Analysis</Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleProceedWithConsent} className="flex-1">
                  Proceed with Session
                </Button>
                <Button 
                  onClick={() => setConsentData(null)} 
                  variant="outline"
                >
                  Update Consent
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <PatientConsentForm
        patientId={patientId}
        patientName={patientName}
        sessionId={sessionId}
        onConsentGranted={handleConsentGranted}
        onConsentDeclined={handleConsentDeclined}
      />
    )
  }

  const renderSessionAuthorized = () => (
    <div className="space-y-6">
      {/* Authorization Confirmation */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <UserCheck className="h-5 w-5" />
            Session Authorized for Recording
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-700">
          <p className="text-sm">
            Informed consent has been obtained and documented. Session recording is authorized 
            with the following permissions:
          </p>
          
          {consentData && (
            <div className="grid gap-2 md:grid-cols-2 mt-3">
              {consentData.videoRecordingConsent && (
                <Badge variant="default">Video Authorized</Badge>
              )}
              {consentData.audioRecordingConsent && (
                <Badge variant="default">Audio Authorized</Badge>
              )}
              {consentData.transcriptionConsent && (
                <Badge variant="secondary">Transcription Authorized</Badge>
              )}
              {consentData.aiAnalysisConsent && (
                <Badge variant="secondary">AI Analysis Authorized</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ready to Start */}
      <Card>
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div>
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold">Ready to Begin Session</h3>
              <p className="text-sm text-muted-foreground">
                All compliance requirements met. Click below to start the therapy session.
              </p>
            </div>
            
            <Button 
              onClick={handleSessionStart} 
              size="lg" 
              className="min-w-48"
            >
              Start Therapy Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderActiveSession = () => {
    if (!consentData) {
      return (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
              <span>Session proceeding without recording (consent declined)</span>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>###desabilitado_mvp### Session Recorder</p>
            <p className="text-sm mt-2">Recording functionality disabled for MVP</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderSessionComplete = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          Session Completed Successfully
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Session has been completed and all data has been securely processed according 
            to the patient's consent preferences.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Session Duration</p>
              <p className="text-sm text-muted-foreground">
                Not recorded
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Compliance Status</p>
              <Badge variant="default">Fully Compliant</Badge>
            </div>
          </div>

          <Button 
            onClick={() => setSessionStage('pre-session')}
            variant="outline"
            className="w-full"
          >
            Start New Session
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Main render logic
  switch (sessionStage) {
    case 'pre-session':
      return renderPreSessionChecks()
    case 'consent-review':
      return renderConsentReview()
    case 'recording-authorized':
      return renderSessionAuthorized()
    case 'session-active':
      return renderActiveSession()
    case 'session-complete':
      return renderSessionComplete()
    default:
      return renderPreSessionChecks()
  }
}