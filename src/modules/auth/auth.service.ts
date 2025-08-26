import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user: UserDocument = await this.users.createUser(dto);
    const tokens = await this.signTokens(
      user._id.toString(),
      user.email,
      user.role,
    );
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const user: UserDocument = await this.users.getByEmail(email);
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.signTokens(
      user._id.toString(),
      user.email,
      user.role,
    );
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });
      const tokens = await this.signTokens(
        payload.sub,
        payload.email,
        payload.role,
      );
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async signTokens(sub: string, email: string, role: string) {
    const payload = { sub, email, role };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES || '15m',
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: process.env.REFRESH_EXPIRES || '7d',
    });

    return { accessToken, refreshToken };
  }
}
