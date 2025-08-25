import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ProgressRepository } from './progress.repository';
import { BadgesService } from '../../badges/badges.service';

@Injectable()
export class ProgressService {
  constructor(
    private readonly repo: ProgressRepository,
    @Inject(forwardRef(() => BadgesService))
    private readonly badgesService: BadgesService,
  ) {}

  async completeChapter(userId: string, courseId: string, chapterId: string) {
    const progress = await this.repo.markCompleted(userId, courseId, chapterId);
    await this.badgesService.checkAndAwardBadge(userId, courseId);
    return progress;
  }

  async getProgress(userId: string) {
    return this.repo.getUserProgress(userId);
  }
}
