import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { CosmosService } from "../services/cosmos.service";
import { MediaProcessingPipelineService } from "../services/media-processing-pipeline.service";
import { SentimentService } from "../services/sentiment.service";
import { TranscriptionService } from "../services/transcription.service";

describe("MediaProcessingPipelineService (Integration)", () => {
  let service: MediaProcessingPipelineService;

  const mockTranscriptionService = {
    transcribeMedia: jest.fn().mockResolvedValue({
      text: "Estou me sentindo muito melhor desde a nossa última sessão. A terapia está realmente me ajudando a lidar com a ansiedade.",
      confidence: 0.92,
      language: "pt-BR",
    }),
    healthCheck: jest.fn().mockResolvedValue({ dragon: false, whisper: true }),
  };

  const mockSentimentService = {
    analyzeSentiment: jest.fn().mockResolvedValue({
      label: "POSITIVO",
      confidence: 0.87,
      summary:
        "Paciente demonstra melhora significativa no estado emocional, expressando sentimentos positivos sobre o progresso terapêutico e redução da ansiedade.",
    }),
    healthCheck: jest
      .fn()
      .mockResolvedValue({ status: "healthy", model: "gpt-4o" }),
    getSentimentStatistics: jest.fn(),
  };

  const mockCosmosService = {
    savePatientMedia: jest.fn().mockResolvedValue("patient_123-1691502600000"),
    getPatientMediaByPatientId: jest.fn().mockResolvedValue([]),
    healthCheck: jest
      .fn()
      .mockResolvedValue({ status: "connected", database: "therapyengage" }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [
        MediaProcessingPipelineService,
        {
          provide: TranscriptionService,
          useValue: mockTranscriptionService,
        },
        {
          provide: SentimentService,
          useValue: mockSentimentService,
        },
        {
          provide: CosmosService,
          useValue: mockCosmosService,
        },
      ],
    }).compile();

    service = module.get<MediaProcessingPipelineService>(
      MediaProcessingPipelineService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("processMedia", () => {
    it("should successfully process media through the entire pipeline", async () => {
      const input = {
        patientId: "patient_123",
        videoUrl:
          "https://therapystorage.blob.core.windows.net/videos/session_001.mp4",
        mediaType: "video" as const,
        createdAt: "2025-08-08T14:30:00.000Z",
      };

      const result = await service.processMedia(input);

      expect(result).toMatchObject({
        id: "patient_123-1691502600000",
        patientId: "patient_123",
        videoUrl:
          "https://therapystorage.blob.core.windows.net/videos/session_001.mp4",
        mediaType: "video",
        transcription: expect.stringContaining("sentindo muito melhor"),
        sentiment: {
          label: "POSITIVO",
          confidence: 0.87,
          summary: expect.stringContaining("melhora significativa"),
        },
        createdAt: "2025-08-08T14:30:00.000Z",
        processedAt: expect.any(String),
        processingTimeMs: expect.any(Number),
      });

      expect(mockTranscriptionService.transcribeMedia).toHaveBeenCalledWith(
        "https://therapystorage.blob.core.windows.net/videos/session_001.mp4",
        "video"
      );

      expect(mockSentimentService.analyzeSentiment).toHaveBeenCalledWith(
        expect.stringContaining("sentindo muito melhor")
      );

      expect(mockCosmosService.savePatientMedia).toHaveBeenCalledWith({
        patientId: "patient_123",
        videoUrl:
          "https://therapystorage.blob.core.windows.net/videos/session_001.mp4",
        mediaType: "video",
        transcription: expect.stringContaining("sentindo muito melhor"),
        sentiment: {
          label: "POSITIVO",
          confidence: 0.87,
          summary: expect.stringContaining("melhora significativa"),
        },
        createdAt: "2025-08-08T14:30:00.000Z",
      });
    });

    it("should handle transcription failures gracefully", async () => {
      mockTranscriptionService.transcribeMedia.mockRejectedValueOnce(
        new Error("Transcription service unavailable")
      );

      const input = {
        patientId: "patient_123",
        videoUrl:
          "https://therapystorage.blob.core.windows.net/videos/session_001.mp4",
        mediaType: "video" as const,
        createdAt: "2025-08-08T14:30:00.000Z",
      };

      await expect(service.processMedia(input)).rejects.toThrow(
        "Media processing pipeline failed: Transcription service unavailable"
      );
    });

    it("should handle empty transcription", async () => {
      mockTranscriptionService.transcribeMedia.mockResolvedValueOnce({
        text: "",
        confidence: 0.0,
        language: "pt-BR",
      });

      const input = {
        patientId: "patient_123",
        videoUrl:
          "https://therapystorage.blob.core.windows.net/videos/session_001.mp4",
        mediaType: "video" as const,
        createdAt: "2025-08-08T14:30:00.000Z",
      };

      await expect(service.processMedia(input)).rejects.toThrow(
        "Media processing pipeline failed: Transcription resulted in empty text"
      );
    });
  });

  describe("getHealthStatus", () => {
    it("should return healthy status when all services are working", async () => {
      const health = await service.getHealthStatus();

      expect(health).toEqual({
        status: "healthy",
        services: {
          transcription: { dragon: false, whisper: true },
          sentiment: { status: "healthy", model: "gpt-4o" },
          cosmos: { status: "connected", database: "therapyengage" },
        },
      });
    });

    it("should return degraded status when some services are failing", async () => {
      mockSentimentService.healthCheck.mockResolvedValueOnce({
        status: "error",
        model: "gpt-4o",
      });

      const health = await service.getHealthStatus();

      expect(health.status).toBe("degraded");
    });
  });

  describe("processBatchMedia", () => {
    it("should process multiple media files", async () => {
      const inputs = [
        {
          patientId: "patient_123",
          videoUrl: "https://storage.com/video1.mp4",
          mediaType: "video" as const,
          createdAt: "2025-08-08T14:30:00.000Z",
        },
        {
          patientId: "patient_456",
          videoUrl: "https://storage.com/audio1.mp3",
          mediaType: "audio" as const,
          createdAt: "2025-08-08T15:30:00.000Z",
        },
      ];

      // Mock different responses for each call
      mockCosmosService.savePatientMedia
        .mockResolvedValueOnce("patient_123-1691502600000")
        .mockResolvedValueOnce("patient_456-1691506200000");

      const results = await service.processBatchMedia(inputs);

      expect(results).toHaveLength(2);
      expect(results[0].patientId).toBe("patient_123");
      expect(results[1].patientId).toBe("patient_456");
    });
  });
});

/**
 * Example Usage Demo
 *
 * This shows how to use the pipeline in real scenarios
 */
export class PipelineUsageDemo {
  constructor(private pipelineService: MediaProcessingPipelineService) {}

  /**
   * Example 1: Process a single video upload
   */
  async processVideoUpload(patientId: string, blobUrl: string) {
    try {
      const result = await this.pipelineService.processMedia({
        patientId,
        videoUrl: blobUrl,
        mediaType: "video",
        createdAt: new Date().toISOString(),
      });

      console.log("Processing completed:", {
        documentId: result.id,
        transcriptionLength: result.transcription.length,
        sentiment: result.sentiment.label,
        confidence: result.sentiment.confidence,
        processingTime: `${result.processingTimeMs}ms`,
      });

      return result;
    } catch (error) {
      console.error("Processing failed:", error.message);
      throw error;
    }
  }

  /**
   * Example 2: Batch process multiple recordings
   */
  async processBatchRecordings(
    recordings: Array<{
      patientId: string;
      url: string;
      type: "audio" | "video";
    }>
  ) {
    const inputs = recordings.map((recording) => ({
      patientId: recording.patientId,
      videoUrl: recording.url,
      mediaType: recording.type,
      createdAt: new Date().toISOString(),
    }));

    const results = await this.pipelineService.processBatchMedia(inputs);

    console.log(
      `Batch processing completed: ${results.length} items processed`
    );

    return results;
  }

  /**
   * Example 3: Monitor pipeline health
   */
  async checkPipelineHealth() {
    const health = await this.pipelineService.getHealthStatus();

    console.log("Pipeline Health Status:", {
      overall: health.status,
      transcription: health.services.transcription,
      sentiment: health.services.sentiment,
      storage: health.services.cosmos,
    });

    return health.status === "healthy";
  }

  /**
   * Example 4: Get processing statistics
   */
  async getPatientProgress(patientId: string) {
    const stats = await this.pipelineService.getProcessingStatistics(patientId);

    console.log(`Patient ${patientId} Statistics:`, {
      totalSessions: stats.totalProcessed,
      sentimentBreakdown: stats.sentimentDistribution,
      averageProcessingTime: stats.averageProcessingTime,
    });

    return stats;
  }
}

/**
 * GraphQL Usage Examples
 *
 * These are the GraphQL mutations and queries you can use:
 */
export const GRAPHQL_EXAMPLES = {
  // Process a single media file
  processMedia: `
    mutation ProcessPatientMedia($patientId: String!, $videoUrl: String!, $mediaType: String!) {
      processPatientMedia(
        patientId: $patientId
        videoUrl: $videoUrl
        mediaType: $mediaType
      )
    }
  `,

  // Check pipeline health
  healthCheck: `
    query PipelineHealth {
      pipelineHealthCheck
    }
  `,

  // Get processing statistics
  statistics: `
    query ProcessingStats($patientId: String) {
      processingStatistics(patientId: $patientId)
    }
  `,

  // Reprocess existing media
  reprocess: `
    mutation ReprocessMedia($patientId: String!, $documentId: String!) {
      reprocessMedia(patientId: $patientId, documentId: $documentId)
    }
  `,
};
