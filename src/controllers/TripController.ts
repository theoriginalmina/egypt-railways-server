import { AppDataSource } from "../data-source";
import { Trip } from "../entities/Trip";
import { Request, Response } from "express";

export class TripController {
	private tripRepo = AppDataSource.getRepository(Trip);

	insert = async (req: Request, res: Response) => {
		const { trainId, from, to, day, departureTime, arrivalTime, price } =
			req.body;

		try {
			await this.tripRepo.insert({
				trainId,
				from,
				to,
				day,
				departureTime,
				arrivalTime,
				price,
			});
			res.status(200);
		} catch (err) {
			res.status(500);
		}
	};

	searchTrip = async (req: TripRequest): Promise<SearchTripResponed> => {
		const { from, to, goDate, returnDate } = req.body;
		const goDay = new Date(goDate).getDay();

		if (returnDate) {
			const returnDay = new Date(returnDate).getDay();

			const goTrip = {
				from: from.toLowerCase(),
				to: to.toLowerCase(),
				day: goDay,
			};
			const returnTrip = {
				from: to.toLowerCase(),
				to: from.toLowerCase(),
				day: returnDay,
			};
			const goTrips = await this.tripRepo.find({
				where: {
					from: goTrip.from,
					to: goTrip.to,
					day: goTrip.day,
				},
			});
			const returnTrips = await this.tripRepo.find({
				where: {
					from: returnTrip.from,
					to: returnTrip.to,
					day: returnTrip.day,
				},
			});

			return {
				goTrips,
				returnTrips,
			};
		}

		const goTrip = {
			from: from.toLowerCase(),
			to: to.toLowerCase(),
			day: goDay,
		};

		const goTrips = await this.tripRepo.find({
			where: {
				from: goTrip.from,
				to: goTrip.to,
				day: goTrip.day,
			},
		});
		return {
			goTrips,
		};
	};
}

interface SearchTripResponed {
	goTrips: Trip[];
	returnTrips?: Trip[];
}

interface TripRequest extends Request {
	body: {
		from: string;
		to: string;
		goDate: string;
		returnDate: string;
	};
}
