import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Annonce } from '../../annonce/entities/annonce.entity';
import { Message } from 'src/message/entities/message.entity';

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

  @ManyToMany(() => Annonce, (annonce) => annonce.favoritedBy)
  @JoinTable({
    name: 'favorite',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'annonce_id',
      referencedColumnName: 'id',
    },
  })
  favorites: Annonce[];

  @OneToMany(() => Annonce, (annonce) => annonce.publisher)
  publishedAnnonces: Annonce[];

  @OneToMany(() => Message, (messages) => messages.author)
  messages: Message[];
}
