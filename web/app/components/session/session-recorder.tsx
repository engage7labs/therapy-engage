import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  Shield
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SessionRecorderProps {
  sessionId: string
  patientName: string
  onSessionEnd?: (sessionData: any) => void
}

export function SessionRecorder({ sessionId, patientName, onSessionEnd }: SessionRecorderProps) {
  // Session state management
  const [sessionState, setSessionState] = useKV(`session-${sessionId}`, {
    id: sessionId,
    patientName,
    status: 'not-started',
    startTime: null,
    endTime: null,
    duration: 0,
    recordingEnabled: false,
    transcriptionStatus: 'pending',
    aiAnalysisStatus: 'pending'
  })

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [transcriptionProgress, setTranscriptionProgress] = useState(0)
  const [aiAnalysisProgress, setAiAnalysisProgress] = useState(0)
  const [demoMode, setDemoMode] = useState(false)

  // Media stream refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize media stream
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [])

  const initializeMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled ? { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false,
        audio: audioEnabled ? {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } : false
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      toast.success('Camera and microphone initialized')
      return stream
    } catch (error) {
      console.error('Error accessing media devices:', error)
      toast.error('Failed to access camera/microphone. Please check permissions.')
      throw error
    }
  }

  const startSession = async () => {
    try {
      const stream = await initializeMediaStream()
      
      setSessionState(prev => ({
        ...prev,
        status: 'active',
        startTime: new Date().toISOString(),
        recordingEnabled: true
      }))

      toast.success(`Session started for ${patientName}`)
    } catch (error) {
      toast.error('Failed to start session')
    }
  }

  const startDemoSession = () => {
    setDemoMode(true)
    setSessionState(prev => ({
      ...prev,
      status: 'active',
      startTime: new Date().toISOString(),
      recordingEnabled: true
    }))
    
    toast.success(`Demo session started for ${patientName}`)
  }

  const startRecording = async () => {
    if (!demoMode && !streamRef.current) {
      toast.error('Media stream not available')
      return
    }

    try {
      if (demoMode) {
        // Demo mode simulation
        setIsRecording(true)
        recordingIntervalRef.current = setInterval(() => {
          setRecordingDuration(prev => prev + 1)
        }, 1000)
        
        toast.success('Demo recording started')
        return
      }

      const mediaRecorder = new MediaRecorder(streamRef.current!, {
        mimeType: 'video/webm;codecs=vp9,opus'
      })

      const recordedChunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' })
        await processRecording(blob)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(1000) // Capture data every second
      setIsRecording(true)

      // Start recording duration timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)

      toast.success('Recording started')
    } catch (error) {
      console.error('Recording error:', error)
      toast.error('Failed to start recording')
    }
  }

  const stopRecording = () => {
    if ((mediaRecorderRef.current && isRecording) || (demoMode && isRecording)) {
      if (!demoMode && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }

      if (demoMode) {
        // Immediately start processing for demo
        processRecording(new Blob())
      }

      toast.success('Recording stopped - processing...')
    }
  }

  const endSession = () => {
    if (isRecording) {
      stopRecording()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }

    const endTime = new Date().toISOString()
    const finalSessionData = {
      ...sessionState,
      status: 'completed',
      endTime,
      duration: recordingDuration
    }

    setSessionState(finalSessionData)
    
    if (onSessionEnd) {
      onSessionEnd(finalSessionData)
    }

    toast.success('Session ended successfully')
  }

  const processRecording = async (recordingBlob: Blob) => {
    try {
      // Simulate transcription process
      setTranscriptionProgress(0)
      setSessionState(prev => ({ ...prev, transcriptionStatus: 'processing' }))

      if (demoMode) {
        // Faster demo processing
        const transcriptionInterval = setInterval(() => {
          setTranscriptionProgress(prev => {
            if (prev >= 100) {
              clearInterval(transcriptionInterval)
              startAIAnalysis()
              return 100
            }
            return prev + 25 // Faster for demo
          })
        }, 200)
      } else {
        // Mock transcription progress
        const transcriptionInterval = setInterval(() => {
          setTranscriptionProgress(prev => {
            if (prev >= 100) {
              clearInterval(transcriptionInterval)
              startAIAnalysis()
              return 100
            }
            return prev + 10
          })
        }, 500)
      }

    } catch (error) {
      console.error('Processing error:', error)
      toast.error('Failed to process recording')
    }
  }

  const startAIAnalysis = async () => {
    try {
      setAiAnalysisProgress(0)
      setSessionState(prev => ({ 
        ...prev, 
        transcriptionStatus: 'completed',
        aiAnalysisStatus: 'processing' 
      }))

      // Simulate AI analysis with GPT-4o
      const prompt = spark.llmPrompt`
        Analyze this therapy session transcript for clinical insights:
        
        Patient: ${patientName}
        Session Duration: ${Math.floor(recordingDuration / 60)} minutes
        
        Generate professional clinical insights including:
        1. Key therapeutic themes discussed
        2. Patient engagement level and emotional state
        3. Progress indicators or concerning patterns
        4. Recommended follow-up actions
        5. Risk assessment (low/moderate/high)
        
        Format as structured clinical documentation suitable for licensed mental health professionals.
      `

      if (demoMode) {
        // Faster demo AI analysis
        const analysisInterval = setInterval(async () => {
          setAiAnalysisProgress(prev => {
            if (prev >= 100) {
              clearInterval(analysisInterval)
              completeAIAnalysis()
              return 100
            }
            return prev + 20 // Faster for demo
          })
        }, 150)
      } else {
        // Mock AI analysis progress
        const analysisInterval = setInterval(async () => {
          setAiAnalysisProgress(prev => {
            if (prev >= 100) {
              clearInterval(analysisInterval)
              completeAIAnalysis()
              return 100
            }
            return prev + 8
          })
        }, 400)
      }

    } catch (error) {
      console.error('AI analysis error:', error)
      toast.error('Failed to generate AI insights')
    }
  }

  const completeAIAnalysis = async () => {
    try {
      if (demoMode) {
        // Use sample data for demo
        const sampleInsights = {
          keyThemes: [
            "Anxiety management progress",
            "Workplace confidence building",
            "Sleep quality improvement",
            "Behavioral activation success"
          ],
          emotionalState: {
            baseline: "Anxious but motivated",
            progression: "Increasingly confident throughout session",
            riskLevel: "Low"
          },
          therapeuticGoals: [
            "Continue breathing exercise practice",
            "Expand presentation opportunities", 
            "Maintain sleep hygiene improvements",
            "Introduce cognitive restructuring for remaining anxious thoughts"
          ],
          clinicalRecommendations: [
            "Schedule follow-up in 2 weeks to maintain momentum",
            "Assign homework: Practice presentation skills with trusted friend",
            "Consider introducing exposure therapy for larger speaking opportunities",
            "Monitor sleep patterns with simple tracking"
          ],
          riskAssessment: {
            level: "Low",
            factors: "No concerning indicators. Patient shows excellent engagement and progress.",
            followUpNeeded: false
          },
          progressMarkers: [
            "Voluntary presentation participation (breakthrough behavior)",
            "Consistent use of coping strategies",
            "Improved sleep quality", 
            "Increased self-efficacy in workplace situations"
          ]
        }
        
        setSessionState(prev => ({ 
          ...prev, 
          aiAnalysisStatus: 'completed',
          aiInsights: sampleInsights
        }))
        
        toast.success('Demo AI analysis completed')
        return
      }

      const aiInsights = await spark.llm(
        spark.llmPrompt`Generate clinical session insights for ${patientName} therapy session`,
        'gpt-4o',
        true
      )

      setSessionState(prev => ({ 
        ...prev, 
        aiAnalysisStatus: 'completed',
        aiInsights: JSON.parse(aiInsights)
      }))

      toast.success('AI analysis completed - insights generated')
    } catch (error) {
      console.error('AI completion error:', error)
      setSessionState(prev => ({ ...prev, aiAnalysisStatus: 'failed' }))
    }
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled
        setVideoEnabled(!videoEnabled)
      }
    }
  }

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled
        setAudioEnabled(!audioEnabled)
      }
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Secure Therapy Session
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Patient: {patientName} • Session ID: {sessionId}
              </p>
            </div>
            <Badge 
              variant={sessionState.status === 'active' ? 'default' : 'secondary'}
              className="clinical-data"
            >
              {sessionState.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Video Display */}
      <Card>
        <CardContent className="p-6">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
              style={{ display: videoEnabled && !demoMode ? 'block' : 'none' }}
            />
            {(!videoEnabled || demoMode) && (
              <div className="flex items-center justify-center h-full bg-muted">
                {demoMode ? (
                  <div className="text-center">
                    <Video className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium text-primary">Demo Session Active</p>
                    <p className="text-sm text-muted-foreground">Simulating therapy session recording</p>
                  </div>
                ) : (
                  <VideoSlash className="h-16 w-16 text-muted-foreground" />
                )}
              </div>
            )}
            
            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">REC {formatDuration(recordingDuration)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4">
            {sessionState.status === 'not-started' && (
              <>
                <Button onClick={startSession} size="lg" className="min-w-32">
                  <Play className="h-4 w-4 mr-2" />
                  Start Real Session
                </Button>
                <Button onClick={startDemoSession} variant="outline" size="lg" className="min-w-32">
                  <Play className="h-4 w-4 mr-2" />
                  Start Demo Session
                </Button>
              </>
            )}

            {sessionState.status === 'active' && (
              <>
                {!demoMode && (
                  <>
                    <Button
                      variant={videoEnabled ? 'default' : 'destructive'}
                      size="lg"
                      onClick={toggleVideo}
                    >
                      {videoEnabled ? <Video className="h-4 w-4" /> : <VideoSlash className="h-4 w-4" />}
                    </Button>

                    <Button
                      variant={audioEnabled ? 'default' : 'destructive'}
                      size="lg"
                      onClick={toggleAudio}
                    >
                      {audioEnabled ? <Microphone className="h-4 w-4" /> : <MicrophoneSlash className="h-4 w-4" />}
                    </Button>
                  </>
                )}

                {!isRecording ? (
                  <Button onClick={startRecording} size="lg" className="min-w-32">
                    <Play className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="destructive" size="lg" className="min-w-32">
                    <Square className="h-4 w-4 mr-2" />
                    Stop Recording
                  </Button>
                )}

                <Button onClick={endSession} variant="outline" size="lg">
                  End Session
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {(sessionState.transcriptionStatus === 'processing' || sessionState.aiAnalysisStatus === 'processing') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Post-Session Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Transcription Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">Transcription</span>
                </div>
                <Badge variant={sessionState.transcriptionStatus === 'completed' ? 'default' : 'secondary'}>
                  {sessionState.transcriptionStatus}
                </Badge>
              </div>
              <Progress value={transcriptionProgress} className="h-2" />
            </div>

            {/* AI Analysis Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Clinical Analysis</span>
                </div>
                <Badge variant={sessionState.aiAnalysisStatus === 'completed' ? 'default' : 'secondary'}>
                  {sessionState.aiAnalysisStatus}
                </Badge>
              </div>
              <Progress value={aiAnalysisProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}