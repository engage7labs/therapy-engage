import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { MediaProcessingPipelineService } from "../services/media-processing-pipeline.service";

@Resolver()
export class MediaPipelineResolver {
  constructor(
    private readonly pipelineService: MediaProcessingPipelineService
  ) {}

  @Mutation(() => String)
  async processPatientMedia(
    @Args("patientId") patientId: string,
    @Args("videoUrl") videoUrl: string,
    @Args("mediaType") mediaType: "audio" | "video",
    @Args("createdAt", { nullable: true }) createdAt?: string
  ): Promise<string> {
    const input = {
      patientId,
      videoUrl,
      mediaType,
      createdAt: createdAt || new Date().toISOString(),
    };

    const result = await this.pipelineService.processMedia(input);

    return JSON.stringify({
      id: result.id,
      patientId: result.patientId,
      transcription: result.transcription,
      sentiment: result.sentiment,
      processingTimeMs: result.processingTimeMs,
      processedAt: result.processedAt,
    });
  }

  @Query(() => String)
  async pipelineHealthCheck(): Promise<string> {
    const health = await this.pipelineService.getHealthStatus();
    return JSON.stringify(health);
  }

  @Query(() => String)
  async processingStatistics(
    @Args("patientId", { nullable: true }) patientId?: string
  ): Promise<string> {
    const stats = await this.pipelineService.getProcessingStatistics(patientId);
    return JSON.stringify(stats);
  }

  @Mutation(() => String)
  async reprocessMedia(
    @Args("patientId") patientId: string,
    @Args("documentId") documentId: string
  ): Promise<string> {
    const result = await this.pipelineService.reprocessMedia(
      patientId,
      documentId
    );

    return JSON.stringify({
      id: result.id,
      patientId: result.patientId,
      transcription: result.transcription,
      sentiment: result.sentiment,
      processingTimeMs: result.processingTimeMs,
      processedAt: result.processedAt,
    });
  }
}
