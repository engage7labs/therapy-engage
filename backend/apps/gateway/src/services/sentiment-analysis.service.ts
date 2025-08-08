import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout, retry } from 'rxjs';
import {
  SentimentResult,
  SentimentAnalysisConfig,
  DragonSentimentResponse,
  OpenAISentimentResponse,
  AzureOpenAISentimentResponse,
} from '../interfaces/sentiment-analysis.interface';

@Injectable()
export class SentimentAnalysisService {
  private readonly logger = new Logger(SentimentAnalysisService.name);
  private readonly config: SentimentAnalysisConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.config = {
      dragonApiKey: this.configService.get<string>('DRAGON_API_KEY'),
      azureOpenAIEndpoint: this.configService.get<string>('AZURE_OPENAI_ENDPOINT'),
      azureOpenAIApiKey: this.configService.get<string>('AZURE_OPENAI_API_KEY'),
      azureOpenAIDeployment: this.configService.get<string>('AZURE_OPENAI_DEPLOYMENT', 'gpt-4'),
      azureOpenAIApiVersion: this.configService.get<string>('AZURE_OPENAI_API_VERSION', '2024-02-15-preview'),
      openaiApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      timeout: this.configService.get<number>('SENTIMENT_TIMEOUT', 30000),
      retryAttempts: this.configService.get<number>('SENTIMENT_RETRY_ATTEMPTS', 2),
    };

