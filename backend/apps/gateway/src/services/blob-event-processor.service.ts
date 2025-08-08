import { Injectable, Logger } from "@nestjs/common";
import { ProcessedBlobMetadata } from "../dto/event-grid.dto";
import { MediaProcessingPipelineService } from "./media-processing-pipeline.service";

@Injectable()
export class BlobEventProcessorService {
  private readonly logger = new Logger(BlobEventProcessorService.name);

  // Store processed event IDs to ensure idempotency
  private processedEvents = new Set<string>();

  constructor(
    private readonly pipelineService: MediaProcessingPipelineService
  ) {}

  /**
   * Process uploaded media from blob storage automatically
   */
  async processUploadedMedia(
    blobUrl: string,
    eventId: string,
    eventTime: string,
    subject: string
  ): Promise<{ success: boolean; documentId?: string; error?: string }> {
    try {
      // Check for duplicate events (idempotency)
      if (this.processedEvents.has(eventId)) {
        this.logger.warn(`Event ${eventId} already processed, skipping...`);
        return { success: true };
      }

      this.logger.log(`Processing blob upload: ${blobUrl}`);
      this.logger.log(`Event ID: ${eventId}, Subject: ${subject}`);

      // Parse metadata from blob path and subject
      const metadata = this.parseBlobMetadata(blobUrl, subject, eventTime);

      if (!metadata) {
        throw new Error(
          "Unable to parse blob metadata - invalid file naming convention"
        );
      }

      this.logger.log(`Parsed metadata:`, metadata);

      // Execute the processing pipeline
      const pipelineInput = {
        patientId: metadata.patientId,
        videoUrl: metadata.blobUrl,
        mediaType: metadata.mediaType,
        createdAt: metadata.uploadTimestamp,
      };

      const result = await this.pipelineService.processMedia(pipelineInput);

      // Mark event as processed
      this.processedEvents.add(eventId);

      // Clean up old processed events to prevent memory leak (keep last 1000)
      if (this.processedEvents.size > 1000) {
        const eventsArray = Array.from(this.processedEvents);
        this.processedEvents.clear();
        eventsArray.slice(-500).forEach((id) => this.processedEvents.add(id));
      }

      this.logger.log(
        `Blob processing completed successfully. Document ID: ${result.id}`
      );
      this.logger.log(`Processing time: ${result.processingTimeMs}ms`);
      this.logger.log(
        `Sentiment: ${result.sentiment.label} (confidence: ${result.sentiment.confidence})`
      );

      return {
        success: true,
        documentId: result.id,
      };
    } catch (error) {
      this.logger.error(`Failed to process blob upload: ${blobUrl}`, error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Parse blob metadata from URL and subject
   * Expected naming convention: patient_{patientId}_{mediaType}_{timestamp}.{extension}
   * Example: patient_abc123_video_20250808143000.mp4
   */
  private parseBlobMetadata(
    blobUrl: string,
    subject: string,
    eventTime: string
  ): ProcessedBlobMetadata | null {
    try {
      // Extract container name and blob name from subject
      // Subject format: /blobServices/default/containers/{container}/blobs/{blobname}
      const subjectMatch = subject.match(
        /\/containers\/([^\/]+)\/blobs\/(.+)$/
      );

      if (!subjectMatch) {
        this.logger.error(`Invalid subject format: ${subject}`);
        return null;
      }

      const [, containerName, blobName] = subjectMatch;

      // Parse blob name for metadata
      // Expected: patient_{patientId}_{mediaType}_{timestamp}.{extension}
      const blobNameMatch = blobName.match(
        /^patient_([^_]+)_(audio|video)_(\d{14})\.(mp4|mp3|wav|m4a)$/i
      );

      if (!blobNameMatch) {
        // Fallback: try simpler pattern patient_{patientId}_{mediaType}.{extension}
        const simpleBlobMatch = blobName.match(
          /^patient_([^_]+)_(audio|video)\.(mp4|mp3|wav|m4a)$/i
        );

        if (!simpleBlobMatch) {
          this.logger.error(`Invalid blob naming convention: ${blobName}`);
          this.logger.error(
            "Expected format: patient_{patientId}_{mediaType}_{timestamp}.{extension}"
          );
          this.logger.error("Or: patient_{patientId}_{mediaType}.{extension}");
          return null;
        }

        const [, patientId, mediaType, extension] = simpleBlobMatch;

        return {
          patientId: patientId,
          mediaType: mediaType.toLowerCase() as "audio" | "video",
          uploadTimestamp: eventTime,
          originalFileName: blobName,
          blobUrl: blobUrl,
          containerName: containerName,
        };
      }

      const [, patientId, mediaType, timestamp, extension] = blobNameMatch;

      // Convert timestamp to ISO format if provided
      let uploadTimestamp = eventTime;
      if (timestamp && timestamp.length === 14) {
        // Format: YYYYMMDDHHMMSS -> ISO
        const year = timestamp.substr(0, 4);
        const month = timestamp.substr(4, 2);
        const day = timestamp.substr(6, 2);
        const hour = timestamp.substr(8, 2);
        const minute = timestamp.substr(10, 2);
        const second = timestamp.substr(12, 2);

        uploadTimestamp = `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
      }

      return {
        patientId: patientId,
        mediaType: mediaType.toLowerCase() as "audio" | "video",
        uploadTimestamp: uploadTimestamp,
        originalFileName: blobName,
        blobUrl: blobUrl,
        containerName: containerName,
      };
    } catch (error) {
      this.logger.error("Error parsing blob metadata:", error);
      return null;
    }
  }

  /**
   * Validate Event Grid webhook signature (for security)
   */
  validateEventGridSignature(headers: any, body: string): boolean {
    // In production, you should validate the webhook signature
    // For now, we'll do basic validation
    const eventType = headers["aeg-event-type"];

    if (!eventType) {
      this.logger.warn("Missing aeg-event-type header");
      return false;
    }

    return true;
  }

  /**
   * Get processing statistics for blob events
   */
  async getBlobProcessingStats(): Promise<{
    totalProcessedEvents: number;
    recentProcessingTimes: number[];
    errorRate: number;
  }> {
    // This could be enhanced with persistent storage
    return {
      totalProcessedEvents: this.processedEvents.size,
      recentProcessingTimes: [], // Would track processing times
      errorRate: 0, // Would track error percentage
    };
  }

  /**
   * Health check for blob processing service
   */
  async healthCheck(): Promise<{ status: string; processedEvents: number }> {
    try {
      const pipelineHealth = await this.pipelineService.getHealthStatus();

      return {
        status: pipelineHealth.status === "healthy" ? "healthy" : "degraded",
        processedEvents: this.processedEvents.size,
      };
    } catch (error) {
      this.logger.error("Blob processor health check failed:", error);
      return {
        status: "error",
        processedEvents: this.processedEvents.size,
      };
    }
  }

  /**
   * Clear processed events cache (for testing)
   */
  clearProcessedEvents(): void {
    this.processedEvents.clear();
    this.logger.log("Processed events cache cleared");
  }
}
