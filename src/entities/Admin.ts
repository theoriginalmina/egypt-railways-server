import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// prettier-ignore
@Entity("admins")
export class Admin {
    @PrimaryGeneratedColumn()
        adminId: string;

    @Column()
        username: string;

    @Column()
        password: string;
}