    this.logger.log('SentimentAnalysisService initialized');
    this.logAvailableProviders();
  }

  /**
   * Analyzes sentiment using fallback strategy:
   * 1. Dragon API (if available)
   * 2. Azure OpenAI (if available)
   * 3. OpenAI.com (if available)
   * 4. Fallback (basic keyword analysis)
   */
  async analyze(text: string): Promise<SentimentResult> {
    const startTime = Date.now();
    
    if (!text || text.trim().length === 0) {
      throw new HttpException('Text cannot be empty', HttpStatus.BAD_REQUEST);
    }

    this.logger.debug(`Analyzing sentiment for text: ${text.substring(0, 100)}...`);

    try {
      // Strategy 1: Dragon API
      if (this.config.dragonApiKey) {
        this.logger.debug('Attempting sentiment analysis with Dragon API');
        try {
          const result = await this.analyzeWithDragon(text);
          result.metadata = { 
            ...result.metadata, 
            processingTime: Date.now() - startTime 
          };
          return result;
        } catch (error) {
          this.logger.warn(`Dragon API failed: ${error.message}`);
        }
      }

      // Strategy 2: Azure OpenAI
      if (this.config.azureOpenAIEndpoint && this.config.azureOpenAIApiKey) {
        this.logger.debug('Attempting sentiment analysis with Azure OpenAI');
        try {
          const result = await this.analyzeWithAzureOpenAI(text);
          result.metadata = { 
            ...result.metadata, 
            processingTime: Date.now() - startTime 
          };
          return result;
        } catch (error) {
          this.logger.warn(`Azure OpenAI failed: ${error.message}`);
        }
      }

      // Strategy 3: OpenAI.com
      if (this.config.openaiApiKey) {
        this.logger.debug('Attempting sentiment analysis with OpenAI.com');
        try {
          const result = await this.analyzeWithOpenAI(text);
          result.metadata = { 
            ...result.metadata, 
            processingTime: Date.now() - startTime 
          };
          return result;
        } catch (error) {
          this.logger.warn(`OpenAI.com failed: ${error.message}`);
        }
      }

      // Strategy 4: Fallback
      this.logger.warn('All AI providers failed, using fallback analysis');
      const result = this.analyzeWithFallback(text);
      result.metadata = { 
        ...result.metadata, 
        processingTime: Date.now() - startTime 
      };
      return result;

    } catch (error) {
      this.logger.error(`Sentiment analysis failed completely: ${error.message}`, error.stack);
      throw new HttpException(
        'Sentiment analysis service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private async analyzeWithDragon(text: string): Promise<SentimentResult> {
    const url = 'https://api.dragon-sentiment.com/v1/analyze'; // Placeholder URL
    
    const response = await firstValueFrom(
      this.httpService
        .post<DragonSentimentResponse>(url, {
          text,
          language: 'pt-BR',
        }, {
          headers: {
            'Authorization': `Bearer ${this.config.dragonApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: this.config.timeout,
        })
        .pipe(
          timeout(this.config.timeout),
          retry(this.config.retryAttempts),
        ),
    );

    const data = response.data;
    
    return {
      label: this.normalizeSentimentLabel(data.sentiment),
      confidence: data.confidence,
      score: data.score,
      summary: data.summary,
      provider: 'dragon',
      metadata: {
        model: 'dragon-v1',
        rawResponse: data,
      },
    };
  }

  private async analyzeWithAzureOpenAI(text: string): Promise<SentimentResult> {
    const url = `${this.config.azureOpenAIEndpoint}openai/deployments/${this.config.azureOpenAIDeployment}/chat/completions?api-version=${this.config.azureOpenAIApiVersion}`;
    
    const prompt = this.buildSentimentPrompt(text);
    
    const response = await firstValueFrom(
      this.httpService
        .post<AzureOpenAISentimentResponse>(url, {
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em análise de sentimentos para contexto clínico de terapia. Responda sempre em formato JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 200,
          temperature: 0.1,
          response_format: { type: 'json_object' },
        }, {
          headers: {
            'api-key': this.config.azureOpenAIApiKey,
            'Content-Type': 'application/json',
          },
          timeout: this.config.timeout,
        })
        .pipe(
          timeout(this.config.timeout),
          retry(this.config.retryAttempts),
        ),
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content from Azure OpenAI');
    }

    const parsedResult = JSON.parse(content) as OpenAISentimentResponse;
    
    return {
      label: this.normalizeSentimentLabel(parsedResult.label),
      confidence: parsedResult.confidence,
      score: this.calculateScoreFromLabel(parsedResult.label),
      summary: parsedResult.summary,
      provider: 'azure-openai',
      metadata: {
        model: this.config.azureOpenAIDeployment,
        rawResponse: response.data,
      },
    };
  }

  private async analyzeWithOpenAI(text: string): Promise<SentimentResult> {
    const url = 'https://api.openai.com/v1/chat/completions';
    
    const prompt = this.buildSentimentPrompt(text);
    
    const response = await firstValueFrom(
      this.httpService
        .post<AzureOpenAISentimentResponse>(url, {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em análise de sentimentos para contexto clínico de terapia. Responda sempre em formato JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 200,
          temperature: 0.1,
          response_format: { type: 'json_object' },
        }, {
          headers: {
            'Authorization': `Bearer ${this.config.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: this.config.timeout,
        })
        .pipe(
          timeout(this.config.timeout),
          retry(this.config.retryAttempts),
        ),
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    const parsedResult = JSON.parse(content) as OpenAISentimentResponse;
    
    return {
      label: this.normalizeSentimentLabel(parsedResult.label),
      confidence: parsedResult.confidence,
      score: this.calculateScoreFromLabel(parsedResult.label),
      summary: parsedResult.summary,
      provider: 'openai',
      metadata: {
        model: 'gpt-4o-mini',
        rawResponse: response.data,
      },
    };
  }

  private analyzeWithFallback(text: string): SentimentResult {
    const lowerText = text.toLowerCase();
    
    // Palavras-chave positivas
    const positiveKeywords = [
      'melhor', 'bom', 'ótimo', 'feliz', 'alegre', 'otimista', 'progresso',
      'melhora', 'confiante', 'esperança', 'sucesso', 'conquista', 'vitória',
      'satisfeito', 'grato', 'tranquilo', 'calmo', 'estável'
    ];
    
    // Palavras-chave negativas
    const negativeKeywords = [
      'pior', 'ruim', 'péssimo', 'triste', 'deprimido', 'ansioso', 'preocupado',
      'medo', 'pânico', 'angústia', 'sofrimento', 'dor', 'dificuldade',
      'problema', 'crise', 'desespero', 'frustração', 'raiva', 'irritado'
    ];

    let positiveScore = 0;
    let negativeScore = 0;

    positiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        positiveScore++;
      }
    });

    negativeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        negativeScore++;
      }
    });

    let label: 'POSITIVO' | 'NEGATIVO' | 'NEUTRO';
    let score: number;
    let confidence: number;
    
    if (positiveScore > negativeScore) {
      label = 'POSITIVO';
      score = Math.min(0.8, (positiveScore - negativeScore) * 0.2);
      confidence = Math.min(0.7, positiveScore * 0.15);
    } else if (negativeScore > positiveScore) {
      label = 'NEGATIVO';
      score = Math.max(-0.8, -(negativeScore - positiveScore) * 0.2);
      confidence = Math.min(0.7, negativeScore * 0.15);
    } else {
      label = 'NEUTRO';
      score = 0;
      confidence = 0.5;
    }

    return {
      label,
      confidence: Math.max(0.3, confidence), // Mínimo de confiança
      score,
      summary: `Análise baseada em palavras-chave: ${positiveScore} indicadores positivos, ${negativeScore} indicadores negativos`,
      provider: 'fallback',
      metadata: {
        model: 'keyword-analysis',
        positiveMatches: positiveScore,
        negativeMatches: negativeScore,
      },
    };
  }

  private buildSentimentPrompt(text: string): string {
    return `Classifique o sentimento deste relato clínico de um paciente em terapia:

"${text}"

Responda APENAS com um JSON no seguinte formato:
{
  "label": "POSITIVO" | "NEGATIVO" | "NEUTRO",
  "confidence": [número entre 0 e 1],
  "summary": "[resumo da análise em português]"
}

Critérios:
- POSITIVO: Indica melhora, otimismo, progresso, sentimentos positivos
- NEGATIVO: Indica piora, pessimismo, retrocesso, sofrimento, sintomas
- NEUTRO: Estado estável, relato factual sem indicadores emocionais claros
- confidence: 0.8-1.0 (muito confiante), 0.6-0.8 (confiante), 0.4-0.6 (moderado), 0.2-0.4 (baixo)
- summary: Explique brevemente por que classificou assim, focando nos indicadores encontrados`;
  }

  private normalizeSentimentLabel(label: string): 'POSITIVO' | 'NEGATIVO' | 'NEUTRO' {
    const normalized = label.toUpperCase();
    
    if (['POSITIVO', 'POSITIVE', 'POS'].includes(normalized)) {
      return 'POSITIVO';
    } else if (['NEGATIVO', 'NEGATIVE', 'NEG'].includes(normalized)) {
      return 'NEGATIVO';
    } else {
      return 'NEUTRO';
    }
  }

  private calculateScoreFromLabel(label: string): number {
    const normalized = this.normalizeSentimentLabel(label);
    
    switch (normalized) {
      case 'POSITIVO':
        return 0.6; // Valor padrão positivo
      case 'NEGATIVO':
        return -0.6; // Valor padrão negativo
      case 'NEUTRO':
      default:
        return 0.0; // Neutro
    }
  }

  private logAvailableProviders(): void {
    const providers = [];
    
    if (this.config.dragonApiKey) providers.push('Dragon API');
    if (this.config.azureOpenAIEndpoint && this.config.azureOpenAIApiKey) providers.push('Azure OpenAI');
    if (this.config.openaiApiKey) providers.push('OpenAI.com');
    
    if (providers.length === 0) {
      this.logger.warn('No AI providers configured, will use fallback analysis only');
    } else {
      this.logger.log(`Available sentiment analysis providers: ${providers.join(', ')}`);
    }
  }

  /**
   * Health check method to verify provider availability
   */
  async getHealthStatus(): Promise<{
    dragon: boolean;
    azureOpenAI: boolean;
    openai: boolean;
    fallback: boolean;
  }> {
    return {
      dragon: !!this.config.dragonApiKey,
      azureOpenAI: !!(this.config.azureOpenAIEndpoint && this.config.azureOpenAIApiKey),
      openai: !!this.config.openaiApiKey,
      fallback: true, // Always available
    };
  }
}
