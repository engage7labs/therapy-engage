'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCache } from './use-cache'

// Enhanced therapy data interfaces
export interface TherapyPatient {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly phone?: string
  readonly age: number
  readonly dateOfBirth: Date
  readonly diagnosis: readonly string[]
  readonly primaryDiagnosis: string
  readonly therapistId: string
  readonly status: 'active' | 'inactive' | 'completed' | 'on-hold'
  readonly nextSessionDate?: Date
  readonly totalSessions: number
  readonly completedSessions: number
  readonly riskLevel: 'low' | 'medium' | 'high' | 'critical'
  readonly moodTrend: 'improving' | 'stable' | 'declining' | 'fluctuating'
  readonly notes?: string
  readonly emergencyContact: {
    readonly name: string
    readonly phone: string
    readonly relationship: string
    readonly consent: boolean
  }
  readonly preferences: {
    readonly communicationMethod: 'email' | 'phone' | 'app' | 'whatsapp'
    readonly sessionReminders: boolean
    readonly dataSharing: boolean
    readonly language: 'pt' | 'en' | 'es'
  }
  readonly medication?: {
    readonly name: string
    readonly dosage: string
    readonly frequency: string
    readonly prescribedBy: string
    readonly adherence: number // 0-100%
  }[]
  readonly goals: {
    readonly id: string
    readonly description: string
    readonly progress: number // 0-100%
    readonly targetDate: Date
    readonly priority: 'low' | 'medium' | 'high'
  }[]
}

export interface TherapySession {
  readonly id: string
  readonly patientId: string
  readonly patientName: string
  readonly therapistId: string
  readonly scheduledDate: Date
  readonly duration: number // minutes
  readonly type: 'individual' | 'group' | 'family' | 'assessment' | 'consultation'
  readonly modality: 'in-person' | 'video' | 'phone'
  readonly status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled'
  readonly notes?: string
  readonly goals?: readonly string[]
  readonly homework?: readonly string[]
  readonly nextSteps?: readonly string[]
  readonly mood?: {
    readonly pre: number // 1-10 scale
    readonly post: number // 1-10 scale
    readonly notes?: string
  }
  readonly techniques?: readonly string[]
  readonly rating?: {
    readonly therapist: number // 1-5 scale
    readonly patient?: number // 1-5 scale
  }
  readonly billing?: {
    readonly cost: number
    readonly insurance: boolean
    readonly paid: boolean
  }
}

export interface TherapyInsight {
  readonly id: string
  readonly patientId: string
  readonly patientName: string
  readonly type: 'progress' | 'concern' | 'milestone' | 'recommendation' | 'risk-alert' | 'medication-reminder'
  readonly category: 'mood' | 'behavior' | 'medication' | 'session' | 'goal' | 'safety'
  readonly title: string
  readonly description: string
  readonly summary: string
  readonly date: Date
  readonly timestamp: string
  readonly severity?: 'low' | 'medium' | 'high' | 'critical'
  readonly confidence: number // 0-100%
  readonly actionRequired: boolean
  readonly urgent: boolean
  readonly tags: readonly string[]
  readonly relatedSessions: readonly string[]
  readonly recommendation: string
  readonly followUp?: {
    readonly required: boolean
    readonly deadline: Date
    readonly assignedTo: string
  }
}

export interface TherapyMetrics {
  readonly totalPatients: number
  readonly activePatients: number
  readonly totalSessions: number
  readonly completedSessions: number
  readonly cancelledSessions: number
  readonly averageSessionRating: number
  readonly riskDistribution: Record<'low' | 'medium' | 'high' | 'critical', number>
  readonly moodTrends: Record<'improving' | 'stable' | 'declining' | 'fluctuating', number>
  readonly goalCompletion: number // percentage
  readonly avgSessionsPerPatient: number
  readonly nextWeekSessions: number
  readonly urgentInsights: number
}

