import * as tokenService from "../services/token.services.js";

// Estado de sesión
export const token = (req, res) => {
	try {
		return res.json({
			isLogged: req.isLogged,
			user: req.user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// Refresh token
export const refreshToken = async (req, res) => {
	try {
		const { refreshToken } = req.body;

		const newToken = await tokenService.refreshAccessToken(refreshToken);

		return res.status(201).json({
			token: newToken,
		});
	} catch (error) {
		if (error.message === "REFRESH_REQUIRED") {
			return res.status(401).json({
				message: "refresh token required",
			});
		}

		if (error.message === "INVALID_REFRESH") {
			return res.status(403).json({
				message: "invalid or expired refresh token",
			});
		}

		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};