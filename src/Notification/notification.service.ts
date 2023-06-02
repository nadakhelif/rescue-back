import { Injectable} from '@nestjs/common';
import {CrudService} from "../common/crud.service";
import {NotificationEntity} from "./entities/notification.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserService} from "../user/user.service";

@Injectable()
export class NotificationService extends CrudService<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    private NotifRepository: Repository<NotificationEntity>,
    private userService: UserService,
  ){
    super(NotifRepository);
  }

  async createNotification(notificationData: Partial<NotificationEntity>): Promise<NotificationEntity> {
    const notif = this.NotifRepository.create(notificationData);
    return await this.NotifRepository.save(notif);
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await this.NotifRepository.update(notificationId, { isRead: true });
  }

  async getUnreadNotifsForUser(userId: number): Promise<NotificationEntity[]>{
    const user = await this.userService.findOne(userId);
    const notifs = await this.NotifRepository.find({where: {receiver: user, isRead: false} , relations: ['sender', 'receiver','annonce'],
    });
    return notifs;
  }

  async getNotificationsForUser(userId: number): Promise<NotificationEntity[]> {
    const user = await this.userService.findOne(userId);
    const notifs = await this.NotifRepository.find({where: {receiver: user} , relations: ['sender', 'receiver','annonce'],
    });
    const updatedNotifs = notifs.map(notif => {
      notif.isRead = true;
      return notif;
    });
    await this.NotifRepository.save(updatedNotifs);
    return notifs;
  }

}