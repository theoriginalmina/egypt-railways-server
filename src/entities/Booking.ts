import { Entity, PrimaryGeneratedColumn } from "typeorm";

// prettier-ignore
@Entity("bookings")
export class Booking {
    @PrimaryGeneratedColumn()
    	bookingId: string;
}
