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

  @Get('me')
  async myEnrollments(@CurrentUser() user: any) {
    return this.enrollments.findByUser(user._id);
  }
}