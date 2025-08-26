import { Injectable } from '@nestjs/common';
import { BadgesRepository } from './badges.repository';
import { ProgressService } from '../progress/dto/progress.service';
import { CoursesRepository } from '../courses/courses.repository';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BadgesService {
  constructor(
    private readonly badgesRepo: BadgesRepository,
    private readonly progressService: ProgressService,
    private readonly coursesRepo: CoursesRepository,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) {}

  async checkAndAwardBadge(userId: string, courseId: string) {
    const course = await this.coursesRepo.findById(courseId);
    const progress = await this.progressService.getCourseProgress(userId, courseId);
    console.log("📊 Capítulos del curso:", course.chapters?.length);
    console.log("✅ Progreso guardado:", progress.map(p => p.chapterId));
    if (!course || !course.chapters?.length) return null;

    const totalChapters = course.chapters.length;
    const completedChapters = progress.length;
    console.log(`🔍 Comparando: completados=${completedChapters}, totales=${totalChapters}`);
    if (completedChapters !== totalChapters) return null;

    const existing = await this.badgesRepo.findByUserAndCourse(userId, courseId);
    if (existing) return existing;

    const badge = await this.badgesRepo.createBadge(
      userId,
      courseId,
      `${course.title} Completed`,
      'https://cdn-icons-png.flaticon.com/512/190/190411.png',
    );

    try {
      const user = await this.usersService.getById(userId);
      if (user?.email) {
        console.log("📧 Enviando correo a:", user.email);
        await this.mailService.sendBadgeAwarded(
          user.email,
          course.title,
          badge.name,
        );
        console.log("✅ Correo enviado");
      }
    } catch (err) {
      console.error("❌ Error enviando correo:", err.message || err);
    }

    return badge;
  }

  // 👇 Aquí el método que te falta
  async getUserBadges(userId: string) {
    return this.badgesRepo.getUserBadges(userId);
  }
}