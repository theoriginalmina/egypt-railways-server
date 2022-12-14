import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

// prettier-ignore
@Entity("nonEgyptians")
export class NonEgyptian {
	@PrimaryGeneratedColumn()
		id: number;

	@Column()
		phoneNumber: string;

	@Column()
		passportNumber: string;
	
	@OneToOne(() => User, (user) => user.nonEgyptianInfo)
		user: User;
}
