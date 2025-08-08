"use client";

import AppShell from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClinicalAlert,
  MediaPlayerState,
  Patient,
  PatientMediaEntry,
  SentimentDataPoint,
  TranscriptionModalState,
} from "@/lib/types/dashboard";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Download,
  Minus,
  Pause,
  Play,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data para demonstração
const mockPatients: Patient[] = [
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
];

const mockMediaEntries: PatientMediaEntry[] = [
  {
    id: "media-001",
    patientId: "patient-001",
    patientName: "Ana Silva",
    videoUrl: "https://example.com/video1.mp4",
    mediaType: "video",
    transcription:
      "Olá doutor, hoje me sinto muito melhor. As técnicas de respiração que você me ensinou têm me ajudado bastante com a ansiedade. Consegui dormir melhor esta semana e me sinto mais otimista sobre o futuro. Ainda tenho alguns momentos difíceis, mas estou conseguindo lidar melhor com eles.",
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
      "Doutor, esta semana foi muito difícil para mim. Tive vários ataques de pânico e não consegui sair de casa alguns dias. Me sinto como se estivesse voltando para trás no tratamento. Estou preocupado se vou conseguir melhorar.",
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
      "Hoje quero falar sobre meu trabalho. Tenho me sentido mais confiante para falar com meus colegas e até consegui apresentar um projeto na reunião da equipe. Antes isso seria impensável para mim.",
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
      "Doutor, hoje me sinto um pouco melhor que na semana passada, mas ainda não estou 100%. Os medicamentos parecem estar fazendo efeito, mas ainda tenho alguns altos e baixos. Vou continuar seguindo suas orientações.",
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
];

const mockAlerts: ClinicalAlert[] = [
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
];

const generateSentimentTrend = (
  entries: PatientMediaEntry[]
): SentimentDataPoint[] => {
  return entries
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((entry) => ({
      date: new Date(entry.createdAt).toLocaleDateString("pt-BR", {
        month: "short",
        day: "2-digit",
      }),
      score: entry.sentiment.score,
      label: entry.sentiment.label,
      confidence: entry.sentiment.confidence,
    }));
};

export default function SentimentAnalysisPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("all");
  const [filteredEntries, setFilteredEntries] = useState<PatientMediaEntry[]>(
    []
  );
  const [sentimentTrend, setSentimentTrend] = useState<SentimentDataPoint[]>(
    []
  );
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayerState>({
    isOpen: false,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });
  const [transcriptionModal, setTranscriptionModal] =
    useState<TranscriptionModalState>({
      isOpen: false,
    });

  useEffect(() => {
    if (selectedPatientId && selectedPatientId !== "all") {
      const entries = mockMediaEntries.filter(
        (entry) => entry.patientId === selectedPatientId
      );
      setFilteredEntries(entries);
      setSentimentTrend(generateSentimentTrend(entries));
    } else {
      setFilteredEntries(mockMediaEntries);
      setSentimentTrend(generateSentimentTrend(mockMediaEntries));
    }
  }, [selectedPatientId]);

  const getSentimentBadgeVariant = (label: string) => {
    switch (label) {
      case "POSITIVO":
        return "default";
      case "NEGATIVO":
        return "destructive";
      case "NEUTRO":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case "POSITIVO":
        return <TrendingUp className="h-4 w-4" />;
      case "NEGATIVO":
        return <TrendingDown className="h-4 w-4" />;
      case "NEUTRO":
        return <Minus className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const openMediaPlayer = (media: PatientMediaEntry) => {
    setMediaPlayer({
      isOpen: true,
      currentMedia: media,
      isPlaying: false,
      currentTime: 0,
      duration: media.duration || 0,
    });
  };

  const openTranscriptionModal = (media: PatientMediaEntry) => {
    setTranscriptionModal({
      isOpen: true,
      transcription: media.transcription,
      mediaEntry: media,
    });
  };

  return (
    <AppShell>
      <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Análise de Sentimento
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o histórico emocional dos pacientes através de relatos em
            vídeo e áudio
          </p>
        </div>

        {/* Seletor de Paciente */}
        <div className="flex items-center gap-4">
          <Select
            value={selectedPatientId}
            onValueChange={setSelectedPatientId}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Todos os pacientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os pacientes</SelectItem>
              {mockPatients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alertas Clínicos */}
      {mockAlerts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Alertas Clínicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="destructive">
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{alert.patientName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.triggeredAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Marcar como lido
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Tendência de Sentimento */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Sentimento ao Longo do Tempo</CardTitle>
          <p className="text-sm text-muted-foreground">
            Evolução emocional baseada nos relatos dos pacientes
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[-1, 1]} />
                <Tooltip
                  formatter={(value: number) => [
                    `Score: ${value.toFixed(2)}`,
                    "Sentimento",
                  ]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Relatos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Relatos</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredEntries.length} relatos encontrados
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg space-y-3">
                {/* Header do Relato */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {entry.mediaType === "video" ? "🎥" : "🎙️"}
                      <span className="font-medium">{entry.patientName}</span>
                    </div>
                    <Badge
                      variant={getSentimentBadgeVariant(entry.sentiment.label)}
                      className="flex items-center gap-1"
                    >
                      {getSentimentIcon(entry.sentiment.label)}
                      {entry.sentiment.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Confiança: {(entry.sentiment.confidence * 100).toFixed(0)}
                      %
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(entry.createdAt).toLocaleString("pt-BR")}
                  </div>
                </div>

                {/* Resumo da Transcrição */}
                <div className="bg-muted/30 p-3 rounded">
                  <p className="text-sm text-foreground leading-relaxed">
                    {entry.transcription.substring(0, 150)}
                    {entry.transcription.length > 150 && "..."}
                  </p>
                </div>

                {/* Análise de Sentimento */}
                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Análise de Sentimento:
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {entry.sentiment.summary}
                  </p>
                </div>

                {/* Metadados e Ações */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(entry.duration || 0)}
                    </span>
                    <span>{formatFileSize(entry.fileSize || 0)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openTranscriptionModal(entry)}
                    >
                      Ver Transcrição Completa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openMediaPlayer(entry)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Reproduzir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Transcrição Completa */}
      <Dialog
        open={transcriptionModal.isOpen}
        onOpenChange={(open) =>
          setTranscriptionModal((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Transcrição Completa</DialogTitle>
            <DialogDescription>
              {transcriptionModal.mediaEntry?.patientName} •{" "}
              {transcriptionModal.mediaEntry &&
                new Date(
                  transcriptionModal.mediaEntry.createdAt
                ).toLocaleString("pt-BR")}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {transcriptionModal.transcription}
                </p>
              </div>
              {transcriptionModal.mediaEntry && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={getSentimentBadgeVariant(
                        transcriptionModal.mediaEntry.sentiment.label
                      )}
                    >
                      {transcriptionModal.mediaEntry.sentiment.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Confiança:{" "}
                      {(
                        transcriptionModal.mediaEntry.sentiment.confidence * 100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {transcriptionModal.mediaEntry.sentiment.summary}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Player Modal */}
      <Dialog
        open={mediaPlayer.isOpen}
        onOpenChange={(open) =>
          setMediaPlayer((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reproduzir Mídia</DialogTitle>
            <DialogDescription>
              {mediaPlayer.currentMedia?.patientName} •{" "}
              {mediaPlayer.currentMedia?.mediaType === "video"
                ? "Vídeo"
                : "Áudio"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/30 p-8 rounded-lg text-center">
              <div className="text-6xl mb-4">
                {mediaPlayer.currentMedia?.mediaType === "video" ? "🎥" : "🎙️"}
              </div>
              <p className="text-sm text-muted-foreground">
                {mediaPlayer.currentMedia?.mediaType === "video"
                  ? "Player de Vídeo"
                  : "Player de Áudio"}
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="lg">
                {mediaPlayer.isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Nota: Esta é uma demonstração. Em produção, seria integrado com
              player de mídia real.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </AppShell>
  );
}
