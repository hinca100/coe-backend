import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badges: BadgesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyBadges(@CurrentUser() user: any) {
    return this.badges.getUserBadges(user.sub);
  }
}