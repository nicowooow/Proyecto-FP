import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET } from "../config/config.js";
import { createAccessToken } from "../utils/jwt.utils.js";

// Validar refresh token y generar nuevo access token
export const refreshAccessToken = async (refreshToken) => {
	if (!refreshToken) {
		throw new Error("REFRESH_REQUIRED");
	}

	let payload;

	try {
		payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
	} catch (error) {
		throw new Error("INVALID_REFRESH");
	}

	const newAccessToken = createAccessToken(
		payload.id,
		payload.username,
		payload.role
	);

	return newAccessToken;
};