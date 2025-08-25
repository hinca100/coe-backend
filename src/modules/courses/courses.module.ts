import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesRepository } from './courses.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';
import { User, UserSchema } from '../users/schemas/user.schema'; // 👈 importar user
import { Course, CourseSchema } from './schemas/course.schema';
import { Chapter, ChapterSchema } from './schemas/chapter.schema'; // 👈 ahora sí correcto

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Chapter.name, schema: ChapterSchema }, // 👈 registra también capítulo
      { name: User.name, schema: UserSchema },
    ]),
    MailModule,
  ],
  providers: [CoursesService, CoursesRepository],
  controllers: [CoursesController],
  exports: [CoursesService, CoursesRepository],
})
export class CoursesModule {}