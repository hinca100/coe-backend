import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':courseId/chapters/:chapterId/complete')
  async completeChapter(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @CurrentUser() user: any,
  ) {
    return this.progress.completeChapter(user.sub, courseId, chapterId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyProgress(@CurrentUser() user: any) {
    return this.progress.getProgress(user.sub);
  }
}