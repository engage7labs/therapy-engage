'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { VideoCallSession } from '@/lib/types/webrtc'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Share2,
  MessageSquare,
  Settings,
  Users,
  Clock,
  Signal,
  Record,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX
} from 'lucide-react'
import { toast } from 'sonner'

interface VideoCallInterfaceProps {
  sessionId: string
  patientName: string
  patientId: string
  onEndCall: () => void
  testMode?: boolean
  testScenario?: 'normal' | 'connection-issues' | 'patient-late' | 'emergency'
}

type CallStatus = 'waiting' | 'connecting' | 'active' | 'ended' | 'failed'

export function VideoCallInterface({
  sessionId,
  patientName,
  patientId,
  onEndCall,
  testMode = false,
  testScenario = 'normal'
}: VideoCallInterfaceProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>('waiting')
  const [duration, setDuration] = useState(0)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [speakerEnabled, setSpeakerEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<number | null>(null)

  // Initialize call based on test scenario
  useEffect(() => {
    if (testMode) {
      const initCall = () => {
        switch (testScenario) {
          case 'normal':
            setTimeout(() => setCallStatus('connecting'), 1000)
            setTimeout(() => setCallStatus('active'), 3000)
            break
          case 'connection-issues':
            setTimeout(() => setCallStatus('connecting'), 1000)
            setTimeout(() => setConnectionQuality('poor'), 4000)
            setTimeout(() => setCallStatus('active'), 5000)
            break
          case 'patient-late':
            setTimeout(() => {
              toast.info('Patient is running late')
            }, 5000)
            break
          case 'emergency':
            setTimeout(() => setCallStatus('connecting'), 500)
            setTimeout(() => setCallStatus('active'), 1500)
            break
          default:
            setTimeout(() => setCallStatus('active'), 2000)
        }
      }
      initCall()
    }
  }, [testMode, testScenario])

  // Duration counter
  useEffect(() => {
    let interval: number | null = null
    
    if (callStatus === 'active') {
      interval = window.setInterval(() => {
        setDuration((prev: number) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [callStatus])

  // Auto-hide controls
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      
      setShowControls(true)
      
      if (callStatus === 'active') {
        controlsTimeoutRef.current = window.setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }

    resetControlsTimeout()

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [callStatus])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(mins)}:${pad(secs)}`
  }

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled)
    toast.info(videoEnabled ? 'Camera turned off' : 'Camera turned on')
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    toast.info(audioEnabled ? 'Microphone muted' : 'Microphone unmuted')
  }

  const toggleSpeaker = () => {
    setSpeakerEnabled(!speakerEnabled)
    toast.info(speakerEnabled ? 'Speaker muted' : 'Speaker unmuted')
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    toast.info(isRecording ? 'Recording stopped' : 'Recording started')
  }

  const endCall = () => {
    setCallStatus('ended')
    toast.success('Call ended')
    setTimeout(onEndCall, 1000)
  }

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'fair': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // Waiting for patient
  if (callStatus === 'waiting') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Users className="h-5 w-5" />
            Waiting for {patientName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-muted-foreground">
              Session ID: {sessionId}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              The patient will join shortly
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={toggleVideo}>
              {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={toggleAudio}>
              {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            <Button variant="destructive" onClick={endCall}>
              <PhoneOff className="h-4 w-4 mr-2" />
              Cancel Call
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Connecting state
  if (callStatus === 'connecting') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Phone className="h-5 w-5 animate-pulse" />
            Connecting to {patientName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Establishing secure connection...
            </p>
          </div>

          <div className="flex justify-center">
            <Button variant="destructive" onClick={endCall}>
              <PhoneOff className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Active call
  if (callStatus === 'active') {
    return (
      <div 
        className={`relative w-full h-screen bg-black overflow-hidden ${
          isFullscreen ? 'fixed inset-0 z-50' : 'rounded-lg'
        }`}
        onMouseMove={() => setShowControls(true)}
      >
        {/* Remote video (main) */}
        <div className="relative w-full h-full">
          {testMode ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-75" />
                <h3 className="text-xl font-semibold mb-2">{patientName}</h3>
                <p className="text-sm opacity-75">Demo Video Call</p>
              </div>
            </div>
          ) : (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Connection quality indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-full">
            <Signal className={`h-4 w-4 ${getConnectionColor()}`} />
            <span className="text-xs capitalize">{connectionQuality}</span>
          </div>

          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-xs">REC</span>
            </div>
          )}

          {/* Duration */}
          <div className="absolute top-4 right-20 bg-black/50 text-white px-3 py-1 rounded-full">
            <span className="text-xs font-mono">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Local video (picture-in-picture) */}
        <div className="absolute bottom-20 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-white/20">
          {testMode ? (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <Video className="h-8 w-8 text-white opacity-50" />
            </div>
          ) : (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Controls overlay */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center justify-between">
              {/* Patient info */}
              <div className="text-white">
                <h3 className="font-semibold">{patientName}</h3>
                <p className="text-sm opacity-75">Patient ID: {patientId}</p>
              </div>

              {/* Control buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant={audioEnabled ? "default" : "destructive"}
                  size="lg"
                  onClick={toggleAudio}
                  className="rounded-full w-12 h-12 p-0"
                >
                  {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant={videoEnabled ? "default" : "destructive"}
                  size="lg"
                  onClick={toggleVideo}
                  className="rounded-full w-12 h-12 p-0"
                >
                  {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant={speakerEnabled ? "default" : "secondary"}
                  size="lg"
                  onClick={toggleSpeaker}
                  className="rounded-full w-12 h-12 p-0"
                >
                  {speakerEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>

                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="lg"
                  onClick={toggleRecording}
                  className="rounded-full w-12 h-12 p-0"
                >
                  <Record className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full w-12 h-12 p-0"
                >
                  <Share2 className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full w-12 h-12 p-0"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="rounded-full w-12 h-12 p-0"
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={endCall}
                  className="rounded-full w-12 h-12 p-0"
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Call ended
  if (callStatus === 'ended') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <PhoneOff className="h-5 w-5" />
            Call Ended
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Call with {patientName} has ended
            </p>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{formatDuration(duration)}</span>
              </div>
              <div className="flex justify-between">
                <span>Quality:</span>
                <Badge variant="secondary">{connectionQuality}</Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={onEndCall}>
              Return to Dashboard
            </Button>
            <Button variant="outline">
              Save Notes
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
