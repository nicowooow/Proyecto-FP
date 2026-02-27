// import pool from "../db/connection_db.model.js";
import { verify_password } from "./../middlewares/password.middleware.js";
import userRepository from "../repository/user.repository.js";
import User from "./../models/user.model.js";
import { createAccessToken, createRefreshToken } from "./../utils/jwt.utils.js";
import profileRepository from "../repository/profile.repository.js";

export const sign_in_user = (req, res) => {
	// console.log(req.body);

	let { username_or_email, password } = req.body;
	// del body sacamos los datos que envia el front, en este caso la contraseñas y credenciales

	let safeUser; // esta sera una varible para almacenar el objeto, el cual es el usuario
	// en userRepository buscamos el usuario mediante su credencial
	userRepository
		.checkUserSign(username_or_email)
		.then((user) => {
			// si nos no devuelve un usuario mandamos el 404, el cual es que no fue encontrado con dicho mensaje
			if (!user) {
				return res.status(404).json({ message: "usuario no encontrado" });
			}
			// sino instanciamos el usuario
			safeUser = new User(user);

			// console.log(user);
			// console.log("safeUser -> ", safeUser);

			// verificamos que la contraseña es igual que la guardad en la BBDD
			return verify_password(password, user.password_hash);
		})
		.then((result) => {
			// si nos da TRUE
			if (result) {
				// creasmos un token con el id, username y el rol que tiene
				let accessToken = createAccessToken(
					safeUser.getId(),
					safeUser.username,
					safeUser.getRole(),
				);
				// para volver a crear dicho token tenemos que solo mandarle el id para que sea mas sencillo
				let refreshToken = createRefreshToken(
					safeUser.getId(),
					safeUser.getTokenVersion(),
				);
				// y regresamos al front un mensaje, usuario y sus tokens creados
				return res.status(200).json({
					message: "user logged in successfully",
					user: safeUser,
					accessToken,
					refreshToken,
				});
			}
			// sino en el 401, con su mensaje de que no encontramos el usuario
			return res
				.status(401)
				.json({ message: "username/email or password incorrect, try again" });
		})

		.catch((error) => {
			console.log(error);
			return res.status(500).json({ message: "Error en el servidor" }); // importante
		});
};

export const sign_up_user = (req, res) => {
	// sacamos los datos que envio el front
	let { username, email, password } = req.body;
	// sacamos el rol que tomara el usuario, todo dependera del query que tenga en la URL del fetch del frontend
	let role = req.query.role;

	// creamos un usuario
	userRepository
		.createUser(username, email, password, "pending", role)
		.then((userId) => {
			// si en el proceso sucedio un error y dicho error envio una respuesta HTTP retornamos la funcion con el resultado que nos dio
			if (res.headersSent) return;
			// si obtuvimos el ID del usuario creado
			if (userId) {
				return profileRepository
					.createProfile(
						userId,
						1, // planId default free
						username, // firstName
						null, // lastName
						"2000-01-01", // birthDate
						null, // phone
						null, // recoveryEmail
						"", // bio
						null, // imageUrl
						"light", // theme
						null, // monthly plan
						true, // isPublic
					)
					.then(() => {
						if (res.headersSent) return;
						// retornamos con estado 201, el cual significa que ya creo el usuario
						return res.status(201).json({
							message: "user created successfully",
						});
					});
			}
			// sino no se pudo crear el usuario de forma correcta
			return res.status(400).json({ message: "User not created" });
		})
		.catch((error) => {
			// console.log(error);
			// si el error de la BBDD nos da por el unique lo ponemos de esta manera (codigo de error respectivo de postgres)
			if (error.code === "23505") {
				return res
					.status(409)
					.json({ message: "Username or email already exists" });
			}
			// y si en todo dicho proceso no se encontro otra respuesta HTTP y es un error lo mandamos con el 500
			if (!res.headersSent) {
				return res
					.status(500)
					.json({ message: "Server error", detail: String(error) });
			}
		});
};

export const log_out_user = (req, res) => {
  try {
	console.log(req.user);
		
	
  } catch (error) {
	console.log(error);
	res.status(500).json({ error: 'Internal server error' });
  }
};