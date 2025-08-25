// src/modules/courses/dto/create-course.dto.ts
import { IsNotEmpty, IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class CourseResourceDto {
  @IsString()
  resourceType: 'image' | 'pdf' | 'video' | 'link';

  @IsString()
  url: string;
}

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsString()
  coverImage?: string; // 👈 portada

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseResourceDto)
  resources?: CourseResourceDto[]; // 👈 recursos iniciales
}