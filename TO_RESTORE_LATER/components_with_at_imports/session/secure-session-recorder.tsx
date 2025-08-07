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
  Clock,
  Play,
  Square,
  Mic,
  MicOff
} from 'lucide-react'
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
}

export function SecureSessionRecorder({ 
  sessionId, 
  patientId, 
  patientName, 
  therapistId,
  onSessionComplete 
}: SecureSessionRecorderProps) {
  const [consentGiven, setConsentGiven] = useKV(`consent-${sessionId}`, false)
  const [consentData, setConsentData] = useKV(`consent-data-${sessionId}`, null as ConsentData | null)
  const [isRecording, setIsRecording] = useKV(`recording-${sessionId}`, false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleConsentSubmit = (consent: ConsentData) => {
    setConsentData(consent)
    setConsentGiven(true)
    toast.success('Consent received and verified')
  }

  const startRecording = async () => {
    if (!consentGiven) {
      toast.error('Patient consent required before recording')
      return
    }

    try {
      setIsRecording(true)
      setRecordingDuration(0)
      toast.success('Recording started')
    } catch (error) {
      toast.error('Failed to start recording')
      setIsRecording(false)
    }
  }

  const stopRecording = async () => {
    try {
      setIsRecording(false)
      
      const sessionData = {
        sessionId,
        patientId,
        therapistId,
        duration: recordingDuration,
        consent: consentData,
        timestamp: new Date().toISOString()
      }

      if (onSessionComplete) {
        onSessionComplete(sessionData)
      }
      
      toast.success('Recording saved securely')
    } catch (error) {
      toast.error('Failed to save recording')
    }
  }

  if (!consentGiven) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-blue-600" />
            Patient Consent Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Recording requires patient consent</span>
            </div>
            
            <div className="p-4 border border-amber-200 rounded-lg bg-amber-50">
              <h4 className="font-medium mb-2">Consent Form</h4>
              <p className="text-sm text-gray-600 mb-4">
                Patient: {patientName}
              </p>
              <Button onClick={() => {
                // Mock consent process
                const mockConsent: ConsentData = {
                  id: `consent-${Date.now()}`,
                  patientId,
                  sessionId,
                  patientName,
                  timestamp: new Date().toISOString(),
                  digitalSignature: 'MOCK_SIGNATURE',
                  ipAddress: '127.0.0.1',
                  videoRecordingConsent: true,
                  audioRecordingConsent: true,
                  transcriptionConsent: true,
                  aiAnalysisConsent: true,
                  dataRetentionConsent: true,
                  researchConsent: false,
                  clinicalUseConsent: true,
                  consentDuration: 'session',
                  dataProcessingLocations: ['EU'],
                  withdrawalAcknowledged: true,
                  clinicalJustification: 'Therapeutic session recording'
                }
                handleConsentSubmit(mockConsent)
              }}>
                <UserCheck className="mr-2 h-4 w-4" />
                Grant Consent (Demo)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-green-600" />
            Secure Session Recorder
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50">
              <CheckCircle className="mr-1 h-3 w-3" />
              Consent Verified
            </Badge>
            {isRecording && (
              <Badge variant="destructive">
                <div className="animate-pulse bg-red-500 w-2 h-2 rounded-full mr-1"></div>
                Recording
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">{patientName}</h4>
              <p className="text-sm text-gray-500">Session ID: {sessionId}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono font-bold">
                {formatDuration(recordingDuration)}
              </div>
              <p className="text-xs text-gray-500">Duration</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!isRecording ? (
              <Button onClick={startRecording} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="destructive" className="flex-1">
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => setIsMuted(!isMuted)}
              className={isMuted ? 'bg-red-50 border-red-200' : ''}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Audio Level</span>
              <span>{audioLevel}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-150" 
                style={{ width: `${audioLevel}%` }}
              ></div>
            </div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Consent Details</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Video: {consentData?.videoRecordingConsent ? 'Allowed' : 'Not allowed'}</div>
              <div>Audio: {consentData?.audioRecordingConsent ? 'Allowed' : 'Not allowed'}</div>
              <div>Transcription: {consentData?.transcriptionConsent ? 'Allowed' : 'Not allowed'}</div>
              <div>AI Analysis: {consentData?.aiAnalysisConsent ? 'Allowed' : 'Not allowed'}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
