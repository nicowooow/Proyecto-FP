import pool from "../db/connection_db.model.js";

class linkRepository {
  /**
   * Obtener los links asociados a un perfil ordenados por posición.
   *
   * @param {int} idUser - id del perfil del que se obtendrán los links
   * @returns {Promise<Array>} filas con los links asociados al perfil
   */
  getLinks(idUser) {
    const sql =
      "select id,title, url, position, is_visible from links where profile_id = $1 order by position asc";
    return pool.query(sql, [idUser]).then(({ rows }) => rows);
  }

  /**
   * Obtener un link por id.
   *
   * @param {int} id - id del link que se obtendrá
   * @returns {Promise<Array>} filas con el link solicitado
   */
  getLink(id) {
    const sql =
      "select title, url, position, is_visible from links where id = $1 limit 1";
    return pool.query(sql, [id]).then(({ rows }) => rows);
  }

  /**
   * Crear un nuevo link asociado a un perfil.
   *
   * @param {int} profile_id - id del perfil al que se asociará el link
   * @param {string} title - título del link
   * @param {string} url - url del link
   * @param {int} position - posición del link en el perfil
   * @param {boolean} is_visible - visibilidad del link en el perfil
   * @returns {Promise<number>} filas afectadas
   */
  createLink(profile_id, title, url, position, is_visible) {
    const sql =
      "insert into links (profile_id, title, url, position, is_visible) values ($1 ,$2, $3, $4, $5)";
    return pool
      .query(sql, [profile_id, title, url, position, is_visible])
      .then(({ rowCount }) => rowCount);
  }

  /**
   * Eliminar un link por id.
   *
   * @param {int} id - id del link que se eliminará
   * @returns {Promise<number>} filas afectadas
   */
  deleteLink(id) {
    const sql = "delete from links where id = $1";
    return pool.query(sql, [id]).then(({ rowCount }) => rowCount);
  }

  /**
   * Reemplazar completamente un link por id.
   *
   * @param {int} id - id del link que se actualizará
   * @param {string} title - título del link
   * @param {string} url - url del link
   * @param {int} position - posición del link en el perfil
   * @param {boolean} is_visible - visibilidad del link en el perfil
   * @returns {Promise<number>} filas afectadas
   */
  putLink(id, title, url, position, is_visible) {
    const sql =
      "update links set title = $1, url = $2, position = $3, is_visible = $4 where id = $5 ";
    return pool
      .query(sql, [title, url, position, is_visible, id])
      .then(({ rowCount }) => rowCount);
  }

  /**
   * Actualizar parcialmente un link por id.
   *
   * @param {int} id - id del link que se actualizará
   * @param {string} title - título del link
   * @param {string} url - url del link
   * @param {int} position - posición del link en el perfil
   * @param {boolean} is_visible - visibilidad del link en el perfil
   * @returns {Promise<number>} filas afectadas
   */
  patchLink(id, title, url, position, is_visible) {
    const sql =
      "update links set title = COALESCE($1,title) , url = COALESCE($2,url) , position = COALESCE($3,position) , is_visible = COALESCE($4,is_visible) where id = $5 ";
    return pool
      .query(sql, [title, url, position, is_visible, id])
      .then(({ rowCount }) => rowCount);
  }
}

export default new linkRepository();
