import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { SentimentResult } from "../interfaces/sentiment-analysis.interface";
import { SentimentAnalysisService } from "../services/sentiment-analysis.service";

// GraphQL Types
class SentimentResultType {
  label: string;
  confidence: number;
  score: number;
  summary: string;
  provider: string;
  metadata?: any;
}

class SentimentHealthType {
  dragon: boolean;
  azureOpenAI: boolean;
  openai: boolean;
  fallback: boolean;
}

@Resolver()
export class SentimentResolver {
  constructor(private readonly sentimentService: SentimentAnalysisService) {}

  @Mutation(() => SentimentResultType)
  async analyzeSentiment(@Args("text") text: string): Promise<SentimentResult> {
    if (!text || text.trim().length === 0) {
      throw new Error("Text cannot be empty");
    }

    if (text.length > 5000) {
      throw new Error("Text too long (max 5000 characters)");
    }

    return await this.sentimentService.analyze(text);
  }

  @Query(() => SentimentHealthType)
  async sentimentHealthCheck(): Promise<SentimentHealthType> {
    return await this.sentimentService.getHealthStatus();
  }

  @Query(() => [String])
  async availableSentimentProviders(): Promise<string[]> {
    const status = await this.sentimentService.getHealthStatus();

    return Object.entries(status)
      .filter(([, available]) => available)
      .map(([provider]) => provider);
  }
}
