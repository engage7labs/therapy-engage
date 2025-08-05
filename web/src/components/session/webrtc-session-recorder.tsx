import { useEffect, useRef, useState } from 'react'
import { useKV } from '../hooks/use-kv'
import { useWebRTCRecording } from '@/hooks/use-webrtc-recording'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Play, 
  Pause, 
  Square, 
  Microphone, 
  MicrophoneSlash, 
  Video, 
  VideoSlash,
  FileText,
  Brain,
  Shield,
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity,
  RotateCcw
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface WebRTCSessionRecorderProps {
  sessionId: string
  patientName: string
  patientId?: string
  onSessionComplete?: (sessionData: any) => void
  onSessionEnd?: () => void
  demoMode?: boolean
}

export function WebRTCSessionRecorder({ 
  sessionId, 
  patientName, 
  patientId,
  onSessionComplete,
  onSessionEnd,
  demoMode = false
}: WebRTCSessionRecorderProps) {
  const {
    session,
    isRecording,
    isPaused,
    duration,
    videoEnabled,
    audioEnabled,
    videoStream,
    audioStream,
    initializeSession,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    endSession,
    toggleVideo,
    toggleAudio,
    switchCamera,
    error,
    clearError
  } = useWebRTCRecording()

  // Local video element ref
  const videoRef = useRef<HTMLVideoElement>(null)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [showPermissionHelp, setShowPermissionHelp] = useState(false)
  
  // Session metadata
  const [sessionNotes, setSessionNotes] = useKV(`session-notes-${sessionId}`, '')
  const [riskAssessment, setRiskAssessment] = useKV(`risk-assessment-${sessionId}`, 'low')

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream
    }
  }, [videoStream])

  // Handle session initialization
  const handleStartSession = async () => {
    try {
      if (demoMode) {
        // Demo mode - simulate session without real WebRTC
        setSessionStarted(true)
        toast.success(`Demo session started for ${patientName}`)
        return
      }

      await initializeSession(sessionId, patientName)
      setSessionStarted(true)
      
    } catch (error) {
      console.error('Session start error:', error)
      setShowPermissionHelp(true)
    }
  }

  // Handle recording start
  const handleStartRecording = async () => {
    if (demoMode) {
      toast.success('Demo recording started')
      return
    }
    
    await startRecording()
  }

  // Handle session end
  const handleEndSession = async () => {
    try {
      let completedSession = null
      
      if (!demoMode) {
        completedSession = await endSession()
      } else {
        // Demo mode completion
        completedSession = {
          id: sessionId,
          patientName,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          duration: Math.floor(Math.random() * 3600), // Random duration for demo
          status: 'completed',
          demoMode: true
        }
      }
      
      if (completedSession && onSessionComplete) {
        onSessionComplete(completedSession)
      }
      
      if (onSessionEnd) {
        onSessionEnd()
      }
      
      setSessionStarted(false)
      toast.success('Session completed successfully')
      
    } catch (error) {
      console.error('Session end error:', error)
      toast.error('Failed to end session properly')
    }
  }

  // Format duration display
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get session status display
  const getStatusDisplay = () => {
    if (demoMode && sessionStarted) {
      return { variant: 'default' as const, text: 'DEMO ACTIVE' }
    }
    
    if (!session) {
      return { variant: 'secondary' as const, text: 'NOT STARTED' }
    }
    
    switch (session.status) {
      case 'preparing':
        return { variant: 'secondary' as const, text: 'PREPARING' }
      case 'active':
        return { variant: 'default' as const, text: 'ACTIVE' }
      case 'paused':
        return { variant: 'secondary' as const, text: 'PAUSED' }
      case 'stopped':
        return { variant: 'secondary' as const, text: 'STOPPED' }
      case 'processing':
        return { variant: 'secondary' as const, text: 'PROCESSING' }
      case 'completed':
        return { variant: 'default' as const, text: 'COMPLETED' }
      case 'error':
        return { variant: 'destructive' as const, text: 'ERROR' }
      default:
        return { variant: 'secondary' as const, text: 'UNKNOWN' }
    }
  }

  const statusDisplay = getStatusDisplay()

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={clearError}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Permission Help */}
      {showPermissionHelp && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p><strong>Camera/Microphone Permission Required</strong></p>
              <p>Please allow access to your camera and microphone to start the therapy session recording.</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleStartSession}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowPermissionHelp(false)}>
                  Dismiss
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Secure Therapy Session
                {demoMode && <Badge variant="outline">DEMO MODE</Badge>}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {patientName}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {sessionId}
                </div>
                {(session?.duration || duration > 0) && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDuration(session?.duration || duration)}
                  </div>
                )}
              </div>
            </div>
            <Badge variant={statusDisplay.variant} className="clinical-data">
              {statusDisplay.text}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Video Display */}
      <Card>
        <CardContent className="p-6">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
            {/* Real video stream */}
            {!demoMode && videoStream && (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ display: videoEnabled ? 'block' : 'none' }}
              />
            )}
            
            {/* Demo mode or disabled video display */}
            {(demoMode || !videoEnabled || !videoStream) && (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/5 to-primary/10">
                {demoMode ? (
                  <div className="text-center">
                    <Activity className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
                    <p className="text-lg font-medium text-primary">Demo Session Active</p>
                    <p className="text-sm text-muted-foreground">Simulating secure therapy session</p>
                  </div>
                ) : !videoStream ? (
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">Camera Initializing</p>
                    <p className="text-sm text-muted-foreground">Please wait...</p>
                  </div>
                ) : (
                  <VideoSlash className="h-16 w-16 text-muted-foreground" />
                )}
              </div>
            )}
            
            {/* Recording Indicator */}
            {(isRecording || (demoMode && sessionStarted)) && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  REC {formatDuration(session?.duration || duration)}
                </span>
              </div>
            )}

            {/* Session Status Overlay */}
            {session?.status === 'processing' && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Brain className="h-12 w-12 text-primary mx-auto mb-3 animate-spin" />
                  <p className="text-lg font-medium">Processing Session</p>
                  <p className="text-sm text-muted-foreground">Generating AI insights...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* Session Start Controls */}
            {!sessionStarted && (
              <Button onClick={handleStartSession} size="lg" className="min-w-32">
                <Play className="h-4 w-4 mr-2" />
                {demoMode ? 'Start Demo' : 'Start Session'}
              </Button>
            )}

            {/* Active Session Controls */}
            {sessionStarted && (
              <>
                {/* Media Toggle Controls (Real mode only) */}
                {!demoMode && (
                  <>
                    <Button
                      variant={videoEnabled ? 'default' : 'destructive'}
                      size="lg"
                      onClick={toggleVideo}
                      disabled={!session}
                    >
                      {videoEnabled ? <Video className="h-4 w-4" /> : <VideoSlash className="h-4 w-4" />}
                    </Button>

                    <Button
                      variant={audioEnabled ? 'default' : 'destructive'}
                      size="lg"
                      onClick={toggleAudio}
                      disabled={!session}
                    >
                      {audioEnabled ? <Microphone className="h-4 w-4" /> : <MicrophoneSlash className="h-4 w-4" />}
                    </Button>

                    <Separator orientation="vertical" className="h-8" />
                  </>
                )}

                {/* Recording Controls */}
                {!isRecording && !isPaused ? (
                  <Button onClick={handleStartRecording} size="lg" className="min-w-32">
                    <Play className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                ) : isPaused ? (
                  <Button onClick={resumeRecording} size="lg" className="min-w-32">
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                ) : (
                  <>
                    <Button onClick={pauseRecording} variant="outline" size="lg">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                    
                    <Button onClick={stopRecording} variant="destructive" size="lg">
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  </>
                )}

                <Separator orientation="vertical" className="h-8" />

                {/* End Session */}
                <Button onClick={handleEndSession} variant="outline" size="lg">
                  End Session
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Processing Status */}
      {session?.status === 'processing' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Post-Session Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Transcription Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">Session Transcription</span>
                </div>
                <Badge variant="secondary">
                  Processing
                </Badge>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Converting audio to text using Dragon Copilot...
              </p>
            </div>

            <Separator />

            {/* AI Analysis Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Clinical Analysis</span>
                </div>
                <Badge variant="secondary">
                  Queued
                </Badge>
              </div>
              <Progress value={25} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Generating insights with GPT-4o clinical analysis...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Completed */}
      {session?.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Session Completed Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Session Summary</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Duration: {formatDuration(session.duration)}</p>
                  <p>Recording: {session.recordingData ? 'Saved' : 'Demo Mode'}</p>
                  <p>Transcription: {session.transcription ? 'Available' : 'Processing'}</p>
                  <p>AI Analysis: {session.aiInsights ? 'Completed' : 'Processing'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Next Steps</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Review AI-generated insights</p>
                  <p>• Update treatment plan</p>
                  <p>• Schedule follow-up session</p>
                  <p>• Save session notes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Information (Development) */}
      {process.env.NODE_ENV === 'development' && session && (
        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="text-sm">Technical Details (Dev Mode)</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div>Status: {session.status}</div>
            <div>Recording: {isRecording ? 'Active' : 'Inactive'}</div>
            <div>Video: {videoEnabled ? 'Enabled' : 'Disabled'}</div>
            <div>Audio: {audioEnabled ? 'Enabled' : 'Disabled'}</div>
            <div>File Size: {session.metadata.fileSize ? `${(session.metadata.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</div>
            <div>Codec: {session.metadata.mimeType}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}