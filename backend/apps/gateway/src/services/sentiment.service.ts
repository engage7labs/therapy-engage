import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

export interface SentimentResult {
  label: "POSITIVO" | "NEUTRO" | "NEGATIVO";
  confidence: number; // 0.0 - 1.0
  summary: string;
}

@Injectable()
export class SentimentService {
  private readonly logger = new Logger(SentimentService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("OPENAI_API_KEY");
    const baseURL = this.configService.get<string>("AZURE_OPENAI_ENDPOINT");

    if (!apiKey) {
      this.logger.warn(
        "OpenAI API key not configured - sentiment analysis will not work"
      );
      return;
    }

    // Configure for Azure OpenAI or standard OpenAI
    if (baseURL) {
      this.openai = new OpenAI({
        apiKey,
        baseURL: `${baseURL}/openai/deployments/gpt-4o`,
        defaultQuery: { "api-version": "2024-06-01" },
        defaultHeaders: {
          "api-key": apiKey,
        },
      });
      this.logger.log("Configured Azure OpenAI for sentiment analysis");
    } else {
      this.openai = new OpenAI({ apiKey });
      this.logger.log("Configured standard OpenAI for sentiment analysis");
    }
  }

  /**
   * Analyze sentiment of transcribed text in clinical context
   */
  async analyzeSentiment(transcription: string): Promise<SentimentResult> {
    if (!this.openai) {
      throw new Error(
        "OpenAI not configured - cannot perform sentiment analysis"
      );
    }

    this.logger.log("Starting sentiment analysis...");

    const prompt = `Classifique o sentimento deste relato transcrito em contexto clínico de terapia:

"${transcription}"

Analise considerando:
- Tom emocional geral do paciente
- Indicadores de melhora ou piora no estado mental
- Expressões de esperança, desesperança, ansiedade, depressão
- Contexto terapêutico e clínico

Responda APENAS como JSON válido:
{
  "label": "POSITIVO" | "NEUTRO" | "NEGATIVO",
  "confidence": 0.0-1.0,
  "summary": "Resumo clínico da justificativa do sentimento em até 100 palavras."
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista em análise de sentimento para contextos clínicos de psicologia e terapia. Sempre responda com JSON válido.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent results
        max_tokens: 500,
        response_format: { type: "json_object" },
      });

      const result = response.choices[0]?.message?.content;

      if (!result) {
        throw new Error("Empty response from OpenAI");
      }

      // Parse and validate JSON response
      const parsedResult = JSON.parse(result);

      // Validate required fields
      if (
        !parsedResult.label ||
        !parsedResult.confidence ||
        !parsedResult.summary
      ) {
        throw new Error("Invalid response format from OpenAI");
      }

      // Validate label values
      if (!["POSITIVO", "NEUTRO", "NEGATIVO"].includes(parsedResult.label)) {
        throw new Error("Invalid sentiment label from OpenAI");
      }

      // Validate confidence range
      const confidence = parseFloat(parsedResult.confidence);
      if (isNaN(confidence) || confidence < 0 || confidence > 1) {
        throw new Error("Invalid confidence score from OpenAI");
      }

      const sentimentResult: SentimentResult = {
        label: parsedResult.label,
        confidence,
        summary: parsedResult.summary.substring(0, 200), // Limit summary length
      };

      this.logger.log(
        `Sentiment analysis completed: ${sentimentResult.label} (${sentimentResult.confidence})`
      );

      return sentimentResult;
    } catch (error) {
      this.logger.error("Sentiment analysis failed", error);

      // Return fallback result for parsing errors
      if (error.message.includes("JSON")) {
        return {
          label: "NEUTRO",
          confidence: 0.5,
          summary:
            "Análise automática falhou - requer revisão manual do terapeuta.",
        };
      }

      throw new Error(`Sentiment analysis failed: ${error.message}`);
    }
  }

  /**
   * Batch sentiment analysis for multiple transcriptions
   */
  async analyzeBatchSentiment(
    transcriptions: string[]
  ): Promise<SentimentResult[]> {
    const results: SentimentResult[] = [];

    for (const transcription of transcriptions) {
      try {
        const result = await this.analyzeSentiment(transcription);
        results.push(result);

        // Add small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        this.logger.error(
          `Batch sentiment analysis failed for transcription: ${transcription.substring(
            0,
            50
          )}...`,
          error
        );

        // Add fallback result
        results.push({
          label: "NEUTRO",
          confidence: 0.0,
          summary: "Análise falhou - requer revisão manual.",
        });
      }
    }

    return results;
  }

  /**
   * Health check for sentiment analysis service
   */
  async healthCheck(): Promise<{ status: string; model: string }> {
    if (!this.openai) {
      return { status: "unavailable", model: "none" };
    }

    try {
      // Test with a simple sentiment analysis
      const testResult = await this.analyzeSentiment(
        "Estou me sentindo bem hoje."
      );

      return {
        status: "healthy",
        model: "gpt-4o",
      };
    } catch (error) {
      this.logger.error("Sentiment service health check failed", error);
      return {
        status: "error",
        model: "gpt-4o",
      };
    }
  }

  /**
   * Get sentiment statistics for a list of results
   */
  getSentimentStatistics(sentiments: SentimentResult[]): {
    positive: number;
    neutral: number;
    negative: number;
    averageConfidence: number;
    total: number;
  } {
    const stats = {
      positive: 0,
      neutral: 0,
      negative: 0,
      averageConfidence: 0,
      total: sentiments.length,
    };

    if (sentiments.length === 0) {
      return stats;
    }

    let totalConfidence = 0;

    sentiments.forEach((sentiment) => {
      switch (sentiment.label) {
        case "POSITIVO":
          stats.positive++;
          break;
        case "NEUTRO":
          stats.neutral++;
          break;
        case "NEGATIVO":
          stats.negative++;
          break;
      }
      totalConfidence += sentiment.confidence;
    });

    stats.averageConfidence = totalConfidence / sentiments.length;

    return stats;
  }
}
