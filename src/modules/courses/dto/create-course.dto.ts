import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";

class CourseResourceDto {
  @IsString()
  resourceType: "image" | "pdf" | "video" | "link";

  @IsString()
  url: string; // 👈 siempre URL que ya subiste a Cloudinary
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
  coverImage?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseResourceDto)
  resources?: CourseResourceDto[];
}