// src/modules/users/users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UsersRepository,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>, // 👈 inyectamos el modelo aquí
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserDocument> {
    const exists = await this.repo.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    return this.repo.create({ email: dto.email, name: dto.name, password: hashed });
  }
  async getAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUserRole(userId: string, role: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUserEmail(userId: string, email: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { email },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}