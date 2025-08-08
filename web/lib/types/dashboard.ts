export interface Patient {
  id: string;
  name: string;
  email: string;
  assignedTherapistId: string;
  joinedAt: string;
  status: "active" | "inactive" | "paused";
}

export interface PatientMediaEntry {
  id: string;
  patientId: string;
  patientName: string;
  videoUrl: string;
  mediaType: "audio" | "video";
  transcription: string;
  sentiment: {
    label: "POSITIVO" | "NEUTRO" | "NEGATIVO";
    confidence: number;
    summary: string;
    score: number; // -1 to 1 for chart visualization
  };
  createdAt: string;
  duration?: number; // in seconds
  fileSize?: number; // in bytes
}

export interface SentimentDataPoint {
  date: string;
  score: number;
  label: "POSITIVO" | "NEUTRO" | "NEGATIVO";
  confidence: number;
}

export interface TherapistDashboardData {
  patients: Patient[];
  selectedPatientId?: string;
  mediaEntries: PatientMediaEntry[];
  sentimentTrend: SentimentDataPoint[];
  alerts: ClinicalAlert[];
}

export interface ClinicalAlert {
  id: string;
  patientId: string;
  patientName: string;
  type: "negative_trend" | "consecutive_negative" | "sudden_drop";
  severity: "low" | "medium" | "high";
  message: string;
  triggeredAt: string;
  acknowledged: boolean;
}

export interface MediaPlayerState {
  isOpen: boolean;
  currentMedia?: PatientMediaEntry;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export interface TranscriptionModalState {
  isOpen: boolean;
  transcription?: string;
  mediaEntry?: PatientMediaEntry;
}
