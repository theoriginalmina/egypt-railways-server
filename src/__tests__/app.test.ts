import request from "supertest";
import app from "../app";

describe("App", () => {
	it("Should return 200", async () => {
		const response = await request(app).get("/");
		expect(response.statusCode).toEqual(200);
		expect(response.text).toEqual("Egypt Railways API");
	});
});
