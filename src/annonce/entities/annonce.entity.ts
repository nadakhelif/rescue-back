import { TimeEntities } from 'src/Generic/timeEntity';
import { Animal } from 'src/animal/entities/animal';
import { AnnonceStateEnum } from 'src/enums/annonceStateEnum';

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('annonce')
export class Annonce extends TimeEntities {
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
  @OneToOne(() => Animal)
  @JoinColumn()
  animal: Animal;
}
