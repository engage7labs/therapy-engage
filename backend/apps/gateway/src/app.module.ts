import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { AppResolver, HealthController } from "./app.resolver";
import { WebhookController } from "./controllers/webhook.controller";
import { MediaPipelineResolver } from "./resolvers/media-pipeline.resolver";
import { MediaResolver } from "./resolvers/media.resolver";
import { BlobEventProcessorService } from "./services/blob-event-processor.service";
import { CosmosService } from "./services/cosmos.service";
import { MediaProcessingPipelineService } from "./services/media-processing-pipeline.service";
import { SentimentService } from "./services/sentiment.service";
import { TranscriptionService } from "./services/transcription.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: "/graphql",
      csrfPrevention: false,
      introspection: true,
      playground: true,
      // Remove CORS here - it's handled by main.ts app.enableCors()
    }),
  ],
  controllers: [HealthController, WebhookController],
  providers: [
    AppResolver,
    MediaResolver,
    MediaPipelineResolver,
    CosmosService,
    TranscriptionService,
    SentimentService,
    MediaProcessingPipelineService,
    BlobEventProcessorService,
  ],
})
export class AppModule {}
