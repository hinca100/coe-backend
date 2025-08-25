import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Badge, BadgeDocument } from './schemas/badge.schema';

@Injectable()
export class BadgesRepository {
  constructor(@InjectModel(Badge.name) private model: Model<BadgeDocument>) {}

  async createBadge(userId: string, courseId: string, name: string, icon: string) {
    const badge = new this.model({ userId, courseId, name, icon });
    return badge.save();
  }

  async getUserBadges(userId: string): Promise<BadgeDocument[]> {
    return this.model.find({ userId }).populate('courseId').exec();
  }
}