import { Injectable, NotFoundException } from '@nestjs/common';
import { CrudService } from '../common/crud.service';
import { NotificationEntity } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class NotificationService extends CrudService<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    private NotifRepository: Repository<NotificationEntity>,
    private userService: UserService,
  ) {
    super(NotifRepository);
  }

  async createNotification(
    notificationData: Partial<NotificationEntity>,
  ): Promise<NotificationEntity> {
    const notif = this.NotifRepository.create(notificationData);
    return await this.NotifRepository.save(notif);
  }
  async markNotificationAsRead(userId: number) {
    const user = await this.userService.findOne(userId);
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const notifs = await this.NotifRepository.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.sender', 'sender')
      .leftJoinAndSelect('notification.annonce', 'annonce')
      .where('notification.receiver = :userId', { userId: user.id })
      .getMany();
    for (const notif of notifs) {
      notif.isRead = true;
    }
    await this.NotifRepository.save(notifs);
  }

  async getNotificationsForUser(userId: number): Promise<NotificationEntity[]> {
    const user = await this.userService.findOne(userId);
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const notifs = await this.NotifRepository.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.sender', 'sender')
      .leftJoinAndSelect('notification.annonce', 'annonce')
      .where('notification.receiver = :userId', { userId: user.id })
      .select([
        'notification',
        'sender.firstname',
        'sender.lastname',
        'sender.email',
      ])
      .orderBy('notification.createdAt', 'DESC')
      .getMany();
    console.log(notifs);
    return notifs;
  }
}
