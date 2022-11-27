import { TestDataSource } from "../data-source";
import request from "supertest";
import app from "../app";
import { port } from "../config";
import { Server } from "http";
import { User } from "../entities/User";
// import { hash } from "argon2";

let server: Server;

beforeAll(async () => {
	await TestDataSource.initialize();
	server = app.listen(port);
});

afterAll(async () => {
	await TestDataSource.dropDatabase();
	await TestDataSource.destroy();
	server.close();
});

// TODO: check if session created
interface TestUser {
	email: string;
	password: string;
}
let testUser: TestUser;

describe("User", () => {
	describe("POST /users", () => {
		it("Should return 400 status and Invalid Email message When empty email is passed", async () => {
			testUser = {
				email: "",
				password: "123456789",
			};

			const { statusCode, text } = await request(app)
				.post("/users")
				.send(testUser);
			const { errors } = JSON.parse(text);

			expect(statusCode).toEqual(400);
			expect(errors[0].msg).toEqual("Invalid Email");
		});

		it("Should return 400 status and Invalid Email message When bad email is passed", async () => {
			testUser = {
				email: "no-email.com",
				password: "123456789",
			};

			const { statusCode, text } = await request(app)
				.post("/users")
				.send(testUser);
			const { errors } = JSON.parse(text);

			expect(statusCode).toEqual(400);
			expect(errors[0].msg).toEqual("Invalid Email");
		});

		it("Should return 400 status and Short Password message When empty password is passed", async () => {
			testUser = {
				email: "test@test.com",
				password: "",
			};

			const { statusCode, text } = await request(app)
				.post("/users")
				.send(testUser);
			const { errors } = JSON.parse(text);

			expect(statusCode).toEqual(400);
			expect(errors[0].msg).toEqual("Short Password");
		});

		it("Should return 400 status and Short Password message When password is less than 8 char", async () => {
			testUser = {
				email: "test@test.com",
				password: "1234567",
			};

			const { statusCode, text } = await request(app)
				.post("/users")
				.send(testUser);
			const { errors } = JSON.parse(text);

			expect(statusCode).toEqual(400);
			expect(errors[0].msg).toEqual("Short Password");
		});

		it("Should return 200 status, create and return user when email and password are passed", async () => {
			testUser = {
				email: "test@test.com",
				password: "12345678",
			};

			const { statusCode, text } = await request(app)
				.post("/users")
				.send(testUser);

			// const { errors } = JSON.parse(text);
			// console.log(statusCode, text);
			expect(statusCode).toEqual(200);
			expect(JSON.parse(text)).toMatchObject({ email: "test@test.com" });
		});

		it("Should success if the password saved into DB is encrypted", async () => {
			// const hashedPassword = await hash("12345678");

			const user = await TestDataSource.getRepository(User).findOne({
				where: { email: "test@test.com" },
			});

			expect(user?.password).toContain("$argon2id$v=19$m=65536,t=3,p=4$");
		});
	});
});
