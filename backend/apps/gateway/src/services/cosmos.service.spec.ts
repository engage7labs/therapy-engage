import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { CosmosService } from "../services/cosmos.service";

describe("CosmosService", () => {
  let service: CosmosService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CosmosService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case "COSMOSDB_ENDPOINT":
                  return "https://therapyengage-cosmosdb-dev.documents.azure.com:443/";
                case "COSMOSDB_DATABASE_NAME":
                  return "therapyengage";
                case "COSMOSDB_CONTAINER_NAME":
                  return "patient_videos";
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CosmosService>(CosmosService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
