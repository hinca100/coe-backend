import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendCoursePublished(course: any, recipients: string[]) {
    for (const email of recipients) {
      try {
        await this.mailerService.sendMail({
          to: email,
          subject: `Nuevo curso publicado: ${course.title}`,
          html: `
            <h2>${course.title} ya está disponible 🎉</h2>
            <p>${course.description}</p>
            <p><b>Categoría:</b> ${course.category}</p>
          `,
        });
        console.log(`✅ Correo enviado a: ${email}`);
      } catch (err) {
        console.error('❌ Error enviando correo:', err.message || err);
        throw err;
      }
    }
    return { message: 'Correos enviados 🚀' };
  }
}