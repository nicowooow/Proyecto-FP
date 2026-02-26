// import fs from "fs/promises";
// import path from "path";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/config.js";
import { crearClaveAuth } from "../utils/crearclave.js";
import { sendEmail } from "../utils/nodemailer.utils.js";
//middleware para saber si el usuario esta autentificado o no
export const authenticate = (req, res, next) => {
	try {
		// el frontend nos manda por el req, el header y dicho header contiene el JWT
		//de autenticacion
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return res.status(401).json({
				message: "we can not find your access key",
				isLogged: false,
			});
		}

		const token = authHeader.split(" ")[1];
		if (!token) {
			return res.status(401).json({
				message: "we can not found your access key",
				isLogged: false,
			});
		}

/* 		puede ser repetitivo
		if (!jwt.verify(token, JWT_ACCESS_SECRET)) {
		  return res.status(401).json({
		    message: "we can not found your access key",
		    isLogged : false
		  });
		} */

		// verify lanza error si el token es inválido o expiró
		const payload = jwt.verify(token, JWT_ACCESS_SECRET);

		// guarda los datos del usuario para usarlos en el controller
		req.user = payload; // { id, username, role }
		req.isLogged = true;

		console.log("TOKEN OK:", payload);
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
