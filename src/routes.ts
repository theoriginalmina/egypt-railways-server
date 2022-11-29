import { body, ValidationChain } from "express-validator";
import { UserController } from "./controllers/UserController";

type Method = "post" | "get";

interface Route {
	method: Method;
	route: string;
	controller: typeof UserController;
	action: string;
	validation: ValidationChain[];
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
];

// export const Routes = [
// 	{
// 		method: "get",
// 		route: "/users",
// 		controller: UserController,
// 		action: "all",
// 		validation: [],
// 	},
// 	{
// 		method: "get",
// 		route: "/users/:id",
// 		controller: UserController,
// 		action: "one",
// 		validation: [param("id").isInt()],
// 	},
// 	{
// 		method: "post",
// 		route: "/users",
// 		controller: UserController,
// 		action: "register",
// 		validation: [
// 			body("email").isEmail().withMessage("Invalid Email"),
// 			body("password").isLength({ min: 8 }).withMessage("Short Password"),
// 		],
// 	},
// 	{
// 		method: "post",
// 		route: "/user",
// 		controller: UserController,
// 		action: "login",
// 		validation: [
// 			body("email").isEmail().withMessage("Invalid Email"),
// 			body("password")
// 				.isLength({ min: 8 })
// 				.withMessage("Invalid Passwords"),
// 		],
// 	},
// 	{
// 		method: "delete",
// 		route: "/users/:id",
// 		controller: UserController,
// 		action: "remove",
// 		validation: [param("id").isInt().withMessage("User does not exists")],
// 	},
// ];
