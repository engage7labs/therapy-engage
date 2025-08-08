import { Injectable, Logger } from "@nestjs/common";
import { CosmosService } from "./cosmos.service";
import { SentimentService } from "./sentiment.service";
import { TranscriptionService } from "./transcription.service";

export interface PipelineInput {
  patientId: string;
  videoUrl: string;
  mediaType: "audio" | "video";
  createdAt: string;
}

export interface PipelineResult {
  id: string;
  patientId: string;
  videoUrl: string;
  mediaType: "audio" | "video";
  transcription: string;
  sentiment: {
    label: string;
    confidence: number;
    summary: string;
  };
  createdAt: string;
  processedAt: string;
  processingTimeMs: number;
}

@Injectable()
export class MediaProcessingPipelineService {
  private readonly logger = new Logger(MediaProcessingPipelineService.name);

  constructor(
    private readonly transcriptionService: TranscriptionService,
    private readonly sentimentService: SentimentService,
    private readonly cosmosService: CosmosService
  ) {}

  /**
   * Main pipeline method - processes media through transcription, sentiment analysis, and persistence
   */
  async processMedia(input: PipelineInput): Promise<PipelineResult> {
    const startTime = Date.now();
    this.logger.log(
      `Starting media processing pipeline for patient: ${input.patientId}`
    );

    try {
      // Step 1: Transcription
      this.logger.log("Step 1: Starting transcription...");
      const transcriptionResult =
        await this.transcriptionService.transcribeMedia(
          input.videoUrl,
          input.mediaType
        );

      if (
        !transcriptionResult.text ||
        transcriptionResult.text.trim().length === 0
      ) {
        throw new Error("Transcription resulted in empty text");
      }

      this.logger.log(
        `Transcription completed: ${transcriptionResult.text.length} characters`
      );

      // Step 2: Sentiment Analysis
      this.logger.log("Step 2: Starting sentiment analysis...");
      const sentimentResult = await this.sentimentService.analyzeSentiment(
        transcriptionResult.text
      );

      this.logger.log(
        `Sentiment analysis completed: ${sentimentResult.label} (${sentimentResult.confidence})`
      );

      // Step 3: Prepare data for persistence
      const mediaData = {
        patientId: input.patientId,
        videoUrl: input.videoUrl,
        mediaType: input.mediaType,
        transcription: transcriptionResult.text,
        sentiment: sentimentResult,
        createdAt: input.createdAt,
      };

      // Step 4: Persist to CosmosDB
      this.logger.log("Step 3: Persisting to CosmosDB...");
      const documentId = await this.cosmosService.savePatientMedia(mediaData);

      const processingTimeMs = Date.now() - startTime;

      const result: PipelineResult = {
        id: documentId,
        patientId: input.patientId,
        videoUrl: input.videoUrl,
        mediaType: input.mediaType,
        transcription: transcriptionResult.text,
        sentiment: {
          label: sentimentResult.label,
          confidence: sentimentResult.confidence,
          summary: sentimentResult.summary,
        },
        createdAt: input.createdAt,
        processedAt: new Date().toISOString(),
        processingTimeMs,
      };

      this.logger.log(
        `Pipeline completed successfully in ${processingTimeMs}ms. Document ID: ${documentId}`
      );
      return result;
    } catch (error) {
      const processingTimeMs = Date.now() - startTime;
      this.logger.error(`Pipeline failed after ${processingTimeMs}ms:`, error);
      throw new Error(`Media processing pipeline failed: ${error.message}`);
    }
  }

