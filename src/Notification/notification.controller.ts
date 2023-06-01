import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {NotificationEntity} from "./entities/notification.entity";

@Controller('notification')
export class NotificationController {
  constructor(
      private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotification: Partial<NotificationEntity>) {
    return this.notificationService.createNotification(createNotification);
  }


  @Get(':userid')
  findOne(@Param('userid') id: number) {
    return this.notificationService.getNotificationsForUser(+id);
  }

}
