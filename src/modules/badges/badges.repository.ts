import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Badge, BadgeDocument } from './schemas/badge.schema';

@Injectable()
export class BadgesRepository {
  constructor(
    @InjectModel(Badge.name) private badgeModel: Model<BadgeDocument>,
  ) {}

  async createBadge(userId: string, courseId: string, name: string, icon: string) {
    const badge = new this.badgeModel({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
      name,
      icon, // 👈 ahora coincide con el schema
    });
    return badge.save();
  }

  async getUserBadges(userId: string) {
    return this.badgeModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findByUserAndCourse(userId: string, courseId: string) {
    return this.badgeModel.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    }).exec();
  }
}