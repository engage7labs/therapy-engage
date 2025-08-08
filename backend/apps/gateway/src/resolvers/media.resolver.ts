import { Logger } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UploadMediaDto } from "../dto/upload-media.dto";
import { CosmosService } from "../services/cosmos.service";

@Resolver()
export class MediaResolver {
  private readonly logger = new Logger(MediaResolver.name);

  constructor(private readonly cosmosService: CosmosService) {}

  @Mutation(() => Boolean)
  async uploadMedia(@Args("input") input: UploadMediaDto): Promise<boolean> {
    try {
      this.logger.log(`Uploading media for patient: ${input.patientId}`);
      await this.cosmosService.savePatientMedia(input);
      this.logger.log(
        `Media uploaded successfully for patient: ${input.patientId}`
      );
      return true;
    } catch (error) {
      this.logger.error("Failed to upload media", error);
      throw new Error("Failed to upload media");
    }
  }

  @Query(() => Boolean)
  async cosmosHealthCheck(): Promise<boolean> {
    try {
      const healthResult = await this.cosmosService.healthCheck();
      const isHealthy = healthResult.status === "connected";
      this.logger.log(`CosmosDB health check result: ${isHealthy}`);
      return isHealthy;
    } catch (error) {
      this.logger.error("CosmosDB health check failed", error);
      return false;
    }
  }
}
