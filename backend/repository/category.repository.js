import pool from "../db/connection_db.model.js";

class categoryRepository {
  /**
   * Obtener todas las categorías.
   * @returns {Promise<Array>} Array de categorías
   */
  getCategories() {
    const sql = "select * from categories order by name asc";
    return pool.query(sql, []).then(({ rows }) => rows);
  }

  /**
   * Obtener una categoría por id.
   * @param {int} id - id de la categoría
   * @returns {Promise<Object|null>} categoría o null
   */
  getCategory(id) {
    const sql = "select * from categories where id = $1 limit 1";
    return pool.query(sql, [id]).then(({ rows }) => rows[0] || null);
  }

  /**
   * Crear una categoría.
   * @param {string} name - nombre de la categoría (unico)
   * @param {string} theme - tema relacionado (ej: "technology", "art", etc)
   * @returns {Promise<number>} filas afectadas
   */
  createCategory(name, theme) {
    const sql = "insert into categories (name, theme) values ($1,$2)";
    return pool.query(sql, [name, theme]).then(({ rowCount }) => rowCount);
  }

  /**
   * Eliminar categoría por id.
   * @param {int} id - id de la categoría
   * @returns {Promise<number>} filas afectadas
   */
  deleteCategory(id) {
    const sql = "delete from categories where id = $1";
    return pool.query(sql, [id]).then(({ rowCount }) => rowCount);
  }

  /**
   * Reemplazar categoría (PUT).
   * @param {int} id - id de la categoría
   * @param {string} name - nuevo nombre de la categoría
   * @param {string} theme - nuevo tema relacionado
   * @returns {Promise<number>} filas afectadas
   */
  putCategory(id, name, theme) {
    const sql = "update categories set name = $1, theme = $2 where id = $3";
    return pool.query(sql, [name, theme, id]).then(({ rowCount }) => rowCount);
  }

  /**
   * Actualizar parcialmente categoría (PATCH).
   * @param {int} id - id de la categoría
   * @param {string|null} name - nuevo nombre de la categoría o null para no cambiar
   * @param {string|null} theme - nuevo tema relacionado o null para no cambiar
   * @returns {Promise<number>} filas afectadas
   */
  patchCategory(id, name, theme) {
    const sql = "update categories set name = COALESCE($1,name), theme = COALESCE($2,theme) where id = $3";
    return pool.query(sql, [name, theme, id]).then(({ rowCount }) => rowCount);
  }
}

export default new categoryRepository();
