/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { AnnonceEntity } from 'src/annonce/entities/annonce';

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

  @Column({
    default: null,
  })
  @Exclude()
  verificationToken: string;
  @Column({ default: false })
  verified: boolean;
  @OneToMany(() => AnnonceEntity, (annonce: AnnonceEntity) => annonce.user)
  annonces: AnnonceEntity[];
  @ManyToMany(() => AnnonceEntity, (fav) => fav.users, { eager: true })
  @JoinTable({
    name: 'favoris',
    joinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'annonce', // nom du champ représentant l’entité en relation avec cet entité
      referencedColumnName: 'id',
    },
  })
  favoris: AnnonceEntity[];
}
