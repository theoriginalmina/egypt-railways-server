import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// prettier-ignore
@Entity("stations")
export class Station {
    @PrimaryGeneratedColumn()
    	stationId: string;
    
    @Column()
    	name: string;
}
