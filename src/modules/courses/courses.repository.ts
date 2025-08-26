import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Course,
  CourseDocument,
  Chapter,
  ChapterDocument,
} from './schemas/course.schema';

@Injectable()
export class CoursesRepository {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Chapter.name) private chapterModel: Model<ChapterDocument>,
  ) {}

  async createCourse(data: Partial<Course>): Promise<CourseDocument> {
    const course = new this.courseModel(data);
    return course.save();
  }

  async findAll(filters: { category?: string; status?: string }) {
    const query: any = {};
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.status) {
      query.status = filters.status;
    }
    return this.courseModel.find(query).populate('chapters').exec();
  }

  async addChapter(
    courseId: string,
    data: Partial<Chapter>,
  ): Promise<ChapterDocument> {
    const chapter = new this.chapterModel({ ...data, courseId });
    const saved = await chapter.save();
    await this.courseModel.findByIdAndUpdate(courseId, {
      $push: { chapters: saved._id },
    });
    return saved;
  }

  async publishCourse(courseId: string) {
    return this.courseModel
      .findByIdAndUpdate(courseId, { status: 'published' }, { new: true })
      .populate('chapters');
  }

  async findById(id: string) {
    return this.courseModel
      .findById(id)
      .populate('chapters') 
      .exec();
  }

  async deleteCourse(courseId: string) {
    const deleted = await this.courseModel.findByIdAndDelete(courseId).exec();
    if (!deleted) {
      throw new NotFoundException(`Curso con id ${courseId} no encontrado`);
    }
    return { message: 'Curso eliminado con éxito', course: deleted };
  }
}
