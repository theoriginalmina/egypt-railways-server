import { Response } from "express";
import { User } from "../entities/User";
import { AppDataSource, TestDataSource } from "../data-source";
import { hash, verify } from "argon2";
import {
	ActiveAccountRequest,
	ActiveAccountResponed,
	Failed,
	LoginRequest,
	LoginSucceeded,
	RegisterRequest,
} from "../interfaces";
import { Egyptian } from "../entities/Egyptian";
import { NonEgyptian } from "../entities/NonEgyptian";

export class UserController {
	private userRepository =
		process.env.NODE_ENV === "test"
			? TestDataSource.getRepository(User)
			: AppDataSource.getRepository(User);

	// private egyptianRepository =
	// 	process.env.NODE_ENV === "test"
	// 		? TestDataSource.getRepository(Egyptian)
	// 		: AppDataSource.getRepository(Egyptian);

	async register(
		req: RegisterRequest,
		res: Response
	): Promise<Failed | boolean> {
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
	): Promise<LoginSucceeded | Failed> {
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

		req.session.userId = user.userId;
		req.session.email = user.email;
		return {
			id: user.userId,
			email: user.email,
			active: user.active,
		};
	}

	logout(req: LoginRequest, res: Response) {
		if (req.session.userId) {
			res.clearCookie("sid");
			req.session.destroy((err) => {
				return err;
			});
		}
	}

	async activeAccount(
		req: ActiveAccountRequest,
		res: Response
	): Promise<Failed | ActiveAccountResponed> {
		const { email } = req.session;
		const user = await this.userRepository.findOne({
			where: { email },
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

		const { fullName, egyptian, phoneNumber, nationalID } = req.body;

		let egyptianInfo: Egyptian;
		let nonEgyptianInfo: NonEgyptian;

		try {
			user.fullName = fullName;
			user.egyptian = egyptian;
			user.active = true;
			if (egyptian) {
				egyptianInfo = new Egyptian();
				egyptianInfo.nationalID = nationalID;
				egyptianInfo.phoneNumber = phoneNumber;
				user.egyptianInfo = egyptianInfo;
			} else {
				nonEgyptianInfo = new NonEgyptian();
				nonEgyptianInfo.passportNumber = nationalID;
				nonEgyptianInfo.phoneNumber = phoneNumber;
				user.nonEgyptianInfo = nonEgyptianInfo;
			}
			await this.userRepository.save(user);
		} catch (err) {
			res.status(500);
			return {
				errors: [
					{
						msg: err,
					},
				],
			};
		}
		res.status(200);
		return {
			active: user.active,
		};
	}
}
