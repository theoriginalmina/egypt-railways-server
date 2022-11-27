import { body, param } from "express-validator";
import { UserController } from "./controllers/UserController";

export const Routes = [
	{
		method: "get",
		route: "/users",
		controller: UserController,
		action: "all",
		validation: [],
	},
	{
		method: "get",
		route: "/users/:id",
		controller: UserController,
		action: "one",
		validation: [param("id").isInt()],
	},
	{
		method: "post",
		route: "/users",
		controller: UserController,
		action: "register",
		validation: [
			body("email").isEmail().withMessage("Invalid Email"),
			body("password").isLength({ min: 8 }).withMessage("Short Password"),
		],
	},
	{
		method: "delete",
		route: "/users/:id",
		controller: UserController,
		action: "remove",
		validation: [param("id").isInt().withMessage("User does not exists")],
	},
];
