import { Injectable } from '@nestjs/common';
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

  async markNotificationAsRead(
    notificationId: number,
  ) {
    await this.NotifRepository.update(notificationId, { isRead: true });
  }

  async getUnreadNotifsForUser(userId: number): Promise<NotificationEntity[]> {
    const user = await this.userService.findOne(userId);
    console.log(user);
    const notifs = await this.NotifRepository.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.sender', 'sender')
      .leftJoinAndSelect('notification.annonce', 'annonce')
      .where('notification.receiver = :userId', { userId: user.id })
      .andWhere('notification.isRead = false')
      .select([
        'notification',
        'sender.firstname',
        'sender.lastname',
        'sender.email',
      ])
      .getMany();
    console.log(notifs);
    return notifs;
  }

  async getNotificationsForUser(userId: number): Promise<NotificationEntity[]> {
    const user = await this.userService.findOne(userId);
    console.log(user);
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
    const updatedNotifs = notifs.map((notif) => {
      this.markNotificationAsRead(notif.id);
      return notif;
    });
    await this.NotifRepository.save(updatedNotifs);
    return notifs;
  }
}
