import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './entities/notification.entity';
import { JwtAuthGuard } from '../user/guard/jwt.auth.guards';
import { AuthUser } from '../user/strategy/autUser.decorator';
import { User } from '../user/entities/user';

@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotification: Partial<NotificationEntity>) {
    return this.notificationService.createNotification(createNotification);
  }

  @Get('MarkAsRead')
  async getUnreadNotifsForUser(@AuthUser() user: User) {
    return this.notificationService.markNotificationAsRead(user.id);
  }

  @Get()
  getNotificationsForUser(@AuthUser() user: User) {
    return this.notificationService.getNotificationsForUser(user.id);
  }
}
