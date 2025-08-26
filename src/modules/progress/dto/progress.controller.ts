import { Controller, Post, Get, Param, UseGuards, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { BadgesService } from 'src/modules/badges/badges.service';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(
    private readonly progressService: ProgressService,
    private readonly badgesService: BadgesService,
  ) {}

  @Post('mark')
  async markChapter(
    @CurrentUser() user: any,
    @Body() body: { courseId: string; chapterId: string }
  ) {
    // 1️⃣ Marca el capítulo como visto
    const progress = await this.progressService.markChapter(
      user._id,
      body.courseId,
      body.chapterId,
    );

    // 2️⃣ Verifica si completó el curso y entrega badge
    const badge = await this.badgesService.checkAndAwardBadge(
      user._id,
      body.courseId,
    );

    // 3️⃣ Retorna progreso y badge (si lo hubo)
    return { progress, badge };
  }

  @Get(':courseId')
  async getCourseProgress(
    @CurrentUser() user: any,
    @Param('courseId') courseId: string,
  ) {
    const progress = await this.progressService.getCourseProgress(
      user._id,
      courseId,
    );

    // Devuelve solo los capítulos completados
    const completedChapters = progress.map((p) => p.chapterId.toString());

    return { completedChapters };
  }
}