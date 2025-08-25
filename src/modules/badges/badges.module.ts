import { Module , forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Badge, BadgeSchema } from './schemas/badge.schema';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { BadgesRepository } from './badges.repository';
import { ProgressModule } from '../../modules/progress/dto/progress.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Badge.name, schema: BadgeSchema }]),
    forwardRef(() => ProgressModule),
    CoursesModule,
  ],
  controllers: [BadgesController],
  providers: [BadgesService, BadgesRepository],
  exports: [BadgesService],
})
export class BadgesModule {}