import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/entities/user";
import {Annonce} from "../../annonce/entities/annonce.entity";

@Entity()
export class NotificationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: false})
    isRead: boolean;

    @ManyToOne(() => Annonce,{cascade: true})
    annonce: Annonce;

    @ManyToOne(() => User,{cascade: true})
    @JoinColumn()
    sender: User;

    @ManyToOne(() => User, {cascade: true})
    @JoinColumn()
    receiver: User;
}