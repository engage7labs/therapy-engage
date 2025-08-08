import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import * as FormData from "form-data";
import * as fs from "fs";
import * as path from "path";

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  language?: string;
  duration?: number;
}

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Main transcription method - tries Dragon first, falls back to Whisper
   */
  async transcribeMedia(
    mediaUrl: string,
    mediaType: "audio" | "video"
  ): Promise<TranscriptionResult> {
    this.logger.log(`Starting transcription for ${mediaType}: ${mediaUrl}`);

    try {
      // Try Dragon API first (if configured)
      const dragonApiKey = this.configService.get<string>("DRAGON_API_KEY");
      const dragonEndpoint = this.configService.get<string>(
        "DRAGON_API_ENDPOINT"
      );

      if (dragonApiKey && dragonEndpoint) {
        this.logger.log("Attempting Dragon transcription...");
        return await this.transcribeWithDragon(mediaUrl, mediaType);
      }
    } catch (error) {
      this.logger.warn(
        "Dragon transcription failed, falling back to Whisper",
        error.message
      );
    }

    try {
      // Fallback to Whisper
      this.logger.log("Using Whisper for transcription...");
      return await this.transcribeWithWhisper(mediaUrl, mediaType);
    } catch (error) {
      this.logger.error("Both Dragon and Whisper transcription failed", error);
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  /**
   * Dragon Speech API transcription
   */
  private async transcribeWithDragon(
    mediaUrl: string,
    mediaType: "audio" | "video"
  ): Promise<TranscriptionResult> {
    const dragonApiKey = this.configService.get<string>("DRAGON_API_KEY");
    const dragonEndpoint = this.configService.get<string>(
      "DRAGON_API_ENDPOINT"
    );

    // Download media file temporarily
    const tempFilePath = await this.downloadMediaFile(mediaUrl, mediaType);

    try {
      const formData = new FormData();
      formData.append("audio", fs.createReadStream(tempFilePath));
      formData.append("language", "en-US");
      formData.append("model", "clinical"); // Use clinical model for therapy context

      const response = await axios.post(
        `${dragonEndpoint}/transcribe`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${dragonApiKey}`,
            "Content-Type": "multipart/form-data",
            ...formData.getHeaders(),
          },
          timeout: 300000, // 5 minutes timeout
        }
      );

      if (response.data && response.data.text) {
        return {
          text: response.data.text,
          confidence: response.data.confidence || 0.9,
          language: response.data.language || "en-US",
          duration: response.data.duration,
        };
      }

      throw new Error("Invalid response from Dragon API");
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }

  /**
   * OpenAI Whisper transcription (fallback)
   */
  private async transcribeWithWhisper(
    mediaUrl: string,
    mediaType: "audio" | "video"
  ): Promise<TranscriptionResult> {
    const openaiApiKey = this.configService.get<string>("OPENAI_API_KEY");

    if (!openaiApiKey) {
      throw new Error(
        "Neither Dragon nor OpenAI API key configured for transcription"
      );
    }

    // Download media file temporarily
    const tempFilePath = await this.downloadMediaFile(mediaUrl, mediaType);

    try {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(tempFilePath));
      formData.append("model", "whisper-1");
      formData.append("language", "en");
      formData.append("response_format", "json");

      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "multipart/form-data",
            ...formData.getHeaders(),
          },
          timeout: 300000, // 5 minutes timeout
        }
      );

      if (response.data && response.data.text) {
        return {
          text: response.data.text,
          confidence: 0.85, // Whisper doesn't provide confidence scores
          language: response.data.language || "en",
        };
      }

      throw new Error("Invalid response from Whisper API");
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }

  /**
   * Download media file from URL to temporary location
   */
  private async downloadMediaFile(
    mediaUrl: string,
    mediaType: "audio" | "video"
  ): Promise<string> {
    const response = await axios.get(mediaUrl, {
      responseType: "stream",
      timeout: 60000, // 1 minute timeout for download
    });

    const fileExtension = mediaType === "audio" ? "mp3" : "mp4";
    const tempDir = path.join(process.cwd(), "temp");

    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(
      tempDir,
      `${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}.${fileExtension}`
    );
    const writer = fs.createWriteStream(tempFilePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(tempFilePath));
      writer.on("error", reject);
    });
  }

  /**
   * Health check for transcription services
   */
  async healthCheck(): Promise<{ dragon: boolean; whisper: boolean }> {
    const dragonApiKey = this.configService.get<string>("DRAGON_API_KEY");
    const openaiApiKey = this.configService.get<string>("OPENAI_API_KEY");

    return {
      dragon: !!dragonApiKey,
      whisper: !!openaiApiKey,
    };
  }
}