  /**
   * Process multiple media files in batch
   */
  async processBatchMedia(inputs: PipelineInput[]): Promise<PipelineResult[]> {
    this.logger.log(
      `Starting batch processing for ${inputs.length} media files`
    );

    const results: PipelineResult[] = [];
    const errors: { input: PipelineInput; error: string }[] = [];

    for (const input of inputs) {
      try {
        const result = await this.processMedia(input);
        results.push(result);

        // Add delay between batch items to avoid overwhelming services
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        this.logger.error(
          `Batch item failed for patient ${input.patientId}:`,
          error
        );
        errors.push({
          input,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Batch processing completed: ${results.length} successful, ${errors.length} failed`
    );

    if (errors.length > 0) {
      this.logger.warn("Batch processing errors:", errors);
    }

    return results;
  }

  /**
   * Reprocess existing media (e.g., after improving models)
   */
  async reprocessMedia(
    patientId: string,
    documentId: string
  ): Promise<PipelineResult> {
    this.logger.log(
      `Reprocessing media for patient: ${patientId}, document: ${documentId}`
    );

    try {
      // Retrieve existing document from CosmosDB
      const existingDocuments =
        await this.cosmosService.getPatientMediaByPatientId(patientId);
      const existingDocument = existingDocuments.find(
        (doc) => doc.id === documentId
      );

      if (!existingDocument) {
        throw new Error(`Document not found: ${documentId}`);
      }

      // Reprocess using existing URL and metadata
      const input: PipelineInput = {
        patientId: existingDocument.patientId,
        videoUrl: existingDocument.videoUrl,
        mediaType: existingDocument.mediaType,
        createdAt: existingDocument.createdAt,
      };

      return await this.processMedia(input);
    } catch (error) {
      this.logger.error(
        `Reprocessing failed for document ${documentId}:`,
        error
      );
      throw new Error(`Reprocessing failed: ${error.message}`);
    }
  }

  /**
   * Get pipeline health status
   */
  async getHealthStatus(): Promise<{
    status: string;
    services: {
      transcription: any;
      sentiment: any;
      cosmos: any;
    };
  }> {
    try {
      const [transcriptionHealth, sentimentHealth, cosmosHealth] =
        await Promise.all([
          this.transcriptionService.healthCheck(),
          this.sentimentService.healthCheck(),
          this.cosmosService.healthCheck(),
        ]);

      const allHealthy =
        (transcriptionHealth.dragon || transcriptionHealth.whisper) &&
        sentimentHealth.status === "healthy" &&
        cosmosHealth.status === "connected";

      return {
        status: allHealthy ? "healthy" : "degraded",
        services: {
          transcription: transcriptionHealth,
          sentiment: sentimentHealth,
          cosmos: cosmosHealth,
        },
      };
    } catch (error) {
      this.logger.error("Health check failed:", error);
      return {
        status: "error",
        services: {
          transcription: { error: "unavailable" },
          sentiment: { error: "unavailable" },
          cosmos: { error: "unavailable" },
        },
      };
    }
  }

  /**
   * Get processing statistics
   */
  async getProcessingStatistics(patientId?: string): Promise<{
    totalProcessed: number;
    averageProcessingTime: number;
    sentimentDistribution: {
      positive: number;
      neutral: number;
      negative: number;
    };
    successRate: number;
  }> {
    try {
      let documents;

      if (patientId) {
        documents = await this.cosmosService.getPatientMediaByPatientId(
          patientId
        );
      } else {
        // This would require a new method in CosmosService to get all documents
        // For now, return basic stats
        documents = [];
      }

      if (documents.length === 0) {
        return {
          totalProcessed: 0,
          averageProcessingTime: 0,
          sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
          successRate: 0,
        };
      }

      const sentiments = documents.map((doc) => doc.sentiment);
      const stats = this.sentimentService.getSentimentStatistics(sentiments);

      return {
        totalProcessed: documents.length,
        averageProcessingTime: 0, // Would need to store processing times
        sentimentDistribution: {
          positive: stats.positive,
          neutral: stats.neutral,
          negative: stats.negative,
        },
        successRate: 100, // Would need to track failed attempts
      };
    } catch (error) {
      this.logger.error("Failed to get processing statistics:", error);
      throw new Error(`Statistics retrieval failed: ${error.message}`);
    }
  }
}
