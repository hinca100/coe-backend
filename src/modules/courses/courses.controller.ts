import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

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

  // ✅ Crear curso: si viene archivo, lo tratamos como portada (coverImage)
  // y si viene "resources" como string JSON, lo parseamos.
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file')) // el input <input name="file" />
  async createCourse(
    @Body() dto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    // Portada opcional
    if (file) {
      const uploadResult = await this.courses.uploadFile(file);
      (dto as any).coverImage = uploadResult.secure_url; // 👈 portada del curso
    }

    // resources opcional (puede venir como string JSON desde form-data)
    if ((dto as any).resources && typeof (dto as any).resources === 'string') {
      try {
        (dto as any).resources = JSON.parse((dto as any).resources);
      } catch {
        (dto as any).resources = [];
      }
    }

    return this.courses.createCourse(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/publish')
  async publishCourse(@Param('id') courseId: string, @CurrentUser() user: any) {
    return this.courses.publishCourse(courseId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/unpublish')
  async unpublishCourse(
    @Param('id') courseId: string,
    @CurrentUser() user: any,
  ) {
    return this.courses.unpublishCourse(courseId, user);
  }

  // ✅ Agregar capítulo (soporta archivo con Cloudinary)
  @UseGuards(JwtAuthGuard)
  @Post(':id/chapters')
  @UseInterceptors(FileInterceptor('file'))
  async addChapter(
    @Param('id') courseId: string,
    @Body() dto: CreateChapterDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (file) {
      const uploadResult = await this.courses.uploadFile(file);
      dto.resourceUrl = uploadResult.secure_url;
    }
    dto.order = Number(dto.order);
    return this.courses.addChapter(courseId, dto, user);
  }

  // Endpoint utilitario por si quieres subir un archivo suelto
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.courses.uploadFile(file);
  }

  // Endpoint de prueba de Cloudinary
  @UseGuards(JwtAuthGuard)
  @Post('test-upload')
  @UseInterceptors(FileInterceptor('file'))
  async testUpload(@UploadedFile() file: Express.Multer.File) {
    return this.courses.testCloudinaryUpload(file);
  }
}