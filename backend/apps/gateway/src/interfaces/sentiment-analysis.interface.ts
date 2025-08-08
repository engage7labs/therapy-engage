export interface SentimentResult {
  label: "POSITIVO" | "NEGATIVO" | "NEUTRO";
  confidence: number; // 0-1
  score: number; // -1 to 1
  summary: string;
  provider: "dragon" | "azure-openai" | "openai" | "fallback";
  metadata?: {
    model?: string;
    processingTime?: number;
    rawResponse?: any;
    positiveMatches?: number;
    negativeMatches?: number;
  };
}

export interface SentimentAnalysisConfig {
  dragonApiKey?: string;
  azureOpenAIEndpoint?: string;
  azureOpenAIApiKey?: string;
  azureOpenAIDeployment?: string;
  azureOpenAIApiVersion?: string;
  openaiApiKey?: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface DragonSentimentResponse {
  sentiment: string;
  confidence: number;
  score: number;
  summary: string;
}

export interface OpenAISentimentResponse {
  label: string;
  confidence: number;
  summary: string;
}

export interface AzureOpenAISentimentResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
