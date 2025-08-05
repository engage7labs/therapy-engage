import { useState } from 'react'
import { useKV } from '../hooks/use-kv'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  FileText, 
  UserCheck, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Video,
  Microphone,
  Lock
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ConsentFormProps {
  patientId: string
  patientName: string
  sessionId: string
  onConsentGranted: (consentData: ConsentData) => void
  onConsentDeclined: () => void
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
}

export function PatientConsentForm({ 
  patientId, 
  patientName, 
  sessionId, 
  onConsentGranted, 
  onConsentDeclined 
}: ConsentFormProps) {
  // Consent state management
  const [consentData, setConsentData] = useKV<ConsentData | null>(`consent-${sessionId}`, null)
  
  // Form state
  const [digitalSignature, setDigitalSignature] = useState('')
  const [witnessName, setWitnessName] = useState('')
  const [witnessRelationship, setWitnessRelationship] = useState('')
  const [witnessSignature, setWitnessSignature] = useState('')
  const [specialConditions, setSpecialConditions] = useState('')
  const [clinicalJustification, setClinicalJustification] = useState('')
  const [consentDuration, setConsentDuration] = useState<'session' | '30-days' | '90-days' | '1-year'>('session')
  
  // Individual consent checkboxes
  const [videoRecordingConsent, setVideoRecordingConsent] = useState(false)
  const [audioRecordingConsent, setAudioRecordingConsent] = useState(false)
  const [transcriptionConsent, setTranscriptionConsent] = useState(false)
  const [aiAnalysisConsent, setAiAnalysisConsent] = useState(false)
  const [dataRetentionConsent, setDataRetentionConsent] = useState(false)
  const [researchConsent, setResearchConsent] = useState(false)
  const [clinicalUseConsent, setClinicalUseConsent] = useState(false)
  const [withdrawalAcknowledged, setWithdrawalAcknowledged] = useState(false)
  
  // Form validation and submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWitnessSection, setShowWitnessSection] = useState(false)

  // Check if existing consent exists
  const hasValidConsent = consentData && consentData.sessionId === sessionId

  const validateForm = () => {
    if (!digitalSignature.trim()) {
      toast.error('Digital signature is required')
      return false
    }
    
    if (!clinicalJustification.trim()) {
      toast.error('Clinical justification is required')
      return false
    }

    if (!videoRecordingConsent && !audioRecordingConsent) {
      toast.error('At least video or audio recording consent is required for session recording')
      return false
    }

    if (!withdrawalAcknowledged) {
      toast.error('Patient must acknowledge right to withdraw consent')
      return false
    }

    if (showWitnessSection && (!witnessName.trim() || !witnessSignature.trim())) {
      toast.error('Witness information is incomplete')
      return false
    }

    return true
  }

  const handleSubmitConsent = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const newConsentData: ConsentData = {
        id: `consent-${Date.now()}`,
        patientId,
        sessionId,
        patientName,
        timestamp: new Date().toISOString(),
        digitalSignature,
        ipAddress: '127.0.0.1', // In real implementation, get actual IP
        videoRecordingConsent,
        audioRecordingConsent,
        transcriptionConsent,
        aiAnalysisConsent,
        dataRetentionConsent,
        researchConsent,
        clinicalUseConsent,
        witnessInfo: showWitnessSection ? {
          name: witnessName,
          relationship: witnessRelationship,
          signature: witnessSignature
        } : undefined,
        specialConditions: specialConditions.trim() || undefined,
        consentDuration,
        dataProcessingLocations: ['Ireland (EU)', 'Azure Cloud (EU-West)'],
        withdrawalAcknowledged,
        clinicalJustification
      }

      // Store consent permanently
      setConsentData(newConsentData)
      
      // Generate audit trail
      const auditEntry = {
        id: `audit-${Date.now()}`,
        type: 'CONSENT_GRANTED',
        sessionId,
        patientId,
        timestamp: new Date().toISOString(),
        details: {
          consentTypes: {
            video: videoRecordingConsent,
            audio: audioRecordingConsent,
            transcription: transcriptionConsent,
            aiAnalysis: aiAnalysisConsent
          },
          duration: consentDuration,
          hasWitness: showWitnessSection
        }
      }

      // Store audit trail
      const [existingAudit, setAuditTrail] = await Promise.all([
        spark.kv.get<any[]>('audit-trail') || [],
        spark.kv.set('audit-trail', [])
      ])
      
      if (Array.isArray(existingAudit)) {
        await spark.kv.set('audit-trail', [...existingAudit, auditEntry])
      }

      toast.success('Informed consent documented successfully')
      onConsentGranted(newConsentData)

    } catch (error) {
      console.error('Consent submission error:', error)
      toast.error('Failed to process consent form')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeclineConsent = () => {
    const auditEntry = {
      id: `audit-${Date.now()}`,
      type: 'CONSENT_DECLINED',
      sessionId,
      patientId,
      timestamp: new Date().toISOString(),
      details: {
        reason: 'Patient declined recording consent'
      }
    }

    // Log refusal in audit trail
    spark.kv.get<any[]>('audit-trail').then(existingAudit => {
      const trail = existingAudit || []
      spark.kv.set('audit-trail', [...trail, auditEntry])
    })

    toast.info('Consent declined - session will proceed without recording')
    onConsentDeclined()
  }

  const handleRevokeConsent = async () => {
    if (consentData) {
      // Mark consent as revoked but maintain record for audit
      const revokedConsent = {
        ...consentData,
        revokedAt: new Date().toISOString(),
        status: 'revoked'
      }

      setConsentData(revokedConsent)
      
      const auditEntry = {
        id: `audit-${Date.now()}`,
        type: 'CONSENT_REVOKED',
        sessionId,
        patientId,
        timestamp: new Date().toISOString(),
        details: {
          originalConsentId: consentData.id,
          revokedDuring: 'pre-session'
        }
      }

      const existingAudit = await spark.kv.get<any[]>('audit-trail') || []
      await spark.kv.set('audit-trail', [...existingAudit, auditEntry])

      toast.success('Consent revoked successfully')
    }
  }

  // If valid consent already exists
  if (hasValidConsent && consentData.status !== 'revoked') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Valid Informed Consent on File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium">Patient</Label>
              <p className="text-sm text-muted-foreground">{consentData.patientName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Consent Date</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(consentData.timestamp).toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Duration</Label>
              <p className="text-sm text-muted-foreground">{consentData.consentDuration}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Digital Signature</Label>
              <p className="text-sm text-muted-foreground font-mono">{consentData.digitalSignature}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-sm font-medium">Granted Permissions</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {consentData.videoRecordingConsent && (
                <Badge variant="default" className="justify-start">
                  <Video className="h-3 w-3 mr-1" />
                  Video Recording
                </Badge>
              )}
              {consentData.audioRecordingConsent && (
                <Badge variant="default" className="justify-start">
                  <Microphone className="h-3 w-3 mr-1" />
                  Audio Recording
                </Badge>
              )}
              {consentData.transcriptionConsent && (
                <Badge variant="secondary" className="justify-start">
                  <FileText className="h-3 w-3 mr-1" />
                  Transcription
                </Badge>
              )}
              {consentData.aiAnalysisConsent && (
                <Badge variant="secondary" className="justify-start">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  AI Analysis
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={() => onConsentGranted(consentData)} className="flex-1">
              Proceed with Session
            </Button>
            <Button onClick={handleRevokeConsent} variant="outline">
              Revoke Consent
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Informed Consent for Therapy Session Recording
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            GDPR & LGPD Compliant • Patient: {patientName} • Session: {sessionId}
          </p>
        </CardHeader>
      </Card>

      {/* Privacy Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Privacy & Data Protection Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>Your privacy is our priority.</strong> This therapy session recording will be:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Encrypted during transmission and storage using AES-256</li>
            <li>Processed within EU/Ireland data centers for GDPR compliance</li>
            <li>Accessible only to your licensed therapist and authorized clinical staff</li>
            <li>Automatically deleted according to your selected retention period</li>
            <li>Never shared with third parties without explicit written consent</li>
          </ul>
        </CardContent>
      </Card>

      {/* Consent Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Consent Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Permissions */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Recording Permissions</Label>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="video-consent"
                  checked={videoRecordingConsent}
                  onCheckedChange={(checked) => setVideoRecordingConsent(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="video-consent" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video Recording Consent
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    I consent to video recording of this therapy session for clinical documentation and treatment planning.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="audio-consent"
                  checked={audioRecordingConsent}
                  onCheckedChange={(checked) => setAudioRecordingConsent(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="audio-consent" className="flex items-center gap-2">
                    <Microphone className="h-4 w-4" />
                    Audio Recording Consent
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    I consent to audio recording for session documentation and automated transcription services.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Processing Permissions */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Data Processing Permissions</Label>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="transcription-consent"
                  checked={transcriptionConsent}
                  onCheckedChange={(checked) => setTranscriptionConsent(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="transcription-consent">Automated Transcription</Label>
                  <p className="text-xs text-muted-foreground">
                    Convert audio to text using secure, HIPAA-compliant transcription services.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="ai-analysis-consent"
                  checked={aiAnalysisConsent}
                  onCheckedChange={(checked) => setAiAnalysisConsent(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="ai-analysis-consent">AI-Assisted Clinical Analysis</Label>
                  <p className="text-xs text-muted-foreground">
                    Generate insights to support clinical decision-making (reviewed by licensed therapist).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="data-retention-consent"
                  checked={dataRetentionConsent}
                  onCheckedChange={(checked) => setDataRetentionConsent(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="data-retention-consent">Secure Data Retention</Label>
                  <p className="text-xs text-muted-foreground">
                    Store session data securely for continuity of care and treatment planning.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Optional Permissions */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Optional Permissions</Label>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="clinical-use-consent"
                  checked={clinicalUseConsent}
                  onCheckedChange={(checked) => setClinicalUseConsent(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="clinical-use-consent">Clinical Team Consultation</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow consultation with clinical supervisors or specialists for optimal care.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="research-consent"
                  checked={researchConsent}
                  onCheckedChange={(checked) => setResearchConsent(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="research-consent">De-identified Research (Optional)</Label>
                  <p className="text-xs text-muted-foreground">
                    Support mental health research with completely anonymized, aggregated data.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Consent Duration */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Consent Duration</Label>
            <select
              value={consentDuration}
              onChange={(e) => setConsentDuration(e.target.value as any)}
              className="w-full p-2 border rounded-md"
            >
              <option value="session">This session only</option>
              <option value="30-days">30 days</option>
              <option value="90-days">90 days</option>
              <option value="1-year">1 year</option>
            </select>
            <p className="text-xs text-muted-foreground">
              You can revoke this consent at any time by contacting your therapist.
            </p>
          </div>

          {/* Clinical Justification */}
          <div className="space-y-3">
            <Label htmlFor="clinical-justification" className="text-base font-medium">
              Clinical Justification <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="clinical-justification"
              value={clinicalJustification}
              onChange={(e) => setClinicalJustification(e.target.value)}
              placeholder="Brief clinical rationale for session recording (e.g., treatment planning, progress monitoring, clinical supervision)"
              className="min-h-20"
            />
          </div>

          {/* Special Conditions */}
          <div className="space-y-3">
            <Label htmlFor="special-conditions" className="text-base font-medium">
              Special Conditions or Limitations (Optional)
            </Label>
            <Textarea
              id="special-conditions"
              value={specialConditions}
              onChange={(e) => setSpecialConditions(e.target.value)}
              placeholder="Any specific conditions, limitations, or concerns regarding recording"
              className="min-h-16"
            />
          </div>

          {/* Witness Section Toggle */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="witness-required"
              checked={showWitnessSection}
              onCheckedChange={(checked) => setShowWitnessSection(checked as boolean)}
            />
            <Label htmlFor="witness-required">Witness required (for vulnerable patients or complex cases)</Label>
          </div>

          {/* Witness Information */}
          {showWitnessSection && (
            <Card className="p-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Witness Information</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="witness-name">Full Name *</Label>
                    <Input
                      id="witness-name"
                      value={witnessName}
                      onChange={(e) => setWitnessName(e.target.value)}
                      placeholder="Witness full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="witness-relationship">Relationship</Label>
                    <Input
                      id="witness-relationship"
                      value={witnessRelationship}
                      onChange={(e) => setWitnessRelationship(e.target.value)}
                      placeholder="e.g., Family member, Legal guardian"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="witness-signature">Digital Signature *</Label>
                  <Input
                    id="witness-signature"
                    value={witnessSignature}
                    onChange={(e) => setWitnessSignature(e.target.value)}
                    placeholder="Type full name as digital signature"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Patient Acknowledgment */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="withdrawal-acknowledged"
                checked={withdrawalAcknowledged}
                onCheckedChange={(checked) => setWithdrawalAcknowledged(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="withdrawal-acknowledged" className="text-sm font-medium">
                  Right to Withdraw Consent <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  I understand that I can withdraw this consent at any time before, during, or after the session, 
                  and that withdrawal will not affect my access to treatment.
                </p>
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          <div className="space-y-3">
            <Label htmlFor="digital-signature" className="text-base font-medium">
              Patient Digital Signature <span className="text-destructive">*</span>
            </Label>
            <Input
              id="digital-signature"
              value={digitalSignature}
              onChange={(e) => setDigitalSignature(e.target.value)}
              placeholder="Type your full name as digital signature"
            />
            <p className="text-xs text-muted-foreground">
              By typing your name, you provide legally binding consent equivalent to a handwritten signature.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Warning for Incomplete Consent */}
      {(!videoRecordingConsent && !audioRecordingConsent) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                At least video or audio recording consent is required for session recording capabilities.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSubmitConsent}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Processing...' : 'Grant Consent & Proceed'}
        </Button>
        <Button onClick={handleDeclineConsent} variant="outline">
          Decline Recording
        </Button>
      </div>

      {/* Legal Footer */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">
            This consent form complies with GDPR (EU), LGPD (Brazil), and HIPAA (US) privacy regulations. 
            Session recordings are encrypted, stored securely, and accessible only to authorized clinical staff. 
            You maintain the right to request access, modification, or deletion of your data at any time.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}