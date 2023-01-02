import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

// prettier-ignore
@Entity("egyptians")
export class Egyptian {
	@PrimaryGeneratedColumn()
		id: number;

	@Column()
		phoneNumber: string;

	@Column()
		nationalID: string;
	
	@OneToOne(() => User, (user) => user.egyptianInfo)
		user: User;
}
