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
  BadRequestException,
  Delete,
  NotFoundException,
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

  // ✅ Crear curso: con portada opcional
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createCourse(
    @Body() dto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (file) {
      const uploadResult = await this.courses.uploadFile(file);
      (dto as any).coverImage = uploadResult.secure_url;
    }

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

  // ✅ Agregar capítulo (con archivo opcional en Cloudinary)
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
    } else {
      dto.resourceUrl = null; // 👈 así no rompe validación
    }
    dto.order = Number(dto.order);
    return this.courses.addChapter(courseId, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/resources')
  @UseInterceptors(FileInterceptor('file'))
  async addResource(
    @Param('id') courseId: string,
    @Body('resourceType') resourceType: 'image' | 'pdf' | 'video' | 'link',
    @Body('url') url: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    let finalUrl = url;
    let finalType = resourceType;

    if (file) {
      const uploadResult = await this.courses.uploadFile(file);
      finalUrl = uploadResult.secure_url;

      // ⚡ Detectar tipo si no vino en el body
      if (!finalType) {
        if (file.mimetype.startsWith('image')) finalType = 'image';
        else if (file.mimetype.startsWith('video')) finalType = 'video';
        else if (file.mimetype.includes('pdf')) finalType = 'pdf';
        else finalType = 'link'; // fallback
      }
    }

    if (!finalType || !finalUrl) {
      throw new BadRequestException('Falta resourceType o URL');
    }

    return this.courses.addResource(
      courseId,
      { resourceType: finalType, url: finalUrl },
      user,
    );
  }

  // 🚀 Subida suelta de archivos
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.courses.uploadFile(file);
  }

  // 🚀 Test directo a Cloudinary
  @UseGuards(JwtAuthGuard)
  @Post('test-upload')
  @UseInterceptors(FileInterceptor('file'))
  async testUpload(@UploadedFile() file: Express.Multer.File) {
    return this.courses.testCloudinaryUpload(file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCourse(@Param('id') courseId: string, @CurrentUser() user: any) {
    return this.courses.deleteCourse(courseId, user);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const course = await this.courses.findById(id);
    if (!course) {
      throw new NotFoundException(`Curso con id ${id} no encontrado`);
    }
    return course;
  }
}
