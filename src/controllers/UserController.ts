import { Request, Response } from "express";
import { User } from "../entities/User";
import { AppDataSource, TestDataSource } from "../data-source";
import { hash, verify } from "argon2";
import session from "express-session";

interface CustomError {
	value: string;
	msg: string;
	param: string;
	location: string;
}

interface ErrorResponse {
	errors?: CustomError[];
}

interface RegisterRequest extends Request {
	body: {
		email: string;
		password: string;
	};
}

interface LoginRequest extends RegisterRequest {
	session: session.Session &
		Partial<session.SessionData> & {
			userId: number;
		};
}

export class UserController {
	private userRepository =
		process.env.NODE_ENV === "test"
			? TestDataSource.getRepository(User)
			: AppDataSource.getRepository(User);

	async register(
		req: RegisterRequest,
		res: Response
	): Promise<ErrorResponse | boolean> {
		const { email, password } = req.body;

		const user = await this.userRepository.findOne({
			where: {
				email,
			},
		});

		if (user) {
			res.status(400);
			return {
				errors: [
					{
						value: email,
						msg: "Email already exists",
						param: "email",
						location: "body",
					},
				],
			};
		}

		const hashedPassword = await hash(password);
		await this.userRepository.insert({
			email,
			password: hashedPassword,
		});
		res.status(201);
		return true;
	}

	async login(
		req: LoginRequest,
		res: Response
	): Promise<ErrorResponse | boolean> {
		const { email, password } = req.body;

		const user = await this.userRepository.findOne({
			where: {
				email,
			},
		});

		if (!user) {
			res.status(404);
			return {
				errors: [
					{
						value: email,
						msg: "Email is not registered",
						param: "email",
						location: "body",
					},
				],
			};
		}

		const valid = await verify(user.password, password);
		if (!valid) {
			res.status(400);
			return {
				errors: [
					{
						value: password,
						msg: "Wrong Password",
						param: "password",
						location: "body",
					},
				],
			};
		}

		req.session.userId = user.id;
		return true;
	}
}
