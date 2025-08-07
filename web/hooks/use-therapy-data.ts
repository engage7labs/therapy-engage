'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCache } from './use-cache'

export interface Patient {
  readonly id: string
  readonly name: string
  readonly age: number
  readonly diagnosis: string
  readonly nextSession: string
  readonly riskLevel: 'low' | 'medium' | 'high'
  readonly moodTrend: 'improving' | 'stable' | 'declining'
  readonly sessionsCompleted: number
  readonly totalSessions: number
  readonly phone: string
  readonly emergencyContact: string
  readonly consentForEmergencyContact: boolean
  readonly lastWhatsAppContact: string
}

export interface Session {
  readonly id: string
  readonly patientName: string
  readonly time: string
  readonly type: string
  readonly duration: number
  readonly status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
}

export interface Insight {
  readonly id: string
  readonly patientName: string
  readonly type: 'mood-improvement' | 'risk-alert' | 'session-milestone' | 'medication-reminder'
  readonly summary: string
  readonly confidence: number
  readonly timestamp: string
  readonly recommendation: string
}

// Mock data generators with realistic therapy platform data
const generateMockPatients = (): Patient[] => [
  {
    id: '1',
    name: 'Ana Silva',
    age: 28,
    diagnosis: 'Ansiedade Generalizada',
    nextSession: '2025-08-08T10:00:00',
    riskLevel: 'low',
    moodTrend: 'improving',
    sessionsCompleted: 8,
    totalSessions: 12,
    phone: '+55 11 98765-4321',
    emergencyContact: '+55 11 99999-1111',
    consentForEmergencyContact: true,
    lastWhatsAppContact: '2025-08-06T15:30:00'
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    age: 35,
    diagnosis: 'Depressão Moderada',
    nextSession: '2025-08-07T14:30:00',
    riskLevel: 'medium',
    moodTrend: 'stable',
    sessionsCompleted: 15,
    totalSessions: 20,
    phone: '+55 11 97654-3210',
    emergencyContact: '+55 11 88888-2222',
    consentForEmergencyContact: true,
    lastWhatsAppContact: '2025-08-05T09:15:00'
  },
  {
    id: '3',
    name: 'Beatriz Costa',
    age: 42,
    diagnosis: 'Síndrome do Pânico',
    nextSession: '2025-08-09T16:00:00',
    riskLevel: 'high',
    moodTrend: 'declining',
    sessionsCompleted: 6,
    totalSessions: 16,
    phone: '+55 11 96543-2109',
    emergencyContact: '+55 11 77777-3333',
    consentForEmergencyContact: false,
    lastWhatsAppContact: '2025-08-04T20:45:00'
  }
]

const generateMockSessions = (): Session[] => [
  {
    id: 'session-1',
    patientName: 'Ana Silva',
    time: '2025-08-07T10:00:00',
    type: 'Terapia Cognitivo-Comportamental',
    duration: 50,
    status: 'confirmed'
  },
  {
    id: 'session-2',
    patientName: 'Carlos Mendes',
    time: '2025-08-07T14:30:00',
    type: 'Sessão de Follow-up',
    duration: 30,
    status: 'pending'
  }
]

const generateMockInsights = (): Insight[] => [
  {
    id: 'insight-1',
    patientName: 'Ana Silva',
    type: 'mood-improvement',
    summary: 'Paciente demonstra melhora significativa nos últimos exercícios de respiração.',
    confidence: 0.85,
    timestamp: '2025-08-06T16:30:00',
    recommendation: 'Continuar com técnicas atuais e introduzir mindfulness.'
  },
  {
    id: 'insight-2',
    patientName: 'Beatriz Costa',
    type: 'risk-alert',
    summary: 'Aumento na frequência de ataques de pânico relatados.',
    confidence: 0.92,
    timestamp: '2025-08-06T12:15:00',
    recommendation: 'Agendar sessão de emergência e revisar plano de tratamento.'
  }
]

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { memoCache, getCache, setCache } = useCache()

  const fetchPatients = useCallback(async (): Promise<Patient[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return generateMockPatients()
  }, [])

  const loadPatients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await memoCache('patients', fetchPatients, 2 * 60 * 1000) // 2 minutes cache
      setPatients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pacientes')
    } finally {
      setLoading(false)
    }
  }, [memoCache, fetchPatients])

  const refreshPatients = useCallback(() => {
    // Clear cache and reload
    const cacheKey = 'patients'
    if (getCache(cacheKey)) {
      setCache(cacheKey, null, 0) // Expire immediately
    }
    loadPatients()
  }, [getCache, setCache, loadPatients])

  useEffect(() => {
    loadPatients()
  }, [loadPatients])

  return {
    patients,
    loading,
    error,
    refreshPatients,
    loadPatients
  }
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const { memoCache } = useCache()

  const fetchSessions = useCallback(async (): Promise<Session[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return generateMockSessions()
  }, [])

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await memoCache('sessions', fetchSessions, 1 * 60 * 1000) // 1 minute cache
        setSessions(data)
      } finally {
        setLoading(false)
      }
    }
    
    loadSessions()
  }, [memoCache, fetchSessions])

  return { sessions, loading }
}

export function useInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const { memoCache } = useCache()

  const fetchInsights = useCallback(async (): Promise<Insight[]> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return generateMockInsights()
  }, [])

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await memoCache('insights', fetchInsights, 5 * 60 * 1000) // 5 minutes cache
        setInsights(data)
      } finally {
        setLoading(false)
      }
    }
    
    loadInsights()
  }, [memoCache, fetchInsights])

  return { insights, loading }
}
