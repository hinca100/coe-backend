import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  LEARNER = 'learner',
}

@Schema({ timestamps: true })
export class User {
  _id: string;  // 👈 añadimos esto para que TS lo reconozca

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: Role, default: Role.LEARNER })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);