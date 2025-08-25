import { Injectable, ForbiddenException } from '@nestjs/common';
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
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>, // 👈 aquí inyectamos el modelo
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

  async addChapter(courseId: string, dto: CreateChapterDto, user: User) {
    if (user.role !== 'admin' && user.role !== 'instructor') {
      throw new ForbiddenException('Only admin/instructor can add chapters');
    }
    return this.repo.addChapter(courseId, dto);
  }

  async publishCourse(courseId: string, user: any) {
    if (user.role !== 'admin' && user.role !== 'instructor') {
      throw new ForbiddenException('Only admin or instructor can publish courses');
    }

    const updated = await this.repo.publishCourse(courseId);

    // ✅ ahora sí existe this.userModel
    const users = await this.userModel.find({}, 'email').exec();
    const recipients = users.map(u => u.email);

    if (recipients.length > 0) {
      await this.mailService.sendCoursePublished(updated, recipients);
    }

    return updated;
  }
}