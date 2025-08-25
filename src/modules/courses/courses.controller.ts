import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { Query } from '@nestjs/common';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  @Get()
  async listCourses(
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    return this.courses.findAll({ category, status });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCourse(@Body() dto: CreateCourseDto, @CurrentUser() user: any) {
    return this.courses.createCourse(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/publish')
  async publishCourse(@Param('id') courseId: string, @CurrentUser() user: any) {
    return this.courses.publishCourse(courseId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/unpublish')
  async unpublishCourse(@Param('id') courseId: string, @CurrentUser() user: any) {
    return this.courses.unpublishCourse(courseId, user);
  }

  @UseGuards(JwtAuthGuard)
@Post(':id/chapters')
@UseInterceptors(FileInterceptor('file')) 
async addChapter(
  @Param('id') courseId: string,
  @Body() dto: CreateChapterDto,
  @UploadedFile() file: Express.Multer.File, 
  @CurrentUser() user: any,
) {
  // Si llega archivo lo subimos a Cloudinary
  if (file) {
    const uploadResult = await this.courses.uploadFile(file);
    dto.resourceUrl = uploadResult.secure_url; 
  }
  dto.order = Number(dto.order);
  return this.courses.addChapter(courseId, dto, user);
}

 
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.courses.uploadFile(file);
  }




  
  @UseGuards(JwtAuthGuard)
  @Post("test-upload")
  @UseInterceptors(FileInterceptor("file"))
  async testUpload(@UploadedFile() file: Express.Multer.File) {
    return this.courses.testCloudinaryUpload(file);
  }


}