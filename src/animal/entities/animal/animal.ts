import { TimeEntities } from 'src/Generics/timeEntity';
import { AnnonceEntity } from 'src/annonce/entities/annonce';
import { AnimalSexeEnum } from 'src/enums/animalSexeEnum';
import { AnimalStateEnum } from 'src/enums/animalStateEnum';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('animal')
export class AnimalEntity extends TimeEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  age: number;
  @Column()
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
  @OneToOne(() => AnnonceEntity)
  annonce: AnnonceEntity;
}
