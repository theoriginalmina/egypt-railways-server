import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// prettier-ignore
@Entity("users")
export class User {
	@PrimaryGeneratedColumn()
		id: number;

	@Column({unique :true})
		email: string;

	@Column()
		password: string;

	@Column({nullable: true})
		fullName: string;

}
