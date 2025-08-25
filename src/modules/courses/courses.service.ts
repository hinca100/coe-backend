import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { MailService } from '../mail/mail.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';

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

  async addChapter(
    courseId: string,
    dto: CreateChapterDto,
    user: User,
    file?: Express.Multer.File,
  ) {
    if (user.role !== 'admin' && user.role !== 'instructor') {
      throw new ForbiddenException('Only admin/instructor can add chapters');
    }

    // 👇 Subir archivo si viene
    if (file) {
      const uploaded = await this.uploadFile(file);
      dto.resourceUrl = uploaded.secure_url; // Guardamos la URL de Cloudinary
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

  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    if (!file) {
      return null;
    }
    console.log("📂 Archivo recibido:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
    let resourceType: "raw" | "image" | "video" = "raw";
    if (file.mimetype.startsWith("image")) {
      resourceType = "image";
    } else if (file.mimetype.startsWith("video")) {
      resourceType = "video";
    } else if (file.mimetype.includes("pdf") || file.mimetype.includes("zip")) {
      resourceType = "raw";
    }
    console.log("➡️ resourceType elegido:", resourceType);
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,
            folder: "courses",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }


  async testCloudinaryUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No se envió archivo");
    }
  
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: "test-uploads",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
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
}
