import {
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
  @Column({ default: null })
  phoneNumber: string;

  @Column()
  @Exclude()
  password: string;

  @DeleteDateColumn()
  deletedAt?: Date;
  @Column({ nullable: true })
  profilePhoto: string;

  @Column({
    default: null,
  })
  @Exclude()
  verificationToken: string;
  @Column({ default: false })
  verified: boolean;
}
