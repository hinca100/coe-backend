import { Injectable } from '@nestjs/common';
import { BadgesRepository } from './badges.repository';
import { ProgressRepository } from '../../modules/progress/dto/progress.repository';
import { CoursesRepository } from '../courses/courses.repository';

@Injectable()
export class BadgesService {
  constructor(
    private readonly badgesRepo: BadgesRepository,
    private readonly progressRepo: ProgressRepository,
    private readonly coursesRepo: CoursesRepository,
  ) {}

  async checkAndAwardBadge(userId: string, courseId: string) {
    const course = await this.coursesRepo.findById(courseId);
    const progress = await this.progressRepo.getUserProgress(userId);

    const completedChapters = progress
      .filter(p => p.courseId._id.toString() === courseId)
      .map(p => p.chapterId.toString());

    const allChaptersCompleted = course.chapters.every(ch =>
      completedChapters.includes(ch.toString())
    );

    if (allChaptersCompleted) {
      return this.badgesRepo.createBadge(
        userId,
        courseId,
        `${course.title} Completed`,
        'https://cdn-icons-png.flaticon.com/512/190/190411.png', // demo icono
      );
    }
    return null;
  }

  async getUserBadges(userId: string) {
    return this.badgesRepo.getUserBadges(userId);
  }
}