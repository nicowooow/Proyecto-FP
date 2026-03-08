import pool from "../db/connection_db.model.js";
// import User from "./../models/user.model.js";
class UserRepository {
	/**
	 * Obtener un usuario por su nombre de usuario.
	 *
	 * @param {string} username - nombre de usuario
	 * @returns {Promise<Object>} usuario correspondiente al nombre de usuario
	 */
	getUser = (username) => {
		const sql = `select * from users where username = $1 limit 1`;
		return pool.query(sql, [username]).then(({ rows }) => rows[0] || null);
	};

	/**
	 * Obtener un usuario por su email o nombre de usuario (para login).
	 *
	 * @param {string} username_or_email - nombre de usuario o email
	 * @returns {Promise<Object>} usuario correspondiente al nombre de usuario o email
	 */
	checkUserSign = (username_or_email) => {
		const sql = `select * from users where username = $1 or email = $1 `;
		return pool
			.query(sql, [username_or_email])
			.then(({ rows }) => rows[0] || null);
	};

	/**
	 * Verificar si un nombre de usuario o email ya existe en la base de datos.
	 *
	 * @param {string} username - nombre de usuario
	 * @param {string} email - email del usuario
	 * @returns {Promise<boolean>} true si el usuario o email ya existe, false en caso contrario
	 */
	checkUser = (username, email) => {
		const sql = "select * from users where username=$1 or email=$2";
		return pool
			.query(sql, [username, email])
			.then(({ rowCount }) => rowCount > 0);
	};

	/**
	 * Crear un nuevo usuario.
	 *
	 * @param {string} username - nombre de usuario
	 * @param {string} email - email del usuario
	 * @param {string} password - contraseña del usuario
	 * @param {boolean} status - estado del usuario
	 * @param {int} roleId - id del rol del usuario
	 * @returns {Promise<number>} filas afectadas
	 */

	createUser = (username, email, password, status, roleId, verifyCode) => {
		const sql = `insert into users (username, email, password_hash, status, created_at, role_id, verify_code) values ($1, $2, $3, $4, $5, $6,$7) RETURNING id`;
		const date = new Date();

		return pool
			.query(sql, [username, email, password, status, date, roleId, verifyCode])
			.then(({ rows }) => {
				const userId = rows[0] ? rows[0].id : null;
				if (userId) {
					setTimeout(() => {
						this.updateVerifyCode(null, userId)
							.then((rowCount) => {
								if (rowCount === 0)
									throw new Error("Verify code was not updated");
							})
							.catch((e) => console.log(e));
					}, 5 * 60 * 1000);
				}
				return userId;
			});
	};

	/**
	 * Eliminar un usuario por su id.
	 *
	 * @param {int} id - id del usuario a eliminar
	 * @returns {Promise<number>} filas afectadas
	 */
	deleteUser = (id) => {
		const sql = "delete from users where id = $1";

		return pool.query(sql, [id]).then(({ rowCount }) => rowCount);
	};

	/**
	 * Actualizar un usuario por su id.
	 *
	 * @param {int} id - id del usuario a actualizar
	 * @param {string} username - nombre de usuario
	 * @param {string} email - email del usuario
	 * @param {string} password - contraseña del usuario
	 * @param {boolean} status - estado del usuario
	 * @param {int} token_version - versión del token del usuario
	 * @returns
	 */
	putUser = (id, username, email, password, status, token_version) => {
		const sql = `update users set username= $1, email= $2, password_hash= $3, status= $4, last_login_at = $5, token_version = $6 where id = $7 `;
		const date = new Date();
		return pool
			.query(sql, [username, email, password, status, date, token_version, id])
			.then(({ rowCount }) => rowCount);
	};

	/**
	 * Actualizar parcialmente un usuario por su id usando COALESCE.
	 *
	 * @param {int} id - id del usuario a actualizar parcialmente
	 * @param {string} username - nombre de usuario
	 * @param {string} email - email del usuario
	 * @param {string} password - contraseña del usuario
	 * @param {boolean} status - estado del usuario
	 * @param {int} role_id - id del rol del usuario
	 * @param {*} token_version
	 * @returns
	 */
	patchUser = (
		id,
		username,
		email,
		password,
		status,
		role_id,
		token_version,
	) => {
		const sql = `update users set 
      username=COALESCE($1,username), email=COALESCE($2,email), password_hash=COALESCE($3,password_hash), status=COALESCE($4,status),
      last_login_at = COALESCE($5,last_login_at ), role_id=COALESCE($6,role_id), token_version = COALESCE($7,token_version)
    where id = $8`;
		const date = new Date();

		return pool
			.query(sql, [
				username,
				email,
				password,
				status,
				date,
				role_id,
				token_version,
				id,
			])
			.then(({ rowCount }) => rowCount);
	};

	/**
	 * con esto actualizamos el codigo de verificación o de activacion de la cuenta que se registra, el valor despues de 5 minutos se reiniciara a null
	 *
	 * @param {string|null} verifyCode
	 * @returns
	 */
	updateVerifyCode = (verifyCode = null, id) => {
		console.log(verifyCode, id);

		const sql = `update users set verify_code = $1 where id = $2 `;
		return pool
			.query(sql, [verifyCode, id])
			.then(({ rowCount }) => rowCount)
			.catch((e) => console.log(e));
	};
}

export default new UserRepository();
