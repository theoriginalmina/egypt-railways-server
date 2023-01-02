import express, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import morgan from "morgan";
import { Routes } from "./routes";
import redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { cors_origin } from "./config";
import { isAuth } from "./middlewares/isAuth";
import { ExpressRequest } from "./interfaces";

interface ResponseError extends Error {
	statusCode?: number;
}
const handleError = (err: ResponseError, _req: Request, res: Response) => {
	res.status(err.statusCode || 500).send({ message: err.message });
};

const app = express();

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

// Middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(
	cors({
		origin: cors_origin,
		credentials: true,
	})
);
app.use(
	session({
		name: "sid",
		store: new RedisStore({
			client: redisClient,
			disableTouch: true,
		}),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 365, // one year
			httpOnly: true,
			secure: false, // TODO: Change to true in prod
			sameSite: "lax",
		},
		saveUninitialized: false,
		secret: "mmm",
		resave: false,
	})
);

// Main Endpoint
app.get("/", (_, res: Response) => {
	res.send("Egypt Railways API");
});

// register express routes from defined application routes
Routes.forEach((route) => {
	(app as any)[route.method](
		route.route,
		...route.validation,
		async (req: ExpressRequest, res: Response, next: NextFunction) => {
			if (route.isAuth) {
				const auth = isAuth(req);
				if (!auth) {
					return res.status(401).json({
						errors: {
							message: "Not Authenticated",
						},
					});
				}
			}
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