// Enhanced mock data generators
const generateAdvancedPatients = (count: number = 30): TherapyPatient[] => {
  const firstNames = ['Ana', 'Carlos', 'Maria', 'João', 'Beatriz', 'Pedro', 'Sofia', 'Lucas', 'Isabella', 'Miguel', 'Carla', 'Fernando', 'Julia', 'Roberto', 'Camila']
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Rodrigues', 'Almeida', 'Nascimento', 'Lima', 'Ferreira', 'Barbosa', 'Ribeiro', 'Martins', 'Carvalho']
  const diagnoses = [
    'Transtorno de Ansiedade Generalizada',
    'Depressão Maior',
    'Transtorno Bipolar',
    'Transtorno do Pânico',
    'TEPT - Transtorno de Estresse Pós-Traumático',
    'Transtorno Obsessivo-Compulsivo',
    'Fobia Social',
    'Transtorno de Personalidade Borderline',
    'Transtorno de Déficit de Atenção'
  ]
  
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const age = Math.floor(Math.random() * 50) + 18
    const birthYear = new Date().getFullYear() - age
    const primaryDiagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)]
    const completedSessions = Math.floor(Math.random() * 30)
    const totalSessions = completedSessions + Math.floor(Math.random() * 20) + 5
    
    return {
      id: `tp-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+55 11 9${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      age,
      dateOfBirth: new Date(birthYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      diagnosis: [primaryDiagnosis, ...(Math.random() > 0.7 ? [diagnoses[Math.floor(Math.random() * diagnoses.length)]] : [])],
      primaryDiagnosis,
      therapistId: `therapist-${Math.floor(Math.random() * 8) + 1}`,
      status: (['active', 'active', 'active', 'inactive', 'completed', 'on-hold'][Math.floor(Math.random() * 6)]) as any,
      nextSessionDate: Math.random() > 0.3 ? new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000) : undefined,
      totalSessions,
      completedSessions,
      riskLevel: (['low', 'low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 5)]) as any,
      moodTrend: (['improving', 'stable', 'declining', 'fluctuating'][Math.floor(Math.random() * 4)]) as any,
      notes: Math.random() > 0.4 ? 'Paciente demonstra boa evolução no tratamento. Engajamento positivo nas sessões.' : undefined,
      emergencyContact: {
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        phone: `+55 11 9${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        relationship: ['cônjuge', 'pai/mãe', 'irmão/irmã', 'amigo(a)', 'filho(a)'][Math.floor(Math.random() * 5)],
        consent: Math.random() > 0.1
      },
      preferences: {
        communicationMethod: (['email', 'phone', 'app', 'whatsapp'][Math.floor(Math.random() * 4)]) as any,
        sessionReminders: Math.random() > 0.2,
        dataSharing: Math.random() > 0.3,
        language: (['pt', 'en', 'es'][Math.floor(Math.random() * 3)]) as any
      },
      medication: Math.random() > 0.5 ? [{
        name: ['Sertralina', 'Fluoxetina', 'Escitalopram', 'Venlafaxina', 'Bupropiona'][Math.floor(Math.random() * 5)],
        dosage: `${[25, 50, 100, 150][Math.floor(Math.random() * 4)]}mg`,
        frequency: ['1x ao dia', '2x ao dia', '1x a cada 12h'][Math.floor(Math.random() * 3)],
        prescribedBy: 'Dr. João Psiquiatra',
        adherence: Math.floor(Math.random() * 40) + 60
      }] : undefined,
      goals: Array.from({ length: Math.floor(Math.random() * 4) + 2 }, (_, gi) => ({
        id: `goal-${i}-${gi}`,
        description: [
          'Reduzir episódios de ansiedade',
          'Melhorar qualidade do sono',
          'Desenvolver estratégias de enfrentamento',
          'Fortalecer relacionamentos interpessoais',
          'Aumentar autoestima e autoconfiança',
          'Gerenciar estresse no trabalho'
        ][Math.floor(Math.random() * 6)],
        progress: Math.floor(Math.random() * 100),
        targetDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000),
        priority: (['low', 'medium', 'high'][Math.floor(Math.random() * 3)]) as any
      }))
    }
  })
}

