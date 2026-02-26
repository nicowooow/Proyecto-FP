import pool from "../db/connection_db.model.js";

class roleRepository {
  /**
   * Obtener todos los roles disponibles.
   *
   * @returns {Promise<Array>} Array de roles disponibles
   */
  getRoles() {
    const sql = "select * from roles order by id asc";
    return pool.query(sql, []).then(({ rows }) => rows);
  }

  /**
   * Obtener un rol por su id.
   *
   * @param {int} id - id del rol
   * @returns {Promise<Object>} rol correspondiente al id
   */
  getRole(id) {
    const sql = "select * from roles where id = $1 limit 1";
    return pool.query(sql, [id]).then(({ rows }) => rows[0] || null);
  }

  /**
   * Crear un nuevo rol.
   *
   * @param {string} name - nombre del rol
   * @param {string} description - descripción del rol
   * @returns {Promise<number>} filas afectadas
   */
  createRole(name, description) {
    const sql = "insert into roles (name, description) values ($1,$2)";
    return pool
      .query(sql, [name, description])
      .then(({ rowCount }) => rowCount);
  }

  /**
   * Eliminar un rol por su id.
   *
   * @param {int} id - id del rol
   * @returns {Promise<number>} filas afectadas
   */

  deleteRole(id) {
    const sql = "delete from roles where id = $1";
    return pool.query(sql, [id]).then(({ rowCount }) => rowCount);
  }

  /**
   * Actualizar parcialmente un rol usando COALESCE en la consulta.
   * Si un campo es NULL se mantiene el valor actual en la BBDD.
   *
   * @param {int} id - id del rol
   * @param {string} name - 
   * @param {string} description - 
   * @returns {Promise<number>} filas afectadas
   */
  patchRole(id, name, description) {
    const sql = `update roles set
      name = COALESCE($1, name),
      description = COALESCE($2, description)
      where id = $3`;
    return pool.query(sql, [name, description, id]).then(({ rowCount }) => rowCount);
  }
}

export default new roleRepository();
