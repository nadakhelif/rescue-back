import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user';
import { Annonce } from '../../annonce/entities/annonce.entity';
import { TimeEntities } from '../../generic/timeEntity';

@Entity('notification')
export class NotificationEntity extends TimeEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => Annonce, { cascade: true })
  annonce: Annonce;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  sender: Partial<User>;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  receiver: Partial<User>;
}
