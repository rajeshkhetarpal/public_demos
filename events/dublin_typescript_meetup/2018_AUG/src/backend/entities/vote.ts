import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";
import { Link } from "./link";

@Entity()
export class Vote {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(type => User, user => user.id)
    public user: User;

    @ManyToOne(type => Link, link => link.id)
    public link: Link;

    @Column()
    public isUpvote: boolean;
}
