import { IsArray, IsObject, IsOptional, IsString } from "class-validator";

export class EventGridValidationDto {
  @IsString()
  validationCode: string;

  @IsString()
  validationUrl: string;
}

export class BlobEventDataDto {
  @IsString()
  api: string;

  @IsString()
  clientRequestId: string;

  @IsString()
  requestId: string;

  @IsString()
  eTag: string;

  @IsString()
  contentType: string;

  @IsString()
  contentLength: number;

  @IsString()
  blobType: string;

  @IsString()
  url: string;

  @IsString()
  sequencer: string;

  @IsObject()
  storageDiagnostics: any;
}

export class EventGridEventDto {
  @IsString()
  id: string;

  @IsString()
  eventType: string;

  @IsString()
  subject: string;

  @IsString()
  eventTime: string;

  @IsString()
  dataVersion: string;

  @IsString()
  metadataVersion: string;

  @IsObject()
  data: BlobEventDataDto;

  @IsString()
  @IsOptional()
  topic?: string;
}

export class EventGridWebhookDto {
  @IsArray()
  @IsOptional()
  validationCode?: EventGridValidationDto[];

  @IsArray()
  @IsOptional()
  events?: EventGridEventDto[];
}

export interface ProcessedBlobMetadata {
  patientId: string;
  mediaType: "audio" | "video";
  uploadTimestamp: string;
  originalFileName: string;
  blobUrl: string;
  containerName: string;
}
