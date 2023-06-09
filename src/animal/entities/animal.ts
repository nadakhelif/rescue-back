// import { TimeEntities } from 'src/generic/timeEntity';

import { AnimalSexeEnum } from 'src/enums/animalSexeEnum';
import { AnimalStateEnum } from 'src/enums/animalStateEnum';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeEntities } from '../../generic/timeEntity';

@Entity('animal') //extends TimeEntities
export class Animal extends TimeEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  age: number;
  @Column({ default: null })
  photo: string;
  @Column()
  race: string;
  @Column({
    type: 'enum',
    enum: AnimalSexeEnum,
  })
  sexe: AnimalSexeEnum;
  @Column()
  description: string;
  @Column()
  type: string;
  @Column({
    type: 'enum',
    enum: AnimalStateEnum,
    default: AnimalStateEnum.AVAILABLE,
  })
  state: AnimalStateEnum;
}
