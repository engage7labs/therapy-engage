'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useWebRTCRecording } from '@/hooks/use-webrtc-recording'
import { RecordingSession } from '@/lib/types/webrtc'
import {
  Play,
  Pause,
  Square,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Download,
  Brain,
  Clock,
  FileText,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface WebRTCSessionRecorderProps {
  sessionId: string
  patientName: string
  patientId: string
  onSessionComplete: (session: RecordingSession) => void
  onSessionEnd: () => void
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
    isRecording,
    isProcessing,
    currentSession,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetSession
  } = useWebRTCRecording()

  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [recordingTime, setRecordingTime] = useState(0)

  // Update recording time
  useEffect(() => {
    let interval: number | null = null
    
    if (isRecording && currentSession) {
      interval = window.setInterval(() => {
        const elapsed = Date.now() - currentSession.startTime.getTime()
        setRecordingTime(Math.floor(elapsed / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording, currentSession])

  // Handle session completion
  useEffect(() => {
    if (currentSession?.status === 'completed' && currentSession.aiInsights) {
      onSessionComplete(currentSession)
      toast.success('Session recorded successfully!')
    }
  }, [currentSession, onSessionComplete])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(`Recording error: ${error}`)
    }
  }, [error])

  const handleStartRecording = async () => {
    try {
      await startRecording({
        id: sessionId,
        patientId,
        patientName,
        therapistId: 'current-therapist',
        metadata: {
          videoQuality: '720p',
          audioQuality: 'high',
          fileSize: 0,
          sessionType: 'therapy'
        }
      })
    } catch (err) {
      toast.error('Failed to start recording')
    }
  }

  const handleStopRecording = async () => {
    await stopRecording()
  }

  const handlePause = () => {
    if (currentSession?.status === 'recording') {
      pauseRecording()
      toast.info('Recording paused')
    } else if (currentSession?.status === 'paused') {
      resumeRecording()
      toast.info('Recording resumed')
    }
  }

  const handleEndSession = () => {
    resetSession()
    onSessionEnd()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(mins)}:${pad(secs)}`
  }

  const downloadRecording = () => {
    if (currentSession?.recordingData?.url) {
      const a = document.createElement('a')
      a.href = currentSession.recordingData.url
      a.download = `session-${sessionId}-${patientName.replace(/\s+/g, '-')}.webm`
      a.click()
      toast.success('Download started')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Session Recording</h2>
          <p className="text-muted-foreground">
            Recording session with {patientName}
          </p>
        </div>
        <Button variant="outline" onClick={handleEndSession}>
          End Session
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Video Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Preview
              {demoMode && <Badge variant="secondary">Demo Mode</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-black rounded-lg aspect-video mb-4">
              {demoMode ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">Demo Video Preview</p>
                  </div>
                </div>
              ) : (
                <video
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              
              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium">REC</span>
                </div>
              )}

              {/* Recording time */}
              {(isRecording || currentSession) && (
                <div className="absolute top-4 right-4 bg-black/75 text-white px-3 py-1 rounded-full">
                  <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant={videoEnabled ? "default" : "destructive"}
                size="sm"
                onClick={() => setVideoEnabled(!videoEnabled)}
              >
                {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={audioEnabled ? "default" : "destructive"}
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recording Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recording Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Session Status */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Session Status</span>
                <Badge variant={
                  currentSession?.status === 'recording' ? 'default' :
                  currentSession?.status === 'paused' ? 'secondary' :
                  currentSession?.status === 'completed' ? 'default' : 'outline'
                }>
                  {currentSession?.status || 'Not Started'}
                </Badge>
              </div>
              {currentSession && (
                <div className="text-sm text-muted-foreground">
                  Started: {currentSession.startTime.toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Main Controls */}
            <div className="flex gap-2">
              {!isRecording && !currentSession ? (
                <Button 
                  onClick={handleStartRecording}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handlePause}
                    disabled={isProcessing}
                  >
                    {currentSession?.status === 'paused' ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <Pause className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleStopRecording}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop Recording
                  </Button>
                </>
              )}
            </div>

            {/* Processing Status */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="h-4 w-4 animate-spin" />
                  Processing recording...
                </div>
                <Progress value={33} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Session Results */}
      {currentSession?.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Session Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recording Info */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Duration</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatTime(Math.floor((currentSession.duration || 0) / 1000))}
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="font-medium">File Size</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {((currentSession.recordingData?.size || 0) / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Video className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Quality</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentSession.metadata?.videoQuality || 'HD'}
                </p>
              </div>
            </div>

            {/* AI Insights */}
            {currentSession.aiInsights && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  AI Insights
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Sentiment: </span>
                    <Badge variant="secondary">{currentSession.aiInsights.sentiment}</Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Key Topics: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentSession.aiInsights.keyTopics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Recommendations: </span>
                    <ul className="text-sm text-muted-foreground mt-1 ml-4">
                      {currentSession.aiInsights.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={downloadRecording}>
                <Download className="h-4 w-4 mr-2" />
                Download Recording
              </Button>
              <Button variant="outline" onClick={() => onSessionComplete(currentSession)}>
                View Full Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
