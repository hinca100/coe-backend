import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  async sendTestMail() {
    return this.mailService.sendCoursePublished(
      { title: 'Prueba de correo', description: 'Esto es un test de Brevo 🚀', category: 'DevOps' },
      ['tu-correo-real@gmail.com']  // correo real
    );
  }
}