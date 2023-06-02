import { TimeEntities } from 'src/generic/timeEntity';
import { Animal } from 'src/animal/entities/animal';
import { AnnonceStateEnum } from 'src/enums/annonceStateEnum';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user';
import { AnnonceCategoryEnum } from '../../enums/annonceCategoryEnum';
@Entity('annonce')
export class Annonce extends TimeEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  category: AnnonceCategoryEnum;
  @Column({
    type: 'enum',
    enum: AnnonceStateEnum,
    default: AnnonceStateEnum.AVAILABLE,
  })
  state: AnnonceStateEnum;
  @OneToOne(() => Animal, { eager: true, cascade: true })
  @JoinColumn()
  animal: Animal;
  @ManyToMany(() => User, (user) => user.favorites, { cascade: true })
  favoritedBy: User[];

  @ManyToOne(() => User, (user) => user.publishedAnnonces, { cascade: true })
  publisher: Partial<User>;
}
