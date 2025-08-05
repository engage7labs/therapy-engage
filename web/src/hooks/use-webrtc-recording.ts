import { useState, useRef, useCallback, useEffect } from 'react'
import { useKV } from '../hooks/use-kv'
import { toast } from 'sonner'

export interface RecordingSession {
  id: string
  patientName: string
  startTime: string
  endTime?: string
  duration: number
  status: 'preparing' | 'active' | 'paused' | 'stopped' | 'processing' | 'completed' | 'error'
  videoEnabled: boolean
  audioEnabled: boolean
  recordingData?: Blob
  transcription?: string
  aiInsights?: any
  metadata: {
    videoQuality: string
    audioQuality: string
    fileSize?: number
    mimeType: string
  }
}

export interface WebRTCRecordingHook {
  // Session state
  session: RecordingSession | null
  isRecording: boolean
  isPaused: boolean
  duration: number
  
  // Media state
  videoEnabled: boolean
  audioEnabled: boolean
  videoStream: MediaStream | null
  audioStream: MediaStream | null
  
  // Recording controls
  initializeSession: (sessionId: string, patientName: string) => Promise<void>
  startRecording: () => Promise<void>
  pauseRecording: () => void
  resumeRecording: () => void
  stopRecording: () => Promise<void>
  endSession: () => Promise<RecordingSession | null>
  
  // Media controls
  toggleVideo: () => void
  toggleAudio: () => void
  switchCamera: () => Promise<void>
  
  // Processing
  processRecording: () => Promise<void>
  
  // Error state
  error: string | null
  clearError: () => void
}

