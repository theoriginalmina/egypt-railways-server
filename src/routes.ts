import { body, ValidationChain } from "express-validator";
import { TripController } from "./controllers/TripController";
import { UserController } from "./controllers/UserController";

type Method = "post" | "get";

interface Route {
	method: Method;
	route: string;
	controller: typeof UserController | typeof TripController;
	action: string;
	validation: ValidationChain[];
	isAuth?: boolean;
}

export const Routes: Route[] = [
	{
		method: "post",
		route: "/register",
		controller: UserController,
		action: "register",
		validation: [
			body("email").isEmail().withMessage("Invalid Email"),
			body("password").isLength({ min: 8 }).withMessage("Short Password"),
		],
	},
	{
		method: "post",
		route: "/login",
		controller: UserController,
		action: "login",
		validation: [
			body("email").isEmail().withMessage("Invalid Email"),
			body("password")
				.isLength({ min: 8 })
				.withMessage("Invalid Password"),
		],
	},
	{
		method: "get",
		route: "/logout",
		controller: UserController,
		action: "logout",
		validation: [],
	},
	{
		method: "post",
		route: "/active-account",
		controller: UserController,
		action: "activeAccount",
		validation: [
			body("fullName").isLength({ min: 10 }).withMessage("Invalid Name"),
			body("phoneNumber")
				.isNumeric()
				.withMessage("Invalid Phone Number")
				.isLength({ min: 11, max: 11 })
				.withMessage("Short Phone Number"),
			body("nationalID")
				.isNumeric()
				.isLength({ min: 14, max: 14 })
				.withMessage("Short National ID"),
		],
		isAuth: true,
	},
	{
		method: "post",
		route: "/verify-session",
		controller: UserController,
		action: "verifySession",
		validation: [],
	},
	{
		method: "post",
		route: "/trips",
		controller: TripController,
		action: "insert",
		validation: [
			body("trainId").isNumeric(),
			body("from").isLength({ min: 4 }),
			body("to").isLength({ min: 4 }),
			body("day").isNumeric().isLength({ max: 1 }),
			body("departureTime").notEmpty(),
			body("arrivalTime").notEmpty(),
			body("price").notEmpty(),
		],
	},
	{
		method: "get",
		route: "/search",
		controller: TripController,
		action: "searchTrip",
		validation: [
			body("from").notEmpty(),
			body("to").notEmpty(),
			body("goDate").notEmpty(),
		],
	},
];