const generateAdvancedSessions = (patients: TherapyPatient[]): TherapySession[] => {
  const sessionTypes: Array<TherapySession['type']> = ['individual', 'group', 'family', 'assessment', 'consultation']
  const modalities: Array<TherapySession['modality']> = ['in-person', 'video', 'phone']
  const statuses: Array<TherapySession['status']> = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show']
  const techniques = ['CBT', 'DBT', 'EMDR', 'Mindfulness', 'Relaxamento Progressivo', 'Terapia Narrativa', 'Psicoeducação']
  
  return patients.flatMap(patient => 
    Array.from({ length: Math.floor(Math.random() * 12) + 3 }, (_, i) => {
      const sessionDate = new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000)
      const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      
      return {
        id: `session-${patient.id}-${i + 1}`,
        patientId: patient.id,
        patientName: patient.name,
        therapistId: patient.therapistId,
        scheduledDate: sessionDate,
        duration: sessionType === 'group' ? 90 : (sessionType === 'assessment' ? 120 : [45, 60][Math.floor(Math.random() * 2)]),
        type: sessionType,
        modality: modalities[Math.floor(Math.random() * modalities.length)],
        status,
        notes: status === 'completed' ? 'Sessão produtiva. Paciente demonstrou boa participação e engajamento.' : undefined,
        goals: Math.random() > 0.4 ? patient.goals.slice(0, 2).map(g => g.description) : undefined,
        homework: Math.random() > 0.6 ? [
          'Praticar técnicas de respiração diariamente',
          'Registrar pensamentos em diário',
          'Exercícios de mindfulness por 10 min/dia'
        ].slice(0, Math.floor(Math.random() * 3) + 1) : undefined,
        mood: status === 'completed' ? {
          pre: Math.floor(Math.random() * 5) + 3,
          post: Math.floor(Math.random() * 3) + 6,
          notes: Math.random() > 0.5 ? 'Paciente relatou melhora significativa durante a sessão' : undefined
        } : undefined,
        techniques: status === 'completed' ? techniques.slice(0, Math.floor(Math.random() * 3) + 1) : undefined,
        rating: status === 'completed' ? {
          therapist: Math.floor(Math.random() * 2) + 4,
          patient: Math.random() > 0.3 ? Math.floor(Math.random() * 2) + 4 : undefined
        } : undefined,
        billing: {
          cost: sessionType === 'assessment' ? 300 : (sessionType === 'group' ? 150 : 200),
          insurance: Math.random() > 0.4,
          paid: status === 'completed' ? Math.random() > 0.2 : false
        }
      }
    })
  )
}

