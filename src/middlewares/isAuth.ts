import { ActiveAccountRequest } from "../interfaces";

export const isAuth = (req: ActiveAccountRequest) => {
	if (!req.session.userId) {
		return false;
	}
	return true;
};
