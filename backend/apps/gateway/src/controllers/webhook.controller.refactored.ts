import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from "@nestjs/common";
import { BlobEventProcessorService } from "../services/blob-event-processor.service";

interface BlobEvent {
  id: string;
  eventType: string;
  subject: string;
  eventTime: string;
  data: {
    url: string;
    api: string;
    contentType: string;
    contentLength: number;
  };
}

interface ValidationEvent {
  eventType: string;
  data: {
    validationCode: string;
  };
}

interface ProcessingResult {
  eventId: string;
  blobUrl?: string;
  result?: any;
  error?: string;
}

@Controller("webhook")
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly blobEventProcessor: BlobEventProcessorService) {}

  @Post("blob-event")
  @HttpCode(HttpStatus.OK)
  async handleBlobCreated(
    @Body() body: any,
    @Headers() headers: any
  ): Promise<any> {
    try {
      this.logger.log("Received webhook request");
      this.logRequestDetails(headers, body);

      if (!this.validateEventGridSignature(headers, body)) {
        return { error: "Invalid signature" };
      }

      const eventType = headers["aeg-event-type"];

      if (eventType === "SubscriptionValidation") {
        return this.handleValidationHandshake(body);
      }

      if (eventType === "Notification") {
        return await this.handleNotificationEvents(body);
      }

      this.logger.warn(`Unknown event type: ${eventType}`);
      return { message: "Event received but not processed", eventType };
    } catch (error) {
      this.logger.error("Error handling webhook:", error);
      return {
        error: "Internal server error",
        details: error.message,
      };
    }
  }

  @Post("test-blob-processing")
  @HttpCode(HttpStatus.OK)
  async testBlobProcessing(
    @Body() body: { blobUrl: string; patientId?: string; mediaType?: string }
  ): Promise<any> {
    try {
      this.logger.log("Testing blob processing manually");

      const testData = this.createTestEventData(body);
      const result = await this.blobEventProcessor.processUploadedMedia(
        body.blobUrl,
        testData.eventId,
        testData.eventTime,
        testData.subject
      );

      return {
        message: "Test processing completed",
        result: result,
      };
    } catch (error) {
      this.logger.error("Error in test processing:", error);
      return {
        error: "Test processing failed",
        details: error.message,
      };
    }
  }

  private logRequestDetails(headers: any, body: any): void {
    this.logger.log("Headers:", JSON.stringify(headers, null, 2));
    this.logger.log("Body:", JSON.stringify(body, null, 2));
  }

  private validateEventGridSignature(headers: any, body: any): boolean {
    const isValid = this.blobEventProcessor.validateEventGridSignature(
      headers,
      JSON.stringify(body)
    );
    if (!isValid) {
      this.logger.error("Invalid Event Grid signature");
    }
    return isValid;
  }

  private handleValidationHandshake(body: any): any {
    this.logger.log("Handling Event Grid subscription validation");

    if (!this.isValidValidationEvent(body)) {
      this.logger.error("Invalid validation event format");
      return { error: "Invalid validation format" };
    }

    const validationCode = body[0].data.validationCode;
    this.logger.log(`Validation code: ${validationCode}`);

    return {
      validationResponse: validationCode,
    };
  }

  private isValidValidationEvent(body: any): boolean {
    return (
      Array.isArray(body) &&
      body.length > 0 &&
      body[0].eventType === "Microsoft.EventGrid.SubscriptionValidationEvent"
    );
  }

  private async handleNotificationEvents(body: any): Promise<any> {
    this.logger.log("Processing Event Grid notification");

    if (!Array.isArray(body)) {
      this.logger.error("Expected array of events");
      return { error: "Invalid event format" };
    }

    const results: ProcessingResult[] = [];

    for (const event of body) {
      const result = await this.processingleEvent(event);
      if (result) {
        results.push(result);
      }
    }

    this.logger.log(`Processed ${results.length} events`);
    return {
      message: `Processed ${results.length} events`,
      results: results,
    };
  }

  private async processingleEvent(
    event: BlobEvent
  ): Promise<ProcessingResult | null> {
    try {
      if (!this.isBlobCreatedEvent(event)) {
        this.logger.log(`Skipping non-blob-created event: ${event.eventType}`);
        return null;
      }

      this.logger.log(`Processing blob created event: ${event.id}`);

      if (!this.shouldProcessBlob(event)) {
        return null;
      }

      const result = await this.blobEventProcessor.processUploadedMedia(
        event.data.url,
        event.id,
        event.eventTime,
        event.subject
      );

      this.logProcessingResult(event.data.url, result);

      return {
        eventId: event.id,
        blobUrl: event.data.url,
        result: result,
      };
    } catch (error) {
      this.logger.error(`Error processing event ${event.id}:`, error);
      return {
        eventId: event.id,
        error: error.message,
      };
    }
  }

  private isBlobCreatedEvent(event: BlobEvent): boolean {
    return event.eventType === "Microsoft.Storage.BlobCreated";
  }

  private shouldProcessBlob(event: BlobEvent): boolean {
    if (!this.isPatientUpload(event.subject)) {
      this.logger.log(`Skipping non-patient upload: ${event.subject}`);
      return false;
    }

    if (!this.isMediaFile(event.data.url)) {
      this.logger.log(`Skipping non-media file: ${event.data.url}`);
      return false;
    }

    return true;
  }

  private isPatientUpload(subject: string): boolean {
    return (
      subject.includes("/containers/patient-uploads/") ||
      subject.includes("/containers/uploads/")
    );
  }

  private isMediaFile(blobUrl: string): boolean {
    return /\.(mp4|mp3|wav|m4a|avi|mov|wmv|flv)$/i.test(blobUrl);
  }

  private logProcessingResult(blobUrl: string, result: any): void {
    if (result.success) {
      this.logger.log(`Successfully processed blob: ${blobUrl}`);
    } else {
      this.logger.error(`Failed to process blob: ${blobUrl} - ${result.error}`);
    }
  }

  private createTestEventData(body: {
    patientId?: string;
    mediaType?: string;
  }) {
    return {
      eventId: `test-${Date.now()}`,
      eventTime: new Date().toISOString(),
      subject: `/blobServices/default/containers/patient-uploads/blobs/test_${
        body.patientId || "test123"
      }_${body.mediaType || "video"}.mp4`,
    };
  }
}
