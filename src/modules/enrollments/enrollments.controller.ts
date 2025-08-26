import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollments: EnrollmentsService) {}

  @Post()
  async enroll(@CurrentUser() user: any, @Body('courseId') courseId: string) {
    return this.enrollments.enroll(user._id, courseId);
  }

  // 🔹 GET /api/enrollments/my
  @Get('my')
  async myEnrollments(@CurrentUser() user: any) {
    const enrollments = await this.enrollments.findByUser(user._id);

    // devolvemos directamente los cursos, no el objeto de enrollment
    return enrollments.map((e) => e.courseId);
  }
}