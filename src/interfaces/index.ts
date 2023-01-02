import { Request } from "express";
import session from "express-session";

export interface CustomError {
	value?: string;
	msg?: string;
	param?: string;
	location?: string;
}

export interface Failed {
	errors?: CustomError[];
}

export interface RegisterRequest extends Request {
	body: {
		email: string;
		password: string;
	};
}

export interface LoginRequest extends RegisterRequest {
	session: session.Session &
		Partial<session.SessionData> & {
			userId: number;
			email: string;
		};
}

export interface LoginSucceeded {
	id: number;
	email: string;
	active: boolean;
}

export interface ActiveAccountRequest extends Request {
	session: session.Session &
		Partial<session.SessionData> & {
			userId: number;
			email: string;
		};
	body: {
		fullName: string;
		egyptian: boolean;
		phoneNumber: string;
		nationalID: string;
	};
}

export interface ExpressRequest extends Request {
	session: session.Session &
		Partial<session.SessionData> & {
			userId: number;
			email: string;
		};
	body: {
		fullName: string;
		egyptian: boolean;
		phoneNumber: string;
		nationalID: string;
	};
}

export interface ActiveAccountResponed {
	active: boolean;
}
