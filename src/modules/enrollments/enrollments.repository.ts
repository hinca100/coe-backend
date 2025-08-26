import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';

@Injectable()
export class EnrollmentsRepository {
  constructor(
    @InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async findByUser(userId: string) {
    return this.enrollmentModel.find({ userId }).populate('courseId').exec();
  }

  async create(userId: string, courseId: string) {
    return this.enrollmentModel.create({ userId, courseId });
  }
}