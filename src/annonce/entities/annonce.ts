/* eslint-disable prettier/prettier */
import { TimeEntities } from 'src/Generics/timeEntity';
import { AnimalEntity } from 'src/animal/entities/animal/animal';
import { AnnonceStateEnum } from 'src/enums/annonceStateEnum';
import { User } from 'src/user/entities/user';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('annonce')
export class AnnonceEntity extends TimeEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({
    type: 'enum',
    enum: AnnonceStateEnum,
    default: AnnonceStateEnum.AVAILABLE,
  })
  state: AnnonceStateEnum;
  @OneToOne(() => AnimalEntity, { eager: true, cascade: true })
  @JoinColumn()
  animal: AnimalEntity;
  @ManyToOne(() => User, (user: User) => user.annonces, {
    eager: true,
    cascade: true,
  })
  user: User;
  @ManyToMany(() => User, (user) => user.favoris, { cascade: true })
  users: User[];
}
