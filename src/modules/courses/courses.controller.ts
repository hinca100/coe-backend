import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  Query,
  BadRequestException,
  Delete,
  NotFoundException,
} from '@nestjs/common';
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

  // ✅ Crear curso (con portada en URL)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createCourse(
    @Body() dto: CreateCourseDto,
    @CurrentUser() user: any,
  ) {
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

  // Agregar capítulo
  @UseGuards(JwtAuthGuard)
  @Post(':id/chapters')
  async addChapter(
    @Param('id') courseId: string,
    @Body() dto: CreateChapterDto,
    @CurrentUser() user: any,
  ) {
    dto.order = Number(dto.order);
    return this.courses.addChapter(courseId, dto, user);
  }

  // ✅ Agregar recurso
  @UseGuards(JwtAuthGuard)
  @Post(':id/resources')
  async addResource(
    @Param('id') courseId: string,
    @Body('resourceType') resourceType: 'image' | 'pdf' | 'video' | 'link',
    @Body('url') url: string,
    @CurrentUser() user: any,
  ) {
    if (!resourceType || !url) {
      throw new BadRequestException('Falta resourceType o URL');
    }

    return this.courses.addResource(
      courseId,
      { resourceType, url },
      user,
    );
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