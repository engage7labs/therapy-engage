import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsObject,
  IsString,
  IsUrl,
  ValidateNested,
} from "class-validator";

@ObjectType()
export class SentimentData {
  @Field()
  @IsString()
  label: string;

  @Field()
  @IsNumber()
  confidence: number;

  @Field()
  @IsString()
  summary: string;
}

@InputType()
export class SentimentInput {
  @Field()
  @IsString()
  label: string;

  @Field()
  @IsNumber()
  confidence: number;

  @Field()
  @IsString()
  summary: string;
}

@InputType()
export class UploadMediaDto {
  @Field()
  @IsString()
  patientId: string;

  @Field()
  @IsUrl()
  videoUrl: string;

  @Field()
  @IsEnum(["audio", "video"])
  mediaType: "audio" | "video";

  @Field()
  @IsString()
  transcription: string;

  @Field(() => SentimentInput)
  @IsObject()
  @ValidateNested()
  @Type(() => SentimentInput)
  sentiment: SentimentInput;

  @Field()
  @IsISO8601()
  createdAt: string;
}
