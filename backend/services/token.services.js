import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET } from "../config/config.js";
import { createAccessToken } from "../utils/jwt.utils.js";
import userRepository from "../repository/user.repository.js";
// Validar refresh token y generar nuevo access token
export const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new Error("REFRESH_REQUIRED");

    let payload;
    try {
        payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch {
        throw new Error("INVALID_REFRESH");
    }

	// console.log(payload);
	
    // Buscar el usuario para tener username y role
    const user = await userRepository.getUserById(payload.id);
    if (!user || user.token_version !== payload.tokenVersion) {
        throw new Error("INVALID_REFRESH");
    }

    const newAccessToken = createAccessToken(user.id, user.username, user.role);
    // Generar nuevo refresh token (rotación)
    const newRefreshToken = createRefreshToken(user.id, payload.tokenVersion);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};