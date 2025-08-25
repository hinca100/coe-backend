import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from '../schemas/progress.schema';

@Injectable()
export class ProgressRepository {
  constructor(@InjectModel(Progress.name) private model: Model<ProgressDocument>) {}

  async markCompleted(userId: string, courseId: string, chapterId: string): Promise<ProgressDocument> {
    const progress = new this.model({ userId, courseId, chapterId, completedAt: new Date() });
    return progress.save();
  }

  async getUserProgress(userId: string): Promise<ProgressDocument[]> {
    return this.model.find({ userId }).populate('courseId').populate('chapterId').exec();
  }
}