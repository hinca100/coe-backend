import { Controller, Post, Get, Param, UseGuards, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('mark')
  async markChapter(
    @CurrentUser() user: any,
    @Body() body: { courseId: string; chapterId: string }
  ) {
    return this.progressService.markChapter(user._id, body.courseId, body.chapterId);
  }

  @Get(':courseId')
  async getProgress(
    @CurrentUser() user: any,
    @Param('courseId') courseId: string
  ) {
    const completed = await this.progressService.countCompleted(user._id, courseId);
    return { completed };
  }
}