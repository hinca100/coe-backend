import { Injectable } from '@nestjs/common';
import { BadgesRepository } from './badges.repository';
import { ProgressService } from '../progress/dto/progress.service';
import { CoursesRepository } from '../courses/courses.repository';
import { MailService } from '../mail/mail.service';

@Injectable()
export class BadgesService {
  constructor(
    private readonly badgesRepo: BadgesRepository,
    private readonly progressService: ProgressService,
    private readonly coursesRepo: CoursesRepository,
    private readonly mailService: MailService,
  ) {}

  async checkAndAwardBadge(userId: string, courseId: string) {
    // 1️⃣ Buscar curso y progreso
    const course = await this.coursesRepo.findById(courseId);
    const progress = await this.progressService.getCourseProgress(userId, courseId);

    if (!course || !course.chapters?.length) return null;

    // 2️⃣ Capítulos completados vs totales
    const totalChapters = course.chapters.length;
    const completedChapters = progress.length;

    const allChaptersCompleted = completedChapters === totalChapters;
    if (!allChaptersCompleted) return null;

    // 3️⃣ Verificar si ya existe badge
    const existing = await this.badgesRepo.findByUserAndCourse(userId, courseId);
    if (existing) return existing;

    // 4️⃣ Crear badge
    const badge = await this.badgesRepo.createBadge(
      userId,
      courseId,
      `${course.title} Completed`,
      'https://cdn-icons-png.flaticon.com/512/190/190411.png', // demo icono
    );

    // 5️⃣ Notificar por correo
    // Aquí necesitarías obtener el email del usuario (ej. desde UsersService)
    // Ahora lo dejamos en comentario para no romper
    /*
    if (user?.email) {
      await this.mailService.sendBadgeAwarded(
        user.email,
        course.title,
        badge.name,
      );
    }
    */

    return badge;
  }

  async getUserBadges(userId: string) {
    return this.badgesRepo.getUserBadges(userId);
  }
}