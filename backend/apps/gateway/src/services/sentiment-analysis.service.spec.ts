import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { SentimentAnalysisService } from "./sentiment-analysis.service";

describe("SentimentAnalysisService", () => {
  let service: SentimentAnalysisService;
  let configService: ConfigService;
  let httpService: HttpService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config = {
        DRAGON_API_KEY: undefined,
        AZURE_OPENAI_ENDPOINT: undefined,
        AZURE_OPENAI_API_KEY: undefined,
        AZURE_OPENAI_DEPLOYMENT: "gpt-4",
        AZURE_OPENAI_API_VERSION: "2024-02-15-preview",
        OPENAI_API_KEY: undefined,
        SENTIMENT_TIMEOUT: 30000,
        SENTIMENT_RETRY_ATTEMPTS: 2,
      };
      return config[key] ?? defaultValue;
    }),
  };

  const mockHttpService = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentimentAnalysisService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<SentimentAnalysisService>(SentimentAnalysisService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("analyze", () => {
    it("should throw error for empty text", async () => {
      await expect(service.analyze("")).rejects.toThrow("Text cannot be empty");
    });

    it("should use fallback when no providers are configured", async () => {
      const text = "Hoje me sinto muito melhor e mais feliz";
      const result = await service.analyze(text);

      expect(result).toMatchObject({
        label: "POSITIVO",
        provider: "fallback",
        summary: expect.stringContaining("palavras-chave"),
      });
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.score).toBeGreaterThan(0);
    });

    it("should use fallback for negative sentiment", async () => {
      const text = "Estou muito triste e deprimido, tudo está ruim";
      const result = await service.analyze(text);

      expect(result).toMatchObject({
        label: "NEGATIVO",
        provider: "fallback",
      });
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.score).toBeLessThan(0);
    });

    it("should use fallback for neutral sentiment", async () => {
      const text = "Hoje é segunda-feira e vou trabalhar";
      const result = await service.analyze(text);

      expect(result).toMatchObject({
        label: "NEUTRO",
        provider: "fallback",
      });
      expect(result.score).toBe(0);
    });
  });

  describe("getHealthStatus", () => {
    it("should return health status for all providers", async () => {
      const status = await service.getHealthStatus();

      expect(status).toEqual({
        dragon: false,
        azureOpenAI: false,
        openai: false,
        fallback: true,
      });
    });
  });

  describe("with Azure OpenAI configured", () => {
    beforeEach(() => {
      mockConfigService.get.mockImplementation(
        (key: string, defaultValue?: any) => {
          const config = {
            DRAGON_API_KEY: undefined,
            AZURE_OPENAI_ENDPOINT: "https://test.openai.azure.com/",
            AZURE_OPENAI_API_KEY: "test-key",
            AZURE_OPENAI_DEPLOYMENT: "gpt-4",
            AZURE_OPENAI_API_VERSION: "2024-02-15-preview",
            OPENAI_API_KEY: undefined,
            SENTIMENT_TIMEOUT: 30000,
            SENTIMENT_RETRY_ATTEMPTS: 2,
          };
          return config[key] ?? defaultValue;
        }
      );
    });

    it("should show Azure OpenAI as available in health check", async () => {
      // Recreate service with new config
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SentimentAnalysisService,
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
          {
            provide: HttpService,
            useValue: mockHttpService,
          },
        ],
      }).compile();

      service = module.get<SentimentAnalysisService>(SentimentAnalysisService);

      const status = await service.getHealthStatus();

      expect(status).toEqual({
        dragon: false,
        azureOpenAI: true,
        openai: false,
        fallback: true,
      });
    });

    it("should try Azure OpenAI and fallback to local on error", async () => {
      // Mock Azure OpenAI failure
      mockHttpService.post.mockReturnValue(
        of({
          data: {
            error: "API Error",
          },
        })
      );

      // Recreate service with new config
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SentimentAnalysisService,
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
          {
            provide: HttpService,
            useValue: mockHttpService,
          },
        ],
      }).compile();

      service = module.get<SentimentAnalysisService>(SentimentAnalysisService);

      const text = "Teste de fallback";
      const result = await service.analyze(text);

      // Should fallback to local analysis
      expect(result.provider).toBe("fallback");
    });
  });

  describe("normalizeSentimentLabel", () => {
    it("should normalize different label formats", () => {
      // Test via the private method exposed through analyze
      expect(service["normalizeSentimentLabel"]("POSITIVE")).toBe("POSITIVO");
      expect(service["normalizeSentimentLabel"]("positive")).toBe("POSITIVO");
      expect(service["normalizeSentimentLabel"]("NEGATIVE")).toBe("NEGATIVO");
      expect(service["normalizeSentimentLabel"]("negative")).toBe("NEGATIVO");
      expect(service["normalizeSentimentLabel"]("NEUTRAL")).toBe("NEUTRO");
      expect(service["normalizeSentimentLabel"]("anything")).toBe("NEUTRO");
    });
  });

  describe("calculateScoreFromLabel", () => {
    it("should calculate appropriate scores for labels", () => {
      expect(service["calculateScoreFromLabel"]("POSITIVO")).toBe(0.6);
      expect(service["calculateScoreFromLabel"]("NEGATIVO")).toBe(-0.6);
      expect(service["calculateScoreFromLabel"]("NEUTRO")).toBe(0.0);
    });
  });
});
