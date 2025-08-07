'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { RecordingSession } from '@/lib/types/webrtc'

export interface UseWebRTCRecordingReturn {
  isRecording: boolean
  isProcessing: boolean
  currentSession: RecordingSession | null
  error: string | null
  startRecording: (sessionData: Partial<RecordingSession>) => Promise<void>
  stopRecording: () => Promise<void>
  pauseRecording: () => void
  resumeRecording: () => void
  resetSession: () => void
}

export function useWebRTCRecording(): UseWebRTCRecordingReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentSession, setCurrentSession] = useState<RecordingSession | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async (sessionData: Partial<RecordingSession>) => {
    try {
      setError(null)
      setIsProcessing(true)

      // Request media access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: { echoCancellation: true, noiseSuppression: true }
      })

      streamRef.current = stream
      chunksRef.current = []

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      })

      mediaRecorderRef.current = mediaRecorder

      // Create session
      const session: RecordingSession = {
        id: sessionData.id || `session-${Date.now()}`,
        patientId: sessionData.patientId || '',
        patientName: sessionData.patientName || '',
        therapistId: sessionData.therapistId || 'current-therapist',
        startTime: new Date(),
        endTime: null,
        duration: 0,
        status: 'recording',
        recordingData: null,
        aiInsights: null,
        metadata: {
          videoQuality: '720p',
          audioQuality: 'high',
          fileSize: 0,
          ...sessionData.metadata
        }
      }

      setCurrentSession(session)

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        
        setCurrentSession((prev: RecordingSession | null) => prev ? {
          ...prev,
          status: 'completed' as const,
          endTime: new Date(),
          duration: Date.now() - prev.startTime.getTime(),
          recordingData: {
            blob,
            url,
            size: blob.size
          }
        } : null)

        // Simulate AI processing
        setTimeout(() => {
          setCurrentSession((prev: RecordingSession | null) => prev ? {
            ...prev,
            aiInsights: {
              sentiment: 'positive',
              keyTopics: ['anxiety management', 'coping strategies'],
              recommendations: ['Continue mindfulness exercises', 'Schedule follow-up'],
              confidence: 0.85
            }
          } : null)
          setIsProcessing(false)
        }, 2000)
      }

      // Start recording
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setIsProcessing(false)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording')
      setIsProcessing(false)
    }
  }, [])

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsProcessing(true)
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      }
    }
  }, [isRecording])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause()
      setCurrentSession((prev: RecordingSession | null) => prev ? { ...prev, status: 'paused' as const } : null)
    }
  }, [isRecording])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && currentSession?.status === 'paused') {
      mediaRecorderRef.current.resume()
      setCurrentSession((prev: RecordingSession | null) => prev ? { ...prev, status: 'recording' as const } : null)
    }
  }, [currentSession?.status])

  const resetSession = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
    }
    setCurrentSession(null)
    setIsRecording(false)
    setIsProcessing(false)
    setError(null)
    chunksRef.current = []
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      }
    }
  }, [])

  return {
    isRecording,
    isProcessing,
    currentSession,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetSession
  }
}
