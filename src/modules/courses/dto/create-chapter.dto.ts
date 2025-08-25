import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer"; // 👈 para transformar strings a number

export class CreateChapterDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @Type(() => Number) // 👈 convierte automáticamente "1" → 1
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsString()
  resourceType: string;

  @IsOptional()
  @IsString()
  resourceUrl?: string;
}
