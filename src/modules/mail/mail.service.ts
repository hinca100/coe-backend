import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendCoursePublished(course: any, recipients: string[]) {
    for (const email of recipients) {
      await this.mailerService.sendMail({
        to: email,
        subject: `Nuevo curso publicado: ${course.title}`,
        html: `
          <h2>${course.title} ya está disponible 🎉</h2>
          <p>${course.description}</p>
          <p><b>Categoría:</b> ${course.category}</p>
        `,
      });
    }
  }

  async sendBadgeAwarded(email: string, courseTitle: string, badgeName: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `🏅 ¡Has ganado una nueva insignia!`,
      html: `
        <h2>¡Felicidades!</h2>
        <p>Completaste el curso <b>${courseTitle}</b>.</p>
        <p>Has ganado la insignia: <b>${badgeName}</b> 🏅</p>
        <p>Sigue aprendiendo 🚀</p>
      `,
    });
  }
}