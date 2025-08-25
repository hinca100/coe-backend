import { Body, Controller, Get, Param, Post, UseGuards, Patch } from '@nestjs/common';
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
  async addChapter(
    @Param('id') courseId: string,
    @Body() dto: CreateChapterDto,
    @CurrentUser() user: any,
  ) {
    return this.courses.addChapter(courseId, dto, user);
  }
}
