// import fs from "fs/promises";
// import path from "path";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/config.js";
import userRepository from "../repository/user.repository.js";
import { crearClaveAuth } from "../utils/crearclave.js";
import { sendEmail } from "../utils/nodemailer.utils.js";
//middleware para saber si el usuario esta autentificado o no
export const authenticate = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || req.headers.Authorization;
		if (!authHeader || typeof authHeader !== "string") {
			return res.status(401).json({
				message: "missing authorization header",
				isLogged: false,
			});
		}

		const [scheme, token] = authHeader.split(" ");
		if (
			scheme !== "Bearer" ||
			!token ||
			token === "undefined" ||
			token === "null"
		) {
			return res.status(401).json({
				message: "invalid authorization format",
				isLogged: false,
			});
		}

		const payload = jwt.verify(token, JWT_ACCESS_SECRET);

		// Validar token_version si existe en el payload
		if (payload.id && payload.tokenVersion !== undefined) {
			const user = await userRepository.getUserById(payload.id);
			if (!user || user.token_version !== payload.tokenVersion) {
				return res.status(401).json({
					message: "invalid or expired access key",
					isLogged: false,
				});
			}
		}

		req.user = payload;
		req.isLogged = true;
		next();
	} catch (error) {
		console.log(error);
		return res.status(401).json({
			message: "invalid or expired access key",
			isLogged: false,
		});
	}
};

export const verifyAccount = async (req, res, next) => {
	try {
		const { email } = req.body;
		const code = crearClaveAuth();
		req.verifyCode = code;

		const enviado = await sendEmail(email, code);
		if (!enviado) {
			// 502: El servidor recibió una respuesta inválida del servidor upstream (Brevo)
			return res.status(502).json({
				message: "El servicio de correo falló. Inténtalo de nuevo más tarde.",
			});
		}
		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal server error" });
	}
};


// ------------------------ MIDDLES DE PRUEBA ------------------------
// HAY QUE CREAR DISTINTOS MIDDLEWARES PARA CADA COSA, POR EJEMPLO PARA LOGEAR LOS REQUESTS, PARA VALIDAR LOS DATOS DE ENTRADA, PARA ENCRIPTAR CONTRASEÑAS, ETC
// export const requestLogger = (req, res, next) => {
// 	const date = new Date().toISOString();
// 	const logEntry = `[${date}] ${req.method} ${req.originalUrl} - IP: ${req.ip}\n`;

// 	// Usamos appendFile para añadir líneas sin borrar lo anterior
// 	// './logs.txt' guardará el archivo en la raíz del proyecto
// 	fs.appendFile(path.join(process.cwd(), "logs.txt"), logEntry, (err) => {
// 		if (err) console.error("Error al escribir en el log:", err);
// 	});

// 	next(); // ¡Importante! Pasa al siguiente proceso o la ruta se quedará "colgada"
// };
