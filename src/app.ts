import express, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import morgan from "morgan";
import { Routes } from "./routes";

interface ResponseError extends Error {
	statusCode?: number;
}
const handleError = (err: ResponseError, _req: Request, res: Response) => {
	res.status(err.statusCode || 500).send({ message: err.message });
};

const app = express();
app.use(morgan("tiny"));
app.use(express.json());

// Main Endpoint
app.get("/", (_, res: Response) => {
	res.send("Egypt Railways API");
});

// register express routes from defined application routes
Routes.forEach((route) => {
	(app as any)[route.method](
		route.route,
		...route.validation,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({
						errors: errors.array(),
					});
				}
				const result = await new (route.controller as any)()[
					route.action
				](req, res, next);
				res.json(result);
			} catch (err) {
				return next(err);
			}
		}
	);
});

app.use(handleError);

export default app;
