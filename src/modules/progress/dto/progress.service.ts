import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Progress, ProgressDocument } from '../schemas/progress.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
  ) {}

  async markChapter(userId: string, courseId: string, chapterId: string) {
    return this.progressModel.findOneAndUpdate(
      { userId, courseId, chapterId },
      { completed: true, completedAt: new Date() },
      { upsert: true, new: true }
    );
  }

  async getCourseProgress(userId: string, courseId: string) {
    return this.progressModel.find({
      userId,
      courseId,
      completed: true
    });
  }

  async countCompleted(userId: string, courseId: string) {
    return this.progressModel.countDocuments({ userId, courseId, completed: true });
  }

}