const generateAdvancedInsights = (patients: TherapyPatient[], sessions: TherapySession[]): TherapyInsight[] => {
  const insightTypes: Array<TherapyInsight['type']> = ['progress', 'concern', 'milestone', 'recommendation', 'risk-alert', 'medication-reminder']
  const categories: Array<TherapyInsight['category']> = ['mood', 'behavior', 'medication', 'session', 'goal', 'safety']
  const tags = ['ansiedade', 'depressão', 'comunicação', 'enfrentamento', 'família', 'trabalho', 'progresso', 'retrocesso', 'medicação', 'sono']
  
  return patients.flatMap(patient => {
    const patientSessions = sessions.filter(s => s.patientId === patient.id)
    
    return Array.from({ length: Math.floor(Math.random() * 6) + 2 }, (_, i) => {
      const insightType = insightTypes[Math.floor(Math.random() * insightTypes.length)]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const severity = ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any
      const confidence = Math.floor(Math.random() * 30) + 70
      
      return {
        id: `insight-${patient.id}-${i + 1}`,
        patientId: patient.id,
        patientName: patient.name,
        type: insightType,
        category,
        title: {
          'progress': 'Progresso significativo identificado',
          'concern': 'Preocupação com padrão comportamental',
          'milestone': 'Marco importante alcançado',
          'recommendation': 'Recomendação para ajuste no tratamento',
          'risk-alert': 'Alerta de risco detectado',
          'medication-reminder': 'Lembrete sobre medicação'
        }[insightType] || 'Insight identificado',
        description: `Análise detalhada baseada nas últimas ${patientSessions.length} sessões e evolução do paciente.`,
        summary: `Paciente demonstra ${['melhora', 'estabilidade', 'desafios'][Math.floor(Math.random() * 3)]} no tratamento atual.`,
        date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
        timestamp: new Date().toISOString(),
        severity: insightType === 'risk-alert' ? 'high' : severity,
        confidence,
        actionRequired: insightType === 'risk-alert' || severity === 'high' || Math.random() > 0.6,
        urgent: insightType === 'risk-alert' || severity === 'critical',
        tags: Array.from({ length: Math.floor(Math.random() * 4) + 2 }, () => 
          tags[Math.floor(Math.random() * tags.length)]
        ).filter((tag, index, arr) => arr.indexOf(tag) === index),
        relatedSessions: patientSessions.slice(0, Math.floor(Math.random() * 3) + 1).map(s => s.id),
        recommendation: [
          'Continuar com o plano atual',
          'Ajustar frequência das sessões',
          'Considerar avaliação psiquiátrica',
          'Incluir terapia de grupo',
          'Focar em técnicas específicas'
        ][Math.floor(Math.random() * 5)],
        followUp: (insightType === 'risk-alert' || Math.random() > 0.7) ? {
          required: true,
          deadline: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
          assignedTo: patient.therapistId
        } : undefined
      }
    })
  })
}

