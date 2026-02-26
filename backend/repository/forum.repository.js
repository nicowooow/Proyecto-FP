import pool from "../db/connection_db.model.js";

class forumRepository {
  /**
   * Obtener un foro por id.
   * @param {int} id - id del foro a buscar
   * @returns {Promise<Object|null>} retorna los datos del foro, si no existe retorna null
   */
  getForum(id) {
    const sql = "select * from forums where id = $1 limit 1";
    return pool.query(sql, [id]).then(({ rows }) => rows[0] || null);
  }

  /**
   * Obtener todos los foros.
   * @returns {Promise<Array>} retorna un array con todos los foros registrados
   */
  getForums() {
    const sql = "select * from forums";
    return pool.query(sql, []).then(({ rows }) => rows);
  }

  /**
   * Crear un foro.
   * @param {int} profileId - id del perfil creador
   * @param {string} title - título del foro
   * @param {string} description - descripción del foro
   * @param {boolean} isSensitive - si el foro es sensible o no
   * @param {boolean} isPublic - si el foro es público o privado
   * @param {string} status - estado del foro, puede ser "active", "hidden" o "deleted"
   * @returns {Promise<number>} filas afectadas
   */
  postForum(profileId, title, description, isSensitive, isPublic, status) {
    const sql =
      "insert into forums(profile_id, title, description, is_sensitive, is_public,status) values ($1,$2,$3,$4,$5,$6)";

    return pool
      .query(sql, [
        profileId,
        title,
        description,
        isSensitive,
        isPublic,
        status,
      ])
      .then(({ rowCount }) => rowCount);
  }
  /**
   * Eliminar foro por id.
   * @param {int} id - id del foro a eliminar
   * @returns {Promise<number>} filas afectadas
   */
  deleteForum(id) {
    const sql = "delete from forums where id = $1";
    return pool.query(sql, [id]).then(({ rowCount }) => rowCount);
  }
  /**
   * Reemplazar todos los campos de un foro (PUT).
   * @param {int} id - del foro a actualizar
   * @param {int} profileId - id del perfil creador
   * @param {string} title - título del foro
   * @param {string} description - descripción del foro
   * @param {boolean} isSensitive - si el foro es sensible o no
   * @param {boolean} isPublic - si el foro es público o privado
   * @param {string} status - estado del foro, puede ser "active", "hidden" o "deleted"
   * @returns {Promise<number>} filas afectadas
   */
  putForum(id, profileId, title, description, isSensitive, isPublic, status) {
    const sql =
      "update forums set profile_id = $1, title = $2, description = $3, is_sensitive = $4, is_public =$5, status = $6 where id = $7";
    return pool
      .query(sql, [
        profileId,
        title,
        description,
        isSensitive,
        isPublic,
        status,
        id,
      ])
      .then(({ rowCount }) => rowCount);
  }
  /**
   * Actualizar parcialmente un foro (PATCH).
   * @param {int} id - id del foro a actualizar parcialmente
   * @param {int|null} profileId - id del perfil creador o null para no cambiar
   * @param {string|null} title - título del foro o null para no cambiar
   * @param {string|null} description - descripción del foro o null para no cambiar
   * @param {boolean|null} isSensitive - si el foro es sensible o no, o null para no cambiar
   * @param {boolean|null} isPublic - si el foro es público o privado, o null para no cambiar
   * @param {string|null} status - estado del foro, puede ser "active", "hidden" o "deleted", o null para no cambiar
   * @returns {Promise<number>} filas afectadas
   */
  patchForum(id, profileId, title, description, isSensitive, isPublic, status) {
    const sql =
      "update forums set profile_id = COALESCE($1,profile_id), title = COALESCE($2,title), description = COALESCE($3,description), is_sensitive = COALESCE($4,is_sensitive), is_public = COALESCE($5,is_public), status = COALESCE($6,status) where id = $7";
    return pool
      .query(sql, [profileId, title, description, isSensitive, isPublic, status, id])
      .then(({ rowCount }) => rowCount);
  }
}

export default new forumRepository();
