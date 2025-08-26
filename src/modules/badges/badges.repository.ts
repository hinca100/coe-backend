import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Badge, BadgeDocument } from './schemas/badge.schema';

@Injectable()
export class BadgesRepository {
  constructor(
    @InjectModel(Badge.name) private badgeModel: Model<BadgeDocument>,
  ) {}

  async createBadge(userId: string, courseId: string, name: string, iconUrl: string) {
    const badge = new this.badgeModel({ userId, courseId, name, iconUrl });
    return badge.save();
  }

  async getUserBadges(userId: string) {
    return this.badgeModel.find({ userId }).exec();
  }

  // 👇 Nuevo método para validar si ya existe un badge de ese curso
  async findByUserAndCourse(userId: string, courseId: string) {
    return this.badgeModel.findOne({ userId, courseId }).exec();
  }
}