import { AppDataSource } from "../data-source";
import { Trip } from "../entities/Trip";
import { Request, Response } from "express";

export class TripController {
	private tripRepo = AppDataSource.getRepository(Trip);

	insert = async (req: Request, res: Response) => {
		const {
			trainId,
			from,
			to,
			departureStation,
			arrivalStation,
			day,
			departureTime,
			arrivalTime,
			price,
		} = req.body;

		const oneArr = departureTime.split(":");
		const twoArr = arrivalTime.split(":");

		const first = Number(oneArr[0]) * 60 + Number(oneArr[1]);
		const second = Number(twoArr[0]) * 60 + Number(twoArr[1]);

		let diff = second - first;

		let hours = 0;
		let minutes = 0;

		while (diff >= 60) {
			hours += 1;
			diff -= 60;
		}

		minutes = diff;

		const tripDuration = hours + "h" + minutes + "m";

		try {
			await this.tripRepo.insert({
				trainId,
				from,
				to,
				departureStation,
				arrivalStation,
				day,
				departureTime,
				arrivalTime,
				tripDuration,
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

	test = async (req: Request, res: Response) => {
		const { one, two } = req.body;

		const oneArr = one.split(":");
		const twoArr = two.split(":");

		const first = Number(oneArr[0]) * 60 + Number(oneArr[1]);
		const second = Number(twoArr[0]) * 60 + Number(twoArr[1]);

		let diff = second - first;

		let hours = 0;
		let minutes = 0;

		while (diff >= 60) {
			hours += 1;
			diff -= 60;
		}

		minutes = diff;

		console.log(hours, minutes);
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
