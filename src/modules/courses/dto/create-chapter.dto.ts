import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateChapterDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @Type(() => Number) 
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsString()
  resourceType: "image" | "pdf" | "video" | "link";

  @IsOptional()
  @IsString()
  resourceUrl?: string;
}