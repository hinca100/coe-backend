// src/modules/courses/schemas/course.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

/* =========================
   Tipos de documentos
========================= */
export type CourseDocument = HydratedDocument<Course>;
export type ChapterDocument = HydratedDocument<Chapter>;
export type CourseResourceDocument = HydratedDocument<CourseResource>;

/* =========================
   Subdocumento: Recurso de curso
   (imagen, pdf, video, link)
========================= */
@Schema({ _id: false })
export class CourseResource {
  @Prop({ required: true, enum: ['image', 'pdf', 'video', 'link'] })
  resourceType: 'image' | 'pdf' | 'video' | 'link';

  @Prop({ required: true })
  url: string;
}
export const CourseResourceSchema = SchemaFactory.createForClass(CourseResource);

/* =========================
   Esquema: Curso
========================= */
@Schema({ timestamps: true })
export class Course {
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string; // Fullstack, Cloud, etc.

  @Prop({ enum: ['draft', 'published'], default: 'draft' })
  status: 'draft' | 'published';

  // 👉 Portada del curso (opcional)
  @Prop()
  coverImage?: string;

  // 👉 Recursos del curso (imágenes, PDFs, videos, links)
  @Prop({ type: [CourseResourceSchema], default: [] })
  resources: CourseResource[];

  // 👉 Capítulos referenciados
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Chapter' }], default: [] })
  chapters: Types.ObjectId[];
}
export const CourseSchema = SchemaFactory.createForClass(Course);

/* =========================
   Esquema: Capítulo
========================= */
@Schema({ timestamps: true })
export class Chapter {
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  order: number;

  @Prop()
  resourceType: string; // video, pdf, slides, guide

  @Prop()
  resourceUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;
}
export const ChapterSchema = SchemaFactory.createForClass(Chapter);