import * as tokenService from "../services/token.services.js";

// Estado de sesión
// funcion principal que retorna tanto el valor de que esta logueado y los datos del usuario
export const token = (req, res) => {
	try {
		// los datos agregados en el req vienen del middleware
		// authenticate el cual hace las comprobaciones de que si existe dicho token
		return res.json({
			isLogged: req.isLogged,
			user: req.user,
		});
		// al ser todo correcto devolvemos los valores que si esta logueado y el usuario
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "server error" });
	}
};

// funcion para refrescar el token de sesion, siempre y cuando el token original este activo y exista
export const refreshToken = async (req, res) => {
	try {
		// sacamos del body el refreshToken
		const { refreshToken } = req.body;
		const newToken = await tokenService.refreshAccessToken(refreshToken);
		
        return res.status(201).json({
            token: tokens.accessToken,      
			accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken, 
        });
	} catch (error) {
		// si no encontramos el refreshToken enviamos un estado y un mensaje de que necesitamos el token
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