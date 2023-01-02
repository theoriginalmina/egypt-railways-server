import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	OneToOne,
} from "typeorm";
import { Egyptian } from "./Egyptian";
import { NonEgyptian } from "./NonEgyptian";

// prettier-ignore
@Entity("users")
export class User {
	@PrimaryGeneratedColumn()
		userId: number;

	@Column({ unique: true })
		email: string;

	@Column()
		password: string;

	@Column({ nullable: true })
		fullName: string;

	@Column({ nullable: true })
		egyptian: boolean;
	
	@Column({ default: false })
		active: boolean;
	
	@OneToOne(() => Egyptian, (egyptian) => egyptian.user, { cascade: true })
	@JoinColumn()
		egyptianInfo: Egyptian;

	@OneToOne(() => NonEgyptian, (nonEgyptian) => nonEgyptian.user, { cascade: true })
	@JoinColumn()
		nonEgyptianInfo: NonEgyptian;

}