// Enhanced hooks with comprehensive error handling and loading states
export function useAdvancedPatients() {
  const { memoCache } = useCache()
  const [patients, setPatients] = useState<TherapyPatient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPatients = useCallback(async (): Promise<TherapyPatient[]> => {
    try {
      setLoading(true)
      setError(null)
      
      return await memoCache(
        'advanced-therapy-patients',
        async () => {
          await new Promise(resolve => setTimeout(resolve, 1200))
          return generateAdvancedPatients(25)
        },
        15 * 60 * 1000 // 15 minutes cache
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch patients'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [memoCache])

  useEffect(() => {
    fetchPatients().then(setPatients).catch(console.error)
  }, [fetchPatients])

  return { patients, loading, error, refetch: fetchPatients }
}

export function useAdvancedSessions(patientId?: string) {
  const { memoCache } = useCache()
  const { patients } = useAdvancedPatients()
  const [sessions, setSessions] = useState<TherapySession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSessions = useCallback(async (): Promise<TherapySession[]> => {
    try {
      setLoading(true)
      setError(null)
      
      const cacheKey = patientId ? `advanced-sessions-${patientId}` : 'advanced-sessions-all'
      
      return await memoCache(
        cacheKey,
        async () => {
          await new Promise(resolve => setTimeout(resolve, 900))
          const allSessions = generateAdvancedSessions(patients)
          return patientId ? allSessions.filter(session => session.patientId === patientId) : allSessions
        },
        10 * 60 * 1000 // 10 minutes cache
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sessions'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [memoCache, patients, patientId])

  useEffect(() => {
    if (patients.length > 0) {
      fetchSessions().then(setSessions).catch(console.error)
    }
  }, [fetchSessions, patients])

  return { sessions, loading, error, refetch: fetchSessions }
}

export function useAdvancedInsights(patientId?: string) {
  const { memoCache } = useCache()
  const { patients } = useAdvancedPatients()
  const { sessions } = useAdvancedSessions()
  const [insights, setInsights] = useState<TherapyInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = useCallback(async (): Promise<TherapyInsight[]> => {
    try {
      setLoading(true)
      setError(null)
      
      const cacheKey = patientId ? `advanced-insights-${patientId}` : 'advanced-insights-all'
      
      return await memoCache(
        cacheKey,
        async () => {
          await new Promise(resolve => setTimeout(resolve, 700))
          const allInsights = generateAdvancedInsights(patients, sessions)
          return patientId ? allInsights.filter(insight => insight.patientId === patientId) : allInsights
        },
        12 * 60 * 1000 // 12 minutes cache
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch insights'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [memoCache, patients, sessions, patientId])

  useEffect(() => {
    if (patients.length > 0 && sessions.length > 0) {
      fetchInsights().then(setInsights).catch(console.error)
    }
  }, [fetchInsights, patients, sessions])

  return { insights, loading, error, refetch: fetchInsights }
}

// Comprehensive therapy data hook with metrics
export function useTherapyPlatformData(patientId?: string) {
  const patients = useAdvancedPatients()
  const sessions = useAdvancedSessions(patientId)
  const insights = useAdvancedInsights(patientId)

  const loading = patients.loading || sessions.loading || insights.loading
  const error = patients.error || sessions.error || insights.error

  // Calculate comprehensive metrics
  const metrics: TherapyMetrics = {
    totalPatients: patients.patients.length,
    activePatients: patients.patients.filter(p => p.status === 'active').length,
    totalSessions: sessions.sessions.length,
    completedSessions: sessions.sessions.filter(s => s.status === 'completed').length,
    cancelledSessions: sessions.sessions.filter(s => s.status === 'cancelled').length,
    averageSessionRating: sessions.sessions
      .filter(s => s.rating?.therapist)
      .reduce((acc, s) => acc + (s.rating?.therapist || 0), 0) / 
      Math.max(1, sessions.sessions.filter(s => s.rating?.therapist).length),
    riskDistribution: {
      low: patients.patients.filter(p => p.riskLevel === 'low').length,
      medium: patients.patients.filter(p => p.riskLevel === 'medium').length,
      high: patients.patients.filter(p => p.riskLevel === 'high').length,
      critical: patients.patients.filter(p => p.riskLevel === 'critical').length
    },
    moodTrends: {
      improving: patients.patients.filter(p => p.moodTrend === 'improving').length,
      stable: patients.patients.filter(p => p.moodTrend === 'stable').length,
      declining: patients.patients.filter(p => p.moodTrend === 'declining').length,
      fluctuating: patients.patients.filter(p => p.moodTrend === 'fluctuating').length
    },
    goalCompletion: patients.patients.length > 0 ? 
      patients.patients.reduce((acc, p) => 
        acc + p.goals.reduce((goalAcc, g) => goalAcc + g.progress, 0) / Math.max(1, p.goals.length), 0
      ) / patients.patients.length : 0,
    avgSessionsPerPatient: patients.patients.length > 0 ? 
      patients.patients.reduce((acc, p) => acc + p.completedSessions, 0) / patients.patients.length : 0,
    nextWeekSessions: sessions.sessions.filter(s => {
      const sessionDate = new Date(s.scheduledDate)
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      return sessionDate <= nextWeek && sessionDate >= new Date() && s.status === 'scheduled'
    }).length,
    urgentInsights: insights.insights.filter(i => i.urgent).length
  }

  const refetchAll = useCallback(async () => {
    try {
      await Promise.all([
        patients.refetch(),
        sessions.refetch(),
        insights.refetch()
      ])
    } catch (error) {
      console.error('Error refetching therapy data:', error)
    }
  }, [patients, sessions, insights])

  return {
    patients: patients.patients,
    sessions: sessions.sessions,
    insights: insights.insights,
    metrics,
    loading,
    error,
    refetchAll
  }
}
