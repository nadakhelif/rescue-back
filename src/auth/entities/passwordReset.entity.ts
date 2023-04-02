import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { randomBytes } from 'crypto';

@Entity()
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  token: string;
}
