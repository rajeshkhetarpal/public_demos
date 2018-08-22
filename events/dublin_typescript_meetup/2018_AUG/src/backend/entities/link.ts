import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user";
import { Vote } from "./vote";

@Entity()
export class Link {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(type => User, user => user.id)
    public user: User;

    @Column()
    public url: string;

    @Column()
    public title: string;

}
