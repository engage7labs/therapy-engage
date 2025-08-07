import { useState, useRef, useEffect } from 'react'
import { useKV } from '@/hooks/use-kv'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  Circle,
  Pause,
  Play,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  MessageCircle,
  Brain,
  Heart
} from 'lucide-react'
import { toast } from 'sonner'

interface VideoCallInterfaceProps {
  sessionId: string
  patientName: string
  patientId: string
  onEndCall?: () => void
  testMode?: boolean
  testScenario?: string
}

interface CallState {
  isConnected: boolean
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isRecording: boolean
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected'
  duration: number
  recordingDuration: number
}

interface Patient {
  id: string
  name: string
  isOnline: boolean
  hasVideo: boolean
  hasAudio: boolean
  connectionStatus: 'connected' | 'connecting' | 'disconnected'
}

export function VideoCallInterface({ 
  sessionId, 
  patientName, 
  patientId,
  onEndCall,
  testMode = false,
  testScenario 
}: VideoCallInterfaceProps) {
  // Local video/audio refs
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  // Call state management
  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isVideoEnabled: true,
    isAudioEnabled: true,
    isRecording: false,
    connectionQuality: 'disconnected',
    duration: 0,
    recordingDuration: 0
  })

  // Patient state
  const [patient, setPatient] = useState<Patient>({
    id: patientId,
    name: patientName,
    isOnline: false,
    hasVideo: false,
    hasAudio: false,
    connectionStatus: 'disconnected'
  })

  // Session notes and insights
  const [sessionNotes, setSessionNotes] = useKV(`session-notes-${sessionId}`, '')
  const [aiInsights, setAiInsights] = useKV(`ai-insights-${sessionId}`, [])
  const [showNotes, setShowNotes] = useState(false)

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callState.isConnected) {
      interval = setInterval(() => {
        setCallState(prev => ({ ...prev, duration: prev.duration + 1 }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callState.isConnected])

  // Recording duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callState.isRecording) {
      interval = setInterval(() => {
        setCallState(prev => ({ ...prev, recordingDuration: prev.recordingDuration + 1 }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callState.isRecording])

  // Initialize video call
  const initializeCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Simulate patient connection
      setTimeout(() => {
        setPatient(prev => ({
          ...prev,
          isOnline: true,
          hasVideo: true,
          hasAudio: true,
          connectionStatus: 'connected'
        }))
        
        setCallState(prev => ({
          ...prev,
          isConnected: true,
          connectionQuality: 'excellent'
        }))

        // Simulate patient video (for demo)
        simulatePatientVideo()
        
        toast.success(`Connected to ${patientName}`)
      }, 2000)

    } catch (error) {
      toast.error('Failed to access camera/microphone')
      console.error('Media access error:', error)
    }
  }

  // Simulate patient video feed (for demo purposes)
  const simulatePatientVideo = () => {
    if (remoteVideoRef.current) {
      // Create a canvas for simulated patient video
      const canvas = document.createElement('canvas')
      canvas.width = 640
      canvas.height = 480
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        // Simple animation for demo
        let frame = 0
        const animate = () => {
          ctx.fillStyle = '#1e40af'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          ctx.fillStyle = '#ffffff'
          ctx.font = '24px Inter'
          ctx.textAlign = 'center'
          ctx.fillText(patientName, canvas.width / 2, canvas.height / 2 - 20)
          ctx.fillText('(Simulated Patient Video)', canvas.width / 2, canvas.height / 2 + 20)
          
          // Breathing effect
          const scale = 0.9 + 0.1 * Math.sin(frame * 0.1)
          ctx.save()
          ctx.translate(canvas.width / 2, canvas.height / 2 + 80)
          ctx.scale(scale, scale)
          ctx.fillStyle = '#22c55e'
          ctx.beginPath()
          ctx.arc(0, 0, 20, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
          
          frame++
          requestAnimationFrame(animate)
        }
        animate()
        
        const stream = canvas.captureStream(30)
        remoteVideoRef.current.srcObject = stream
      }
    }
  }

  // Toggle video
  const toggleVideo = () => {
    setCallState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }))
    
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      const videoTracks = stream.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = !callState.isVideoEnabled
      })
    }
  }

  // Toggle audio
  const toggleAudio = () => {
    setCallState(prev => ({ ...prev, isAudioEnabled: !prev.isAudioEnabled }))
    
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      const audioTracks = stream.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = !callState.isAudioEnabled
      })
    }
  }

  // Start/stop recording
  const toggleRecording = async () => {
    if (!callState.isRecording) {
      try {
        if (localVideoRef.current?.srcObject) {
          const stream = localVideoRef.current.srcObject as MediaStream
          const mediaRecorder = new MediaRecorder(stream)
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data)
            }
          }
          
          mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
            const url = URL.createObjectURL(blob)
            
            // Save recording reference
            const recording = {
              sessionId,
              patientId,
              timestamp: new Date().toISOString(),
              duration: callState.recordingDuration,
              url,
              size: blob.size
            }
            
            toast.success('Session recording saved successfully')
            recordedChunksRef.current = []
          }
          
          mediaRecorderRef.current = mediaRecorder
          mediaRecorder.start()
          
          setCallState(prev => ({ 
            ...prev, 
            isRecording: true,
            recordingDuration: 0
          }))
          
          toast.success('Recording started')
        }
      } catch (error) {
        toast.error('Failed to start recording')
        console.error('Recording error:', error)
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
        mediaRecorderRef.current = null
      }
      
      setCallState(prev => ({ ...prev, isRecording: false }))
      toast.success('Recording stopped')
    }
  }

  // End call
  const endCall = () => {
    // Stop all media tracks
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    
    // Stop recording if active
    if (callState.isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    
    setCallState({
      isConnected: false,
      isVideoEnabled: true,
      isAudioEnabled: true,
      isRecording: false,
      connectionQuality: 'disconnected',
      duration: 0,
      recordingDuration: 0
    })
    
    setPatient(prev => ({
      ...prev,
      isOnline: false,
      connectionStatus: 'disconnected'
    }))
    
    toast.success('Call ended')
    onEndCall?.()
  }

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Generate AI insights during call
  const generateInsights = async () => {
      // ###desabilitado_mvp### const prompt = "Template desabilitado para MVP"
    
    try {
      // ###desabilitado_mvp### const response = await spark.llm(prompt)
      const newInsight = {
        id: `insight-${Date.now()}`,
        timestamp: new Date().toISOString(),
        content: "###desabilitado_mvp### AI insights disabled for MVP",
        type: 'live-session'
      }
      
      setAiInsights([...aiInsights, newInsight] as any)
      toast.success('AI insights updated')
    } catch (error) {
      toast.error('Failed to generate insights')
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-semibold flex items-center gap-2">
                {patientName}
                {testMode && (
                  <Badge variant="secondary" className="text-xs">
                    TEST MODE
                  </Badge>
                )}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(callState.duration)}</span>
                {testScenario && (
                  <>
                    <span>•</span>
                    <span>{testScenario}</span>
                  </>
                )}
                {callState.isRecording && (
                  <>
                    <Circle className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">{formatTime(callState.recordingDuration)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={patient.connectionStatus === 'connected' ? 'default' : 'secondary'}>
              {patient.connectionStatus}
            </Badge>
            <Badge variant={
              callState.connectionQuality === 'excellent' ? 'default' :
              callState.connectionQuality === 'good' ? 'secondary' : 'destructive'
            }>
              {callState.connectionQuality}
            </Badge>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 bg-black relative">
        <div className="grid h-full" style={{ gridTemplateColumns: callState.isConnected ? '1fr 1fr' : '1fr' }}>
          {/* Patient Video */}
          {callState.isConnected && (
            <div className="relative bg-gray-900">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-black/50 text-white">
                  {patientName}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                {patient.hasVideo && <Video className="h-5 w-5 text-white" />}
                {patient.hasAudio && <Mic className="h-5 w-5 text-white" />}
              </div>
            </div>
          )}
          
          {/* Therapist Video */}
          <div className="relative bg-gray-800">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-black/50 text-white">
                Dr. Smith (You)
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              {callState.isVideoEnabled && <Video className="h-5 w-5 text-white" />}
              {callState.isAudioEnabled && <Mic className="h-5 w-5 text-white" />}
            </div>
          </div>
        </div>

        {/* Connection Status Overlay */}
        {!callState.isConnected && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <Card className="w-96">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Users className="h-5 w-5" />
                  Video Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-medium">{patientName}</p>
                  <p className="text-sm text-muted-foreground">Ready to start session</p>
                </div>
                
                <Button onClick={initializeCall} className="w-full" size="lg">
                  <Video className="h-4 w-4 mr-2" />
                  Start Video Call
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-card border-t p-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={callState.isAudioEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            disabled={!callState.isConnected}
          >
            {callState.isAudioEnabled ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant={callState.isVideoEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            disabled={!callState.isConnected}
          >
            {callState.isVideoEnabled ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant={callState.isRecording ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleRecording}
            disabled={!callState.isConnected}
          >
            {callState.isRecording ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowNotes(!showNotes)}
            disabled={!callState.isConnected}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={generateInsights}
            disabled={!callState.isConnected}
          >
            <Brain className="h-5 w-5" />
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={endCall}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Session Notes Sidebar */}
      {showNotes && callState.isConnected && (
        <div className="absolute right-0 top-0 h-full w-80 bg-card border-l shadow-lg">
          <div className="p-4 h-full flex flex-col">
            <h3 className="font-semibold mb-4">Session Notes</h3>
            
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Add session notes..."
              className="flex-1 w-full p-3 border rounded-md resize-none"
            />
            
            {aiInsights.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">AI Insights</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {aiInsights.map((insight: any) => (
                    <div key={insight.id} className="text-xs p-2 bg-muted rounded">
                      {insight.content}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}