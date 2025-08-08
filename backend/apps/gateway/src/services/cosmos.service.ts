import { Container, CosmosClient, Database } from "@azure/cosmos";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UploadMediaDto } from "../dto/upload-media.dto";

@Injectable()
export class CosmosService {
  private readonly logger = new Logger(CosmosService.name);
  private client: CosmosClient;
  private database: Database;
  private container: Container;

  constructor(private configService: ConfigService) {
    this.initializeCosmosClient();
  }

  private async initializeCosmosClient() {
    try {
      const endpoint = this.configService.get<string>("COSMOSDB_ENDPOINT");
      const key = this.configService.get<string>("COSMOSDB_KEY");
      const databaseName = this.configService.get<string>(
        "COSMOSDB_DATABASE_NAME"
      );
      const containerName = this.configService.get<string>(
        "COSMOSDB_CONTAINER_NAME"
      );

      if (!endpoint) {
        throw new Error("COSMOSDB_ENDPOINT environment variable is required");
      }

      // Initialize client with endpoint only for managed identity or key-based auth
      this.client = new CosmosClient({
        endpoint,
        key, // Will be undefined if using managed identity
      });

      this.database = this.client.database(databaseName || "therapyengage");
      this.container = this.database.container(
        containerName || "patient_videos"
      );

      this.logger.log("CosmosDB client initialized successfully");
    } catch (error) {
      this.logger.error("Failed to initialize CosmosDB client", error);
      throw error;
    }
  }

  async savePatientMedia(data: UploadMediaDto): Promise<string> {
    try {
      const document = {
        id: `${data.patientId}-${Date.now()}`, // Unique ID for the document
        patientId: data.patientId,
        videoUrl: data.videoUrl,
        mediaType: data.mediaType,
        transcription: data.transcription,
        sentiment: {
          label: data.sentiment.label,
          confidence: data.sentiment.confidence,
          summary: data.sentiment.summary,
        },
        createdAt: data.createdAt,
        _ts: Math.floor(Date.now() / 1000), // Timestamp for CosmosDB
      };

      const { resource } = await this.container.items.create(document);

      this.logger.log(
        `Patient media saved successfully with ID: ${resource?.id}`
      );

      return resource?.id || document.id;
    } catch (error) {
      this.logger.error("Failed to save patient media to CosmosDB", error);
      throw new Error("Failed to save patient media data");
    }
  }

  async getPatientMediaByPatientId(patientId: string): Promise<any[]> {
    try {
      const query = {
        query:
          "SELECT * FROM c WHERE c.patientId = @patientId ORDER BY c._ts DESC",
        parameters: [
          {
            name: "@patientId",
            value: patientId,
          },
        ],
      };

      const { resources } = await this.container.items.query(query).fetchAll();

      this.logger.log(
        `Retrieved ${resources.length} media records for patient: ${patientId}`
      );
      return resources;
    } catch (error) {
      this.logger.error(
        "Failed to retrieve patient media from CosmosDB",
        error
      );
      throw new Error("Failed to retrieve patient media data");
    }
  }

  async healthCheck(): Promise<{ status: string; database: string }> {
    try {
      // Simple health check by attempting to read database info
      await this.database.read();
      const databaseName =
        this.configService.get<string>("COSMOSDB_DATABASE_NAME") ||
        "therapyengage";

      return {
        status: "connected",
        database: databaseName,
      };
    } catch (error) {
      this.logger.error("CosmosDB health check failed", error);
      return {
        status: "error",
        database: "unknown",
      };
    }
  }
}
