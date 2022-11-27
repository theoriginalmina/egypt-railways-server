import { Request } from "express";
import { User } from "../entities/User";
import { AppDataSource, TestDataSource } from "../data-source";
import { hash } from "argon2";

interface UserResponse {
	email: string;
	password: string;
}

export class UserController {
	private userRepository =
		process.env.NODE_ENV === "test"
			? TestDataSource.getRepository(User)
			: AppDataSource.getRepository(User);

	async all() {
		return this.userRepository.find();
	}

	async one(req: Request) {
		const id = parseInt(req.params.id);
		return this.userRepository.findOne({ where: { id } });
	}

	async register(req: Request): Promise<UserResponse> {
		const { email, password, fullName } = req.body;

		const hashedPassword = await hash(password);
		const user = this.userRepository.save({
			email,
			password: hashedPassword,
			fullName,
		});

		return user;
	}

	// async login(req: Request) {

	// }

	async remove(req: Request) {
		const { id } = req.params;
		const userToRemove = await this.userRepository.findOneBy({
			id: parseInt(id),
		});
		if (!userToRemove) throw Error("User does not exist");
		await this.userRepository.remove(userToRemove);
	}
}
