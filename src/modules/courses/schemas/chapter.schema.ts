import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chapter extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  order: number;

  @Prop({ required: true, enum: ['video', 'pdf', 'link'] })
  resourceType: string;

  @Prop({ required: true })
  resourceUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Course' })
  courseId: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);