export function useWebRTCRecording(): WebRTCRecordingHook {
  // Session state
  const [session, setSession] = useState<RecordingSession | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  // Media state
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [currentCamera, setCurrentCamera] = useState<'user' | 'environment'>('user')
  
  // Persistent storage for completed sessions
  const [completedSessions, setCompletedSessions] = useKV('completed-sessions', [])
  
  // Refs for media handling
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const combinedStreamRef = useRef<MediaStream | null>(null)
  
  // Cleanup function
  const cleanup = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }
    
    if (combinedStreamRef.current) {
      combinedStreamRef.current.getTracks().forEach(track => track.stop())
      combinedStreamRef.current = null
    }
    
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop())
      setVideoStream(null)
    }
    
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop())
      setAudioStream(null)
    }
    
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      mediaRecorderRef.current = null
    }
    
    recordedChunksRef.current = []
  }, [videoStream, audioStream])
  
  // Initialize media devices
  const initializeMediaDevices = useCallback(async () => {
    try {
      setError(null)
      
      // Check for media device support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('WebRTC is not supported in this browser')
      }
      
      // Request permissions and initialize streams
      const constraints = {
        video: videoEnabled ? {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
          facingMode: currentCamera
        } : false,
        audio: audioEnabled ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: { ideal: 48000 },
          channelCount: { ideal: 2 }
        } : false
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      // Separate video and audio tracks
      const videoTracks = stream.getVideoTracks()
      const audioTracks = stream.getAudioTracks()
      
      if (videoTracks.length > 0 && videoEnabled) {
        const videoOnlyStream = new MediaStream([videoTracks[0]])
        setVideoStream(videoOnlyStream)
      }
      
      if (audioTracks.length > 0 && audioEnabled) {
        const audioOnlyStream = new MediaStream([audioTracks[0]])
        setAudioStream(audioOnlyStream)
      }
      
      // Create combined stream for recording
      combinedStreamRef.current = stream
      
      toast.success('Media devices initialized successfully')
      return stream
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access media devices'
      setError(errorMessage)
      toast.error(`Media error: ${errorMessage}`)
      throw err
    }
  }, [videoEnabled, audioEnabled, currentCamera])
  
  // Initialize session
  const initializeSession = useCallback(async (sessionId: string, patientName: string) => {
    try {
      cleanup() // Clean up any existing session
      
      const newSession: RecordingSession = {
        id: sessionId,
        patientName,
        startTime: new Date().toISOString(),
        duration: 0,
        status: 'preparing',
        videoEnabled,
        audioEnabled,
        metadata: {
          videoQuality: videoEnabled ? '720p' : 'disabled',
          audioQuality: audioEnabled ? '48kHz' : 'disabled',
          mimeType: 'video/webm;codecs=vp9,opus'
        }
      }
      
      setSession(newSession)
      setDuration(0)
      setIsRecording(false)
      setIsPaused(false)
      
      // Initialize media devices
      await initializeMediaDevices()
      
      setSession(prev => prev ? { ...prev, status: 'active' } : null)
      
      toast.success(`Session initialized for ${patientName}`)
      
    } catch (err) {
      setError('Failed to initialize session')
      setSession(prev => prev ? { ...prev, status: 'error' } : null)
      throw err
    }
  }, [videoEnabled, audioEnabled, initializeMediaDevices, cleanup])
  
  // Start recording
  const startRecording = useCallback(async () => {
    if (!combinedStreamRef.current || !session) {
      toast.error('No active session or media stream')
      return
    }
    
    try {
      // Check MediaRecorder support
      if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
        if (!MediaRecorder.isTypeSupported('video/webm')) {
          throw new Error('WebM recording not supported')
        }
      }
      
      const options = {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') 
          ? 'video/webm;codecs=vp9,opus'
          : 'video/webm',
        videoBitsPerSecond: 2500000, // 2.5 Mbps
        audioBitsPerSecond: 128000   // 128 kbps
      }
      
      const mediaRecorder = new MediaRecorder(combinedStreamRef.current, options)
      recordedChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        const recordingBlob = new Blob(recordedChunksRef.current, { 
          type: options.mimeType 
        })
        
        setSession(prev => prev ? {
          ...prev,
          recordingData: recordingBlob,
          metadata: {
            ...prev.metadata,
            fileSize: recordingBlob.size
          }
        } : null)
        
        await processRecording()
      }
      
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event)
        setError('Recording error occurred')
        toast.error('Recording failed')
      }
      
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(1000) // Collect data every second
      
      setIsRecording(true)
      setIsPaused(false)
      
      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1
          setSession(current => current ? { ...current, duration: newDuration } : null)
          return newDuration
        })
      }, 1000)
      
      toast.success('Recording started')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }, [session, processRecording])
  
  // Pause recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
      
      toast.info('Recording paused')
    }
  }, [isRecording, isPaused])
  
  // Resume recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      
      // Restart duration timer
      durationIntervalRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1
          setSession(current => current ? { ...current, duration: newDuration } : null)
          return newDuration
        })
      }, 1000)
      
      toast.info('Recording resumed')
    }
  }, [isRecording, isPaused])
  
  // Stop recording
  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
      
      setSession(prev => prev ? { ...prev, status: 'stopped' } : null)
      toast.success('Recording stopped - processing...')
    }
  }, [isRecording])
  
  // End session
  const endSession = useCallback(async () => {
    if (isRecording) {
      await stopRecording()
    }
    
    cleanup()
    
    const endTime = new Date().toISOString()
    const finalSession = session ? {
      ...session,
      endTime,
      status: 'completed' as const,
      duration
    } : null
    
    if (finalSession) {
      setSession(finalSession)
      
      // Save to completed sessions
      setCompletedSessions(prev => [...prev, finalSession])
      toast.success('Session completed and saved')
      
      return finalSession
    }
    
    return null
  }, [isRecording, stopRecording, cleanup, session, duration, setCompletedSessions])
  
  // Toggle video
  const toggleVideo = useCallback(() => {
    if (combinedStreamRef.current) {
      const videoTrack = combinedStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled
        setVideoEnabled(!videoEnabled)
        
        setSession(prev => prev ? { ...prev, videoEnabled: !videoEnabled } : null)
        toast.info(videoEnabled ? 'Video disabled' : 'Video enabled')
      }
    }
  }, [videoEnabled])
  
  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (combinedStreamRef.current) {
      const audioTrack = combinedStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled
        setAudioEnabled(!audioEnabled)
        
        setSession(prev => prev ? { ...prev, audioEnabled: !audioEnabled } : null)
        toast.info(audioEnabled ? 'Audio muted' : 'Audio enabled')
      }
    }
  }, [audioEnabled])
  
  // Switch camera
  const switchCamera = useCallback(async () => {
    try {
      const newFacing = currentCamera === 'user' ? 'environment' : 'user'
      setCurrentCamera(newFacing)
      
      // Re-initialize with new camera
      if (session) {
        await initializeMediaDevices()
        toast.success(`Switched to ${newFacing} camera`)
      }
    } catch (err) {
      toast.error('Failed to switch camera')
    }
  }, [currentCamera, session, initializeMediaDevices])
  
  // Process recording with AI
  const processRecording = useCallback(async () => {
    if (!session) return
    
    try {
      setSession(prev => prev ? { ...prev, status: 'processing' } : null)
      
      // Simulate transcription (in real implementation, this would call Dragon Copilot API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockTranscription = `
        Session transcript for ${session.patientName}
        Duration: ${Math.floor(duration / 60)} minutes
        
        [Therapist]: Good morning, how are you feeling today?
        [Patient]: I've been having some anxiety about the presentation at work...
        [Therapist]: Tell me more about what specifically is causing the anxiety...
        
        (Continued transcript would be generated by Dragon Copilot in production)
      `
      
      // Generate AI insights using GPT-4o
      const prompt = spark.llmPrompt`
        Analyze this therapy session transcript for clinical insights:
        
        Patient: ${session.patientName}
        Session Duration: ${Math.floor(duration / 60)} minutes
        Transcript: ${mockTranscription}
        
        Generate structured clinical insights including:
        1. Key therapeutic themes and topics discussed
        2. Patient's emotional state and engagement level
        3. Therapeutic progress indicators
        4. Risk assessment (low/moderate/high)
        5. Recommended interventions or follow-up actions
        6. Treatment plan adjustments if needed
        
        Format as JSON suitable for clinical documentation.
      `
      
      const aiInsights = await spark.llm(prompt, 'gpt-4o', true)
      
      setSession(prev => prev ? {
        ...prev,
        status: 'completed',
        transcription: mockTranscription,
        aiInsights: JSON.parse(aiInsights)
      } : null)
      
      toast.success('Session processing completed')
      
    } catch (err) {
      console.error('Processing error:', err)
      setSession(prev => prev ? { ...prev, status: 'error' } : null)
      toast.error('Failed to process session')
    }
  }, [session, duration])
  
  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])
  
  return {
    // Session state
    session,
    isRecording,
    isPaused,
    duration,
    
    // Media state
    videoEnabled,
    audioEnabled,
    videoStream,
    audioStream,
    
    // Recording controls
    initializeSession,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    endSession,
    
    // Media controls
    toggleVideo,
    toggleAudio,
    switchCamera,
    
    // Processing
    processRecording,
    
    // Error state
    error,
    clearError
  }
}