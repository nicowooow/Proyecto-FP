import { createAccessToken } from "./../utils/jwt.utils.js";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET } from "../config/config.js";
import userRepository from "../repository/user.repository.js";
// import userRepository from "../repository/user.repository.js";

// funcion principal que retorna tanto el valor de que esta logueado y los datos del usuario
export const token = (req, res) => {
	try {
		// los datos agregados en el req vienen del middleware
		// authenticate el cual hace las comprobaciones de que si existe dicho token
		console.log("token");
		// al ser todo correcto devolvemos los valores que si esta logueado y el usuario
		res.json({ isLogged: req.isLogged, user: req.user });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error en el servidor" }); // importante
	}
};

// funcion para refrescar el token de sesion, siempre y cuando el token original este activo y exista
export const refreshToken = (req, res) => {
	try {
		console.log("refresh token");

		// sacamos del body el refreshToken
		const { refreshToken } = req.body;
		console.log(refreshToken);

		// si no encontramos el refreshToken enviamos un estado y un mensaje de que necesitamos el token
		if (!refreshToken) {
			return res.status(401).json({ message: "refresh token required" });
		}
		// sino hacemos una comprobacion para saber si el token es el correcto
		jwt.verify(refreshToken, JWT_REFRESH_SECRET, (error, payload) => {
			console.log("payload refresh token:", payload);
			console.log("error:", error);
			// este callback nos retorna un error si tiene y
			//  su payload => datos minimos pero utiles, lo que guardamos en el token
			if (error)
				// si nos da un error en entonces le enviamos un estado y su respuesta
				return res.status(403).json({
					message: "invalid or expired refresh token",
				});

			// si encuentra dicho token lo volvemos a generar, y metemos los datos del payload
			// para poder generar el refresh con los mismos datos que tiene el token original
			const newAccessToken = createAccessToken(
				payload.id,
				payload.username,
				payload.role,
			);

			// retornamos el  nuevo token con su estado
			return res.status(201).json({
				token: newAccessToken,
			});
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error en el servidor" }); // importante
	}
};
