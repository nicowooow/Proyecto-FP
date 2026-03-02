import pool from "../db/connection_db.model.js";
import User from "../models/user.model.js";
import userRepository from "../repository/user.repository.js";

export const get_users = async (req, res) => {
	try {
		const sql = "select * from users";
		const { rows } = await pool.query(sql);
		return res.status(200).json(rows.map((row) => new User(row).toPublic()));
	} catch (error) {
		console.log(error);
	}
};

export const get_user_public = (req, res) => {
	userRepository
		.getUser(req.params.username)
		.then((user) => {
			if (!user) {
				return res.status(404).json({
					exists: false,
					message: "user not found",
				});
			}
			return res.status(200).json({ exists: true });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send("Error en el servidor error"); // importante
		});
};
export const get_user = (req, res) => {
	userRepository
		.getUser(req.params.username)
		.then((user) => {
			if (!user) {
				return res.status(404).json({
					message: "user not found",
				});
			}
			return res.status(200).json(new User(user).toPublic());
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send("Error en el servidor error"); // importante
		});
};

export const post_user = (req, res) => {
	const { username, email, password, status, role_id } = req.body;
	const verifyCode = req.verifyCode;
	userRepository
		.checkUser(username, email)
		.then((exists) => {
			if (exists) {
				return res.status(409).json({
					message: "user already exists, try other username or email",
				});
			}
			return userRepository.createUser(
				username,
				email,
				password,
				status,
				role_id,
				verifyCode,
			);
		})
		.then((rowCount) => {
			// el headersSent lo usamos para saber si se envio una respuesta HTTP anterior a esta, en este caso es el 409, si no llega dicho estatus es porque ya se ingreso en la BBDD, si hubo un error va directo al catch
			if (res.headersSent) return;
			if (rowCount === 0) {
				return res
					.status(500)
					.json({ message: "insert failed, no rows affected" });
			}
			return res.status(201).json({ message: "user created successfully" });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send("Error en el servidor error"); // importante
		});
};

export const delete_user = (req, res) => {
	userRepository
		.deleteUser(req.params.id)
		.then((rowCount) => {
			if (rowCount === 0) {
				return res.status(404).json({ message: "user not found" });
			}
			return res.status(200).json({ message: "user deleted successfully" });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send("Error en el servidor error"); // importante
		});
};

export const put_user = (req, res) => {
	const { username, email, password, status } = req.body;
	userRepository
		.putUser(req.params.id, username, email, password, status)
		.then((rowCount) => {
			if (rowCount === 0) {
				return res
					.status(404)
					.json({ message: "user not found, try other username or email" });
			}
			return res.status(200).json({
				message: "user had modify all their data login successfully",
			});
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send("Error en el servidor error"); // importante
		});
};

export const patch_user = (req, res) => {
	const { username, email, password, status, role_id } = req.body;
	userRepository
		.patchUser(req.params.id, username, email, password, status, role_id)
		.then((rowCount) => {
			if (rowCount === 0) {
				return res
					.status(404)
					.json({ message: "user not exists, try other username or email" });
			}

			return res
				.status(200)
				.json({ message: "User successfully updated their login data" });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send("Error en el servidor error"); // importante
		});
};
