import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// prettier-ignore
@Entity("trips")
export class Trip {
	@PrimaryGeneratedColumn()
		tripId: number;

	@Column()
		trainId: number;

	@Column()
		from: string;

	@Column()
		to: string;

	@Column()
		day: number;

	@Column({ type: "time" })
		departureTime: string;

	@Column({ type: "time" })
		arrivalTime: string;

	@Column({ type:"numeric" })
		price: string;

	// @Column()
	// 	stationsBetween: Date;
}
