import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { HttpModule } from "@nestjs/axios";
import { AppResolver, HealthController } from "./app.resolver";
import { WebhookController } from "./controllers/webhook.controller";
import { SentimentController } from "./controllers/sentiment.controller";
import { MediaPipelineResolver } from "./resolvers/media-pipeline.resolver";
import { MediaResolver } from "./resolvers/media.resolver";
import { SentimentResolver } from "./resolvers/sentiment.resolver";
import { BlobEventProcessorService } from "./services/blob-event-processor.service";
import { CosmosService } from "./services/cosmos.service";
import { MediaProcessingPipelineService } from "./services/media-processing-pipeline.service";
import { SentimentService } from "./services/sentiment.service";
import { SentimentAnalysisService } from "./services/sentiment-analysis.service";
import { TranscriptionService } from "./services/transcription.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    HttpModule,
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
  controllers: [HealthController, WebhookController, SentimentController],
  providers: [
    AppResolver,
    MediaResolver,
    MediaPipelineResolver,
    SentimentResolver,
    CosmosService,
    TranscriptionService,
    SentimentService,
    SentimentAnalysisService,
    MediaProcessingPipelineService,
    BlobEventProcessorService,
  ],
})
export class AppModule {}
