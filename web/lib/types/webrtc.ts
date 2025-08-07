export interface RecordingSession {
  id: string
  patientId: string
  patientName: string
  therapistId: string
  startTime: Date
  endTime: Date | null
  duration: number
  status: 'recording' | 'paused' | 'completed' | 'failed'
  recordingData: {
    blob: Blob
    url: string
    size: number
  } | null
  aiInsights: {
    sentiment: string
    keyTopics: string[]
    recommendations: string[]
    confidence: number
  } | null
  metadata: {
    videoQuality: string
    audioQuality: string
    fileSize: number
    [key: string]: any
  }
}

export interface VideoCallSession {
  id: string
  patientId: string
  patientName: string
  therapistId: string
  startTime: Date
  endTime: Date | null
  status: 'waiting' | 'connecting' | 'active' | 'ended' | 'failed'
  participants: {
    therapist: {
      id: string
      name: string
      connected: boolean
      videoEnabled: boolean
      audioEnabled: boolean
    }
    patient: {
      id: string
      name: string
      connected: boolean
      videoEnabled: boolean
      audioEnabled: boolean
    }
  }
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor'
  metadata: {
    duration: number
    recordingEnabled: boolean
    sessionNotes: string
    [key: string]: any
  }
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[]
  videoConstraints: MediaTrackConstraints
  audioConstraints: MediaTrackConstraints
  recordingOptions: {
    mimeType: string
    videoBitsPerSecond?: number
    audioBitsPerSecond?: number
  }
}
