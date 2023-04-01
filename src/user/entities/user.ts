import {
  OneToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  firstname: string;
  @Column({
    length: 52,
  })
  lastname: string;

  @Column({
    unique: true,
  })
  email: string;
  @Column({
    length: 8,
  })
  phoneNumber: string;

  @Column()
  @Exclude()
  password: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
