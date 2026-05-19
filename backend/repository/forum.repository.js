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
   * Obtener un foro por title.
   * @param {title} title - titulo del foro a buscar
   * @returns {Promise<Object|null>} retorna los datos del foro, si no existe retorna null
   */
  getForumTitle(title) {
    const sql = "select * from forums where title ilike $1";
    return pool.query(sql, [`&${title}&`]).then(({ rows }) => rows[0] || null);
  }

  /**
   * Obtener todos los foros permitiendo paginacion con limit y offset
   */
  getForums(limit = 10, offset = 0) {
    const sql = "select * from forums order by created_at asc LIMIT $1 OFFSET $2";
    return pool.query(sql, [limit, offset]).then(({ rows }) => rows);
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
   * @param {number|null} likes - cantidad de likes
   * @param {number|null} shares - cantidad de shares
   * @returns {Promise<number>} filas afectadas
   */
  patchForum(id, profileId, title, description, isSensitive, isPublic, status, likes, shares) {
    const sql =
      "update forums set profile_id = COALESCE($1,profile_id), title = COALESCE($2,title), description = COALESCE($3,description), is_sensitive = COALESCE($4,is_sensitive), is_public = COALESCE($5,is_public), status = COALESCE($6,status), likes = COALESCE($7,likes), shares = COALESCE($8,shares) where id = $9";
    return pool
      .query(sql, [profileId, title, description, isSensitive, isPublic, status, likes, shares, id])
      .then(({ rowCount }) => rowCount);
  }

  /**
   * Buscar foros por título o descripción
   * @param {string} searchQuery - término de búsqueda
   * @param {number} limit - límite de resultados
   * @returns {Promise<Array>} lista de foros coincidentes
   */
  searchForums(searchQuery, limit = 5) {
    const sql = "select id, title, description, profile_id from forums where title ILIKE $1 OR description ILIKE $1 limit $2";
    return pool
      .query(sql, [`%${searchQuery}%`, limit])
      .then(({ rows }) => rows);
  }
}

export default new forumRepository();
