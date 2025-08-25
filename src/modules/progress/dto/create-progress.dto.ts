import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProgressDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  chapterId: string;
}