import jwt from "jsonwebtoken";

export const createToken = (id, sessionUUID) => {
	return jwt.sign(
		{
			sessionId: id,
			sessionUUID,
		},
		process.env.JWT_SECRET
	);
}

interface JWT {
	sessionId?: string;
	sessionUUID?: string;
	error?: string;
}
export const parseJWT = (token): JWT => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET) as JWT;
	} catch (err) {
		return { error: err.message };
	}
}
