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
  @Type(() => Number)   // 👈 transforma "1" en 1
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsString()
  resourceType: string;

  @IsOptional()         // 👈 no es obligatorio
  @IsString()
  resourceUrl?: string;
}