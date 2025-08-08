import {
  ClinicalAlert,
  Patient,
  PatientMediaEntry,
} from "@/lib/types/dashboard";
import { useState } from "react";

// Mock data para demonstração
export const useSentimentAnalysisData = () => {
  const [patients] = useState<Patient[]>([
    {
      id: "patient-001",
      name: "Ana Silva",
      email: "ana.silva@email.com",
      assignedTherapistId: "therapist-001",
      joinedAt: "2024-12-01T00:00:00Z",
      status: "active",
    },
    {
      id: "patient-002",
      name: "João Santos",
      email: "joao.santos@email.com",
      assignedTherapistId: "therapist-001",
      joinedAt: "2024-11-15T00:00:00Z",
      status: "active",
    },
    {
      id: "patient-003",
      name: "Maria Costa",
      email: "maria.costa@email.com",
      assignedTherapistId: "therapist-001",
      joinedAt: "2024-10-20T00:00:00Z",
      status: "active",
    },
    {
      id: "patient-004",
      name: "Pedro Oliveira",
      email: "pedro.oliveira@email.com",
      assignedTherapistId: "therapist-001",
      joinedAt: "2024-09-10T00:00:00Z",
      status: "active",
    },
  ]);

  const [mediaEntries] = useState<PatientMediaEntry[]>([
    {
      id: "media-001",
      patientId: "patient-001",
      patientName: "Ana Silva",
      videoUrl: "https://example.com/video1.mp4",
      mediaType: "video",
      transcription:
        "Olá doutor, hoje me sinto muito melhor. As técnicas de respiração que você me ensinou têm me ajudado bastante com a ansiedade. Consegui dormir melhor esta semana e me sinto mais otimista sobre o futuro. Ainda tenho alguns momentos difíceis, mas estou conseguindo lidar melhor com eles. Obrigada por todo o apoio.",
      sentiment: {
        label: "POSITIVO",
        confidence: 0.87,
        summary:
          "Paciente demonstra melhora significativa no humor e autoconfiança",
        score: 0.7,
      },
      createdAt: "2025-08-08T10:30:00Z",
      duration: 300,
      fileSize: 15728640,
    },
    {
      id: "media-002",
      patientId: "patient-002",
      patientName: "João Santos",
      videoUrl: "https://example.com/audio1.mp3",
      mediaType: "audio",
      transcription:
        "Doutor, esta semana foi muito difícil para mim. Tive vários ataques de pânico e não consegui sair de casa alguns dias. Me sinto como se estivesse voltando para trás no tratamento. Estou preocupado se vou conseguir melhorar. Às vezes sinto que nada vai dar certo.",
      sentiment: {
        label: "NEGATIVO",
        confidence: 0.92,
        summary:
          "Paciente relata retrocesso significativo com sintomas de ansiedade",
        score: -0.6,
      },
      createdAt: "2025-08-07T14:15:00Z",
      duration: 180,
      fileSize: 8456320,
    },
    {
      id: "media-003",
      patientId: "patient-001",
      patientName: "Ana Silva",
      videoUrl: "https://example.com/video2.mp4",
      mediaType: "video",
      transcription:
        "Hoje quero falar sobre meu trabalho. Tenho me sentido mais confiante para falar com meus colegas e até consegui apresentar um projeto na reunião da equipe. Antes isso seria impensável para mim. Sinto que estou realmente evoluindo.",
      sentiment: {
        label: "POSITIVO",
        confidence: 0.85,
        summary: "Progresso notável na autoconfiança e habilidades sociais",
        score: 0.8,
      },
      createdAt: "2025-08-06T16:45:00Z",
      duration: 240,
      fileSize: 12345678,
    },
    {
      id: "media-004",
      patientId: "patient-003",
      patientName: "Maria Costa",
      videoUrl: "https://example.com/audio2.mp3",
      mediaType: "audio",
      transcription:
        "Doutor, hoje me sinto um pouco melhor que na semana passada, mas ainda não estou 100%. Os medicamentos parecem estar fazendo efeito, mas ainda tenho alguns altos e baixos. Vou continuar seguindo suas orientações. Espero melhorar mais.",
      sentiment: {
        label: "NEUTRO",
        confidence: 0.76,
        summary: "Estado emocional estável com leve tendência de melhora",
        score: 0.1,
      },
      createdAt: "2025-08-05T11:20:00Z",
      duration: 150,
      fileSize: 7234567,
    },
    {
      id: "media-005",
      patientId: "patient-002",
      patientName: "João Santos",
      videoUrl: "https://example.com/video3.mp4",
      mediaType: "video",
      transcription:
        "Hoje foi um dia especialmente difícil. Não consegui sair da cama pela manhã e cancelei todos os meus compromissos. Me sinto sobrecarregado e não sei se tenho forças para continuar. Preciso de ajuda.",
      sentiment: {
        label: "NEGATIVO",
        confidence: 0.94,
        summary: "Episódio depressivo grave com ideação de desesperança",
        score: -0.8,
      },
      createdAt: "2025-08-04T09:30:00Z",
      duration: 120,
      fileSize: 9876543,
    },
    {
      id: "media-006",
      patientId: "patient-004",
      patientName: "Pedro Oliveira",
      videoUrl: "https://example.com/audio3.mp3",
      mediaType: "audio",
      transcription:
        "Esta semana consegui retomar algumas atividades que tinha abandonado. Voltei a caminhar no parque e até encontrei alguns amigos. Sinto que estou no caminho certo, mesmo que ainda haja dias difíceis.",
      sentiment: {
        label: "POSITIVO",
        confidence: 0.78,
        summary: "Recuperação gradual com retomada de atividades sociais",
        score: 0.5,
      },
      createdAt: "2025-08-03T15:45:00Z",
      duration: 200,
      fileSize: 11234567,
    },
    {
      id: "media-007",
      patientId: "patient-003",
      patientName: "Maria Costa",
      videoUrl: "https://example.com/video4.mp4",
      mediaType: "video",
      transcription:
        "Doutor, quero compartilhar uma boa notícia. Consegui ter uma conversa difícil com minha mãe sobre nosso relacionamento. Foi emotivo, mas necessário. Me sinto mais leve agora.",
      sentiment: {
        label: "POSITIVO",
        confidence: 0.82,
        summary: "Progresso significativo em relacionamentos familiares",
        score: 0.6,
      },
      createdAt: "2025-08-02T12:15:00Z",
      duration: 280,
      fileSize: 14567890,
    },
  ]);

  const [alerts] = useState<ClinicalAlert[]>([
    {
      id: "alert-001",
      patientId: "patient-002",
      patientName: "João Santos",
      type: "consecutive_negative",
      severity: "high",
      message:
        "Paciente relatou sentimentos negativos em 2 uploads consecutivos. Recomenda-se contato imediato.",
      triggeredAt: "2025-08-07T14:15:00Z",
      acknowledged: false,
    },
    {
      id: "alert-002",
      patientId: "patient-002",
      patientName: "João Santos",
      type: "sudden_drop",
      severity: "high",
      message:
        "Queda abrupta no score de sentimento (-0.6 para -0.8). Atenção necessária.",
      triggeredAt: "2025-08-04T09:30:00Z",
      acknowledged: false,
    },
  ]);

  return {
    patients,
    mediaEntries,
    alerts,
    isLoading: false,
    error: null,
  };
};

export default useSentimentAnalysisData;
