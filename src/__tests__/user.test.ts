import { TestDataSource } from "../data-source";
import request from "supertest";
import app from "../app";
import { port } from "../config";
import { Server } from "http";
import { User } from "../entities/User";

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

interface TestUser {
	email: string;
	password: string;
}
let testUser: TestUser;

const registerRoute = "/register";
const loginRoute = "/login";

describe("User", () => {
	describe("POST /register", () => {
		// #1
		it("#1 Should return 400 and /Invalid [field]/ when empty data are passed", async () => {
			testUser = {
				email: "",
				password: "",
			};

			const { statusCode, text } = await request(app)
				.post(registerRoute)
				.send(testUser);
			const { errors } = JSON.parse(text);

			expect(statusCode).toEqual(400);
			expect(errors[0].msg).toEqual("Invalid Email");
			expect(errors[1].msg).toEqual("Short Password");
		});

		// #2
		it("#2 Should return 400 and /Invalid Email/ when bad email is passed", async () => {
			testUser = {
				email: "bad-email",
				password: "12345678",
			};

			const { statusCode, text } = await request(app)
				.post(registerRoute)
				.send(testUser);
			const { errors } = JSON.parse(text);

			expect(statusCode).toEqual(400);
			expect(errors[0].msg).toEqual("Invalid Email");
		});

		// #3
		it("#3 Should return 400 status and Short Password message when password is less than 8 char", async () => {
			testUser = {
				email: "test@test.com",
				password: "1234567",
			};

			const { statusCode, text } = await request(app)
				.post(registerRoute)
				.send(testUser);
			const { errors } = JSON.parse(text);

			expect(statusCode).toEqual(400);
			expect(errors[0].msg).toEqual("Short Password");
		});

		// #4
		it("#4 Should return 201, create user and return true when valid email and password are passed", async () => {
			testUser = {
				email: "test@test.com",
				password: "12345678",
			};

			const { statusCode, body } = await request(app)
				.post(registerRoute)
				.send(testUser);

			expect(statusCode).toEqual(201);
			expect(body).toBe(true);
		});

		// #5
		it("#5 Should success if the password saved into DB is encrypted", async () => {
			const user = await TestDataSource.getRepository(User).findOne({
				where: { email: "test@test.com" },
			});

			expect(user?.password).toContain("$argon2id$v=19$m=65536,t=3,p=4$");
		});

		// #6
		it("#6 Should return 400 and [Email already exists] when signed email try to register again", async () => {
			testUser = {
				email: "test@test.com",
				password: "12345678",
			};

			const { statusCode, text } = await request(app)
				.post(registerRoute)
				.send(testUser);

			const { errors } = JSON.parse(text);

			expect(statusCode).toEqual(400);
			expect(errors[0].msg).toEqual("Email already exists");
		});
	});

	describe("POST /login", () => {
		// #1
		it("#1 Should return 400 and /Invalid [field]/ when empty data are passed", async () => {
			testUser = {
				email: "",
				password: "",
			};

			const { statusCode, text } = await request(app)
				.post(loginRoute)
				.send(testUser);
			const { errors } = JSON.parse(text);

			expect(statusCode).toEqual(400);
			expect(errors[0].msg).toEqual("Invalid Email");
			expect(errors[1].msg).toEqual("Invalid Password");
		});

		// #2
		it("#2 Should return 400 and /Invalid Email/ when bad email is passed", async () => {
			testUser = {
				email: "bad-email",
				password: "12345678",
			};

			const { statusCode, text } = await request(app)
				.post(loginRoute)
				.send(testUser);
			const { errors } = JSON.parse(text);

			expect(statusCode).toEqual(400);
			expect(errors[0].msg).toEqual("Invalid Email");
		});

		// #3
		it("#3 Should return 404 and /Email is not registered/ when non registered email is try to login", async () => {
			testUser = {
				email: "not-registered@test.com",
				password: "12345678",
			};

			const { statusCode, text } = await request(app)
				.post(loginRoute)
				.send(testUser);
			const { errors } = JSON.parse(text);

			expect(statusCode).toEqual(404);
			expect(errors[0].msg).toEqual("Email is not registered");
		});

		// #4
		it("#4 Should return 400 and /Wrong Password/ when wrong password is passed", async () => {
			testUser = {
				email: "test@test.com",
				password: "wrong-password",
			};

			const { statusCode, text } = await request(app)
				.post(loginRoute)
				.send(testUser);
			const { errors } = JSON.parse(text);

			expect(statusCode).toEqual(400);
			expect(errors[0].msg).toEqual("Wrong Password");
		});

		// #5
		it("#5 Should return 200, login user and create session", async () => {
			testUser = {
				email: "test@test.com",
				password: "12345678",
			};

			const { statusCode, body, header } = await request(app)
				.post(loginRoute)
				.send(testUser);

			expect(statusCode).toEqual(200);
			expect(body).toBe(true);
			expect(header["set-cookie"][0]).toContain("sid=");
		});
	});
});
