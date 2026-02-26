import pool from "../db/connection_db.model.js";

class forumCategoryRepository {
  /**
   * Asignar una categoría a un foro (junction table).
   * @param {int} categoryId - id de la categoría
   * @param {int} forumId - id del foro
   * @returns {Promise<number>} filas afectadas
   */
  addCategoryToForum(categoryId, forumId) {
    const sql = "insert into forum_category (category_id, forum_id) values ($1,$2)";
    return pool.query(sql, [categoryId, forumId]).then(({ rowCount }) => rowCount);
  }

  /**
   * Eliminar relación categoría-foro.
   * @param {int} categoryId - id de la categoría
   * @param {int} forumId - id del foro
   * @returns {Promise<number>} filas afectadas
   */
  removeCategoryFromForum(categoryId, forumId) {
    const sql = "delete from forum_category where category_id = $1 and forum_id = $2";
    return pool.query(sql, [categoryId, forumId]).then(({ rowCount }) => rowCount);
  }

  /**
   * Obtener categorías asignadas a un foro.
   * @param {int} forumId - id del foro
   * @returns {Promise<Array>} array de category_id
   */
  getCategoriesByForum(forumId) {
    const sql = "select category_id from forum_category where forum_id = $1";
    return pool.query(sql, [forumId]).then(({ rows }) => rows);
  }
}

export default new forumCategoryRepository();
