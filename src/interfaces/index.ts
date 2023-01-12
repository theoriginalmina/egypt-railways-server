import { Request } from "express";
import session from "express-session";

// Genral interfaces
interface CustomError {
	value?: string;
	msg?: string;
	param?: string;
	location?: string;
}

// Requests
export interface ExtendedSession extends Request {
	session: session.Session &
		Partial<session.SessionData> & {
			userId: number;
			email: string;
			active: boolean;
		};
}

export interface UserRequest extends ExtendedSession {
	body: {
		email: string;
		password: string;
	};
}

export interface ActiveAccountRequest extends ExtendedSession {
	body: {
		fullName: string;
		egyptian: boolean;
		phoneNumber: string;
		nationalID: string;
		savedSessionId: string;
	};
}

export interface VerifySessionRequest extends ExtendedSession {
	body: {
		savedSessionId: string;
	};
}

// Responeds
export interface Failed {
	errors?: CustomError[];
}

export interface LoginSucceeded {
	id: number;
	email: string;
	active: boolean;
	sessionId: string;
}

export interface ActiveAccountResponed {
	active: boolean;
}

export interface VerifySessionResponed {
	id: number;
	email: string;
	active: boolean;
}
