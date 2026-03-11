import pool from "../db/connection_db.model.js";
class forumCommentRepository {
	/**
	 * obtenemos el comentario del foro por su id
	 *
	 * @param {int} id - id del comentario del foro a buscar
	 * @returns {Promise<Array|null>} retorna los datos del comentario del foro que se busca mediante el id, si no encuentra el comentario retorna null
	 */
	getForumComment(id) {
		const sql = "select * from forum_comments where id = $1 limit 1";
		return pool.query(sql, [id]).then(({ rows }) => rows || null);
	}

	getForumCommentsByForum(forumId) {
		const sql = `
			SELECT fc.*, p.first_name, p.last_name 
			FROM forum_comments fc 
			LEFT JOIN profiles p ON fc.profile_id = p.id 
			WHERE fc.forum_id = $1 
			ORDER BY fc.created_at DESC
		`;
		return pool.query(sql, [forumId]).then(({ rows }) => rows || []);
	}
	/**
	 * obtenemos los comentarios del foro por el id del foro
	 *
	 * @param {int} forumId - id del foro al que pertenece el comentario, es un campo obligatorio
	 * @param {int} profileId - id del perfil que crea el comentario, es un campo obligatorio
	 * @param {string} content - contenido del comentario, es un campo obligatorio
	 * @param {string} status - estado del comentario, puede ser "active", "hidden" o "deleted", es un campo obligatorio
	 * @returns {Promise<number>} filas afectadas
	 */
	postForumComments(forumId, profileId, content, status) {
		const sql =
			"insert into forum_comments(forum_id, profile_id, content, status) values ($1,$2,$3,$4)";

		return pool
			.query(sql, [forumId, profileId, content, status])
			.then(({ rowCount }) => rowCount);
	}
	/**
	 * elimina el comentario del foro por su id
	 *
	 * @param {int} id - id del comentario del foro a eliminar
	 * @returns {Promise<number>} retorna el numero de filas afectadas por la consulta
	 */
	deleteForumComment(id) {
		const sql = "delete from forum_comments where id = $1";
		return pool.query(sql, [id]).then(({ rowCount }) => rowCount);
	}

	/**
	 * actualiza el comentario del foro por su id, se actualizan todos los campos
	 *
	 * @param {int} forumId - id del foro al que pertenece el comentario, es un campo obligatorio
	 * @param {int} profileId - id del perfil que crea el comentario, es un campo obligatorio
	 * @param {string} content - contenido del comentario, es un campo obligatorio
	 * @param {int} profileId  - id del perfil que crea el comentario, es un campo obligatorio
	 * @param {string} status - estado del comentario, puede ser "active", "hidden" o "deleted", es un campo obligatorio
	 * @param {int} likes - numero de likes que tiene el comentario, es un campo obligatorio
	 * @param {int} shares  - numero de veces que se ha compartido el comentario, es un campo obligatorio
	 * @param {int} id - id del comentario a actualizar
	 * @returns {Promise<number>} retorna el numero de filas afectadas por la consulta
	 */
	putForumComment(forumId, profileId, content, status, likes, shares, id) {
		const sql =
			"update forum_comments set forum_id = $1, profile_id = $2, content = $3, status = $4, likes = $5, shares = $6 where id = $7";
		return pool
			.query(sql, [forumId, profileId, content, status, likes, shares, id])
			.then(({ rowCount }) => rowCount);
	}

	/**
	 * actualiza el comentario del foro por su id, se actualizan solo los campos que se envian en la consulta
	 *
	 * @param {int} forumId - id del foro al que pertenece el comentario, es un campo obligatorio
	 * @param {int} profileId - id del perfil que crea el comentario, es un campo obligatorio
	 * @param {string} content - contenido del comentario, es un campo obligatorio
	 * @param {string} status - estado del comentario, puede ser "active", "hidden" o "deleted", es un campo obligatorio
	 * @param {int} likes - numero de likes que tiene el comentario, es un campo obligatorio
	 * @param {int} shares - numero de veces que se ha compartido el comentario, es un campo obligatorio
	 * @param {int} id - id del comentario a actualizar
	 * @returns {Promise<number>} filas afectadas
	 */
	patchForumComment(forumId, profileId, content, status, likes, shares, id) {
		const sql =
			"update forum_comments set forum_id = COALESCE($1,forum_id), profile_id = COALESCE($2,profile_id), content = COALESCE($3,content), status = COALESCE($4,status), likes = COALESCE($5,likes), shares = COALESCE($6,shares) where id = $7";
		return pool
			.query(sql, [forumId, profileId, content, status, likes, shares, id])
			.then(({ rowCount }) => rowCount);
	}
}

export default new forumCommentRepository();
