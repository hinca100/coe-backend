import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';
import { Model } from 'mongoose';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async enroll(userId: string, courseId: string) {
    const exists = await this.enrollmentModel.findOne({ userId, courseId });
    if (exists) return exists;

    const enrollment = new this.enrollmentModel({ userId, courseId });
    return enrollment.save();
  }

  async findByUser(userId: string) {
    return this.enrollmentModel
      .find({ userId })
      .populate('courseId') 
      .exec()
  }
}