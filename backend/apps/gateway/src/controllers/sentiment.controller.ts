import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { SentimentAnalysisService } from '../services/sentiment-analysis.service';
import { SentimentResult } from '../interfaces/sentiment-analysis.interface';

export class AnalyzeSentimentDto {
  text: string;
}

@Controller('sentiment')
export class SentimentController {
  constructor(private readonly sentimentService: SentimentAnalysisService) {}

  @Post('analyze')
  async analyzeSentiment(@Body() dto: AnalyzeSentimentDto): Promise<SentimentResult> {
    if (!dto.text || dto.text.trim().length === 0) {
      throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
    }

    if (dto.text.length > 5000) {
      throw new HttpException('Text too long (max 5000 characters)', HttpStatus.BAD_REQUEST);
    }

    return await this.sentimentService.analyze(dto.text);
  }

  @Get('health')
  async getHealth() {
    const status = await this.sentimentService.getHealthStatus();
    
    return {
      status: 'ok',
      providers: status,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('providers')
  async getProviders() {
    const status = await this.sentimentService.getHealthStatus();
    
    const availableProviders = Object.entries(status)
      .filter(([, available]) => available)
      .map(([provider]) => provider);

    return {
      available: availableProviders,
      total: Object.keys(status).length,
      fallback_available: true,
    };
  }
}
