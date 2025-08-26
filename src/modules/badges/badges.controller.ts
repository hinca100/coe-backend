import { Controller, Get, UseGuards } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyBadges(@CurrentUser() user: any) {
    return this.badgesService.getUserBadges(user._id);
  }
}