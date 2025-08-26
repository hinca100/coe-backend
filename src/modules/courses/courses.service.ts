import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { MailService } from '../mail/mail.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CoursesService {
  constructor(
    private readonly repo: CoursesRepository,
    private readonly mailService: MailService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createCourse(dto: CreateCourseDto, user: User) {
    if (user.role !== 'admin' && user.role !== 'instructor') {
      throw new ForbiddenException('Only admin/instructor can create courses');
    }
    return this.repo.createCourse(dto);
  }

  async findAll(filters: { category?: string; status?: string }) {
    return this.repo.findAll(filters);
  }

  async addChapter(
    courseId: string,
    dto: CreateChapterDto,
    user: User,
  ) {
    if (user.role !== 'admin' && user.role !== 'instructor') {
      throw new ForbiddenException('Only admin/instructor can add chapters');
    }
    return this.repo.addChapter(courseId, dto);
  }

  async publishCourse(courseId: string, user: any) {
    if (user.role !== 'admin' && user.role !== 'instructor') {
      throw new ForbiddenException(
        'Only admin or instructor can publish courses',
      );
    }

    const updated = await this.repo.publishCourse(courseId);

    // ✅ Notificar por email
    const users = await this.userModel.find({}, 'email').exec();
    const recipients = users.map((u) => u.email);

    if (recipients.length > 0) {
      await this.mailService.sendCoursePublished(updated, recipients);
    }

    return updated;
  }

  async unpublishCourse(courseId: string, user: any) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('No autorizado para despublicar este curso');
    }
    const course = await this.repo.findById(courseId);
    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }
    course.status = 'draft';
    await course.save();
    return { message: 'Curso despublicado con éxito', course };
  }

  async addResource(courseId: string, resource: { resourceType: string; url: string }, user: User) {
    if (user.role !== 'admin' && user.role !== 'instructor') {
      throw new ForbiddenException('Solo admin/instructor puede añadir recursos');
    }
    const course = await this.repo.findById(courseId);
    if (!course) throw new NotFoundException('Curso no encontrado');
    course.resources.push(resource as any);
    await course.save();
    return { message: '✅ Recurso agregado', resource };
  }

  async deleteCourse(courseId: string, user: User) {
    if (user.role !== 'admin' && user.role !== 'instructor') {
      throw new ForbiddenException('No autorizado para eliminar cursos');
    }
    return this.repo.deleteCourse(courseId);
  }

  async findById(id: string) {
    return this.repo.findById(id);
  }